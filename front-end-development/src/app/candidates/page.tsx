  "use client"

  import { useState } from "react"
  import { useRouter } from "next/navigation"
  import { createCandidate } from "@/lib/candidates"

  export default function CandidateProfilePage() {
    const router = useRouter()

    const [isFresher, setIsFresher] = useState(true)
    const [joiningType, setJoiningType] =
      useState<"Immediate" | "Date">("Immediate")

    const [form, setForm] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      address: "",
      highest_qualification: "",
      previous_company: "",
      role: "",
      company_location: "",
      total_experience_years: 0,
      current_ctc: 0,
      expected_ctc: 0,
      notice_period_days: 0,
      date_of_joining: "",
    })

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
    }

    // ✅ SINGLE, CORRECT handleSubmit
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        highest_qualification: form.highest_qualification,

        experience_type: isFresher ? "fresher" : "experienced",

        previous_company: isFresher ? "" : form.previous_company,
        role: isFresher ? "" : form.role,
        company_location: isFresher ? "" : form.company_location,

        total_experience_years: isFresher
          ? 0
          : Number(form.total_experience_years),

        current_ctc: Number(form.current_ctc),
        expected_ctc: Number(form.expected_ctc),
        notice_period_days: Number(form.notice_period_days),

        immediate_joining: joiningType === "Immediate",

        date_of_joining:
          joiningType === "Immediate"
            ? new Date().toISOString().split("T")[0]
            : form.date_of_joining,
      }

      try {
        await createCandidate(payload)
        router.push("/candidates")
      } catch (err: any) {
        alert(err.message || "Failed to create candidate")
      }
    }

    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">Candidate Profile</h1>
        <p className="text-gray-600 mb-6">
          Please complete your profile details
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-8 rounded-lg shadow"
        >
          {/* ================= Personal Info ================= */}
          <section>
            <h2 className="font-semibold text-lg mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="first_name" className="input" placeholder="First Name" onChange={handleChange} />
              <input name="last_name" className="input" placeholder="Last Name" onChange={handleChange} />
              <input name="phone" className="input" placeholder="Phone Number" onChange={handleChange} />
              <input name="email" className="input md:col-span-2" placeholder="Email ID" onChange={handleChange} />
              <textarea name="address" className="input md:col-span-2" placeholder="Address" onChange={handleChange} />
            </div>
          </section>

          {/* ================= Education & Experience ================= */}
          <section>
            <h2 className="font-semibold text-lg mb-4">
              Education & Experience
            </h2>

            <input
              name="highest_qualification"
              className="input mb-4"
              placeholder="Highest Qualification"
              onChange={handleChange}
            />

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isFresher}
                  onChange={() => setIsFresher(true)}
                />
                Fresher
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!isFresher}
                  onChange={() => setIsFresher(false)}
                />
                Experienced
              </label>
            </div>
          </section>

          {/* ================= Professional Details ================= */}
          {!isFresher && (
            <section>
              <h2 className="font-semibold text-lg mb-4">
                Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="previous_company" className="input" placeholder="Previous Company" onChange={handleChange} />
                <input name="role" className="input" placeholder="Role / Designation" onChange={handleChange} />
                <input name="company_location" className="input" placeholder="Company Location" onChange={handleChange} />
                <input name="total_experience_years" className="input" placeholder="Experience (Years)" onChange={handleChange} />
              </div>
            </section>
          )}

          {/* ================= Compensation ================= */}
          <section>
            <h2 className="font-semibold text-lg mb-4">
              Compensation & Availability
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="current_ctc" className="input" placeholder="Current CTC" onChange={handleChange} />
              <input name="expected_ctc" className="input" placeholder="Expected CTC" onChange={handleChange} />
              <input name="notice_period_days" className="input" placeholder="Notice Period (Days)" onChange={handleChange} />

              <select
                className="input"
                value={joiningType}
                onChange={(e) => setJoiningType(e.target.value as any)}
              >
                <option value="Immediate">Immediate Joining</option>
                <option value="Date">Select Joining Date</option>
              </select>

              {joiningType === "Date" && (
                <input
                  type="date"
                  name="date_of_joining"
                  className="input md:col-span-2"
                  onChange={handleChange}
                />
              )}
            </div>
          </section>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    )
  }
