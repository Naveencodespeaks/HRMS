"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { CandidateCreate } from "@/types/candidate"
import { createCandidate } from "@/services/candidates.service"

const initialForm: CandidateCreate = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  address: "",
  highest_qualification: "",
  experience_type: "fresher",
  previous_company: "",
  role: "",
  company_location: "",
  total_experience_years: null,
  current_ctc: null,
  expected_ctc: 0,
  notice_period_days: null,
  immediate_joining: false,
  date_of_joining: null,
}

export default function CandidateForm() {
  const router = useRouter()

  const [form, setForm] = useState<CandidateCreate>(initialForm)
  const [resume, setResume] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isExperienced = form.experience_type === "experienced"

  const canSubmit = useMemo(() => {
    if (!form.first_name.trim()) return false
    if (!form.last_name.trim()) return false
    if (!form.phone.trim()) return false
    if (!form.email.trim()) return false
    if (!form.highest_qualification.trim()) return false
    if (!resume) return false
    if (isExperienced && form.total_experience_years === null) return false
    if (!form.immediate_joining && !form.date_of_joining) return false
    return true
  }, [form, resume, isExperienced])

  function setField<K extends keyof CandidateCreate>(
    key: K,
    value: CandidateCreate[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!resume) {
      setError("Resume is required")
      return
    }

    setIsSubmitting(true)
    try {
      const created = await createCandidate(form, resume)
      router.push(`/candidates/success?candidate_id=${created.id}`)
    } catch (err: any) {
  const detail = err?.response?.data?.detail

  if (Array.isArray(detail)) {
    setError(
      detail
        .map((e: any) => `${e.loc?.join(" → ")}: ${e.msg}`)
        .join(" | ")
    )
  } else {
    setError(detail || err?.message || "Submission failed")
  }
}
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="First name"
          value={form.first_name}
          onChange={(e) => setField("first_name", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => setField("last_name", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
        />

        <input
          className="border p-2 rounded md:col-span-2"
          placeholder="Address"
          value={form.address ?? ""}
          onChange={(e) => setField("address", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Highest qualification"
          value={form.highest_qualification}
          onChange={(e) => setField("highest_qualification", e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={form.experience_type}
          onChange={(e) => {
            const v = e.target.value as "fresher" | "experienced"
            setField("experience_type", v)
            if (v === "fresher") setField("total_experience_years", null)
          }}
        >
          <option value="fresher">Fresher</option>
          <option value="experienced">Experienced</option>
        </select>

        {isExperienced && (
          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Total experience (years)"
            value={form.total_experience_years ?? ""}
            onChange={(e) =>
              setField(
                "total_experience_years",
                e.target.value ? Number(e.target.value) : null
              )
            }
          />
        )}

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Current CTC"
          value={form.current_ctc ?? ""}
          onChange={(e) =>
            setField(
              "current_ctc",
              e.target.value ? Number(e.target.value) : null
            )
          }
        />

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Expected CTC"
          value={form.expected_ctc}
          onChange={(e) =>
            setField("expected_ctc", Number(e.target.value))
          }
        />

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Notice period (days)"
          value={form.notice_period_days ?? ""}
          onChange={(e) =>
            setField(
              "notice_period_days",
              e.target.value ? Number(e.target.value) : null
            )
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.immediate_joining}
            onChange={(e) =>
              setField("immediate_joining", e.target.checked)
            }
          />
          Immediate joining
        </label>

        {!form.immediate_joining && (
          <input
            className="border p-2 rounded"
            type="date"
            value={form.date_of_joining ?? ""}
            onChange={(e) =>
              setField("date_of_joining", e.target.value || null)
            }
          />
        )}

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Resume (PDF/DOC)</label>
          <input
            className="border p-2 rounded w-full"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  )
}