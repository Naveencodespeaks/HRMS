// // 'use client'

// // import DashboardCard from '@/components/common/DashboardCard'
// // import DataTable from '@/components/common/DataTable'
// // import { useRouter } from 'next/navigation'

// // export default function CandidateDashboard() {
// //   const router = useRouter()

// //   // Mock data - replace with actual service calls
// //   const recentApplications = [
// //     { job: 'Frontend Developer', company: 'Tech Corp', status: 'Under Review', date: '2024-01-15' },
// //     { job: 'React Developer', company: 'StartupXYZ', status: 'Interview Scheduled', date: '2024-01-12' },
// //     { job: 'UI/UX Designer', company: 'Design Studio', status: 'Rejected', date: '2024-01-10' },
// //     { job: 'Full Stack Developer', company: 'Innovation Labs', status: 'Applied', date: '2024-01-08' },
// //     { job: 'Software Engineer', company: 'Global Tech', status: 'Offer Received', date: '2024-01-05' }
// //   ]

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
// //       <p className="text-gray-600 mb-6">Track your job applications and interview progress</p>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //         <DashboardCard 
// //           title="Jobs Applied" 
// //           value="12" 
// //           subtitle="This month"
// //         />
// //         <DashboardCard 
// //           title="Interviews" 
// //           value="3" 
// //           subtitle="2 upcoming, 1 completed"
// //         />
// //         <DashboardCard 
// //           title="Offers" 
// //           value="1" 
// //           subtitle="Pending response"
// //         />
// //         <DashboardCard 
// //           title="Profile Views" 
// //           value="28" 
// //           subtitle="Last 30 days"
// //         />
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         <DataTable
// //           title="Recent Applications"
// //           headers={['Job Title', 'Company', 'Status', 'Date']}
// //           data={recentApplications}
// //           onRowClick={(item) => router.push(`/jobs/${item.job}`)}
// //         />
        
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
// //           <div className="space-y-3">
// //             <button 
// //               onClick={() => router.push('/jobs')}
// //               className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
// //             >
// //               Browse Available Jobs
// //             </button>
// //             <button 
// //               onClick={() => router.push('/interviews')}
// //               className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
// //             >
// //               View Interview Schedule
// //             </button>
// //             <button 
// //               onClick={() => router.push('/offers')}
// //               className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
// //             >
// //               Check Offer Status
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }











// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'

// export default function CandidateProfilePage() {
//   const router = useRouter()
//   const [isFresher, setIsFresher] = useState(true)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // TODO: send data to backend
//     // After success:
//     router.push('/candidates')
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-2">Candidate Profile</h1>
//       <p className="text-gray-600 mb-6">
//         Please complete your profile details
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">

//         {/* Personal Info */}
//         <section>
//           <h2 className="font-semibold mb-3">Personal Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input className="input" placeholder="First Name" />
//             <input className="input" placeholder="Last Name" />
//             <input type="date" className="input" />
//             <input className="input" placeholder="Phone Number" />
//             <input className="input md:col-span-2" placeholder="Email ID" />
//             <textarea className="input md:col-span-2" placeholder="Address" />
//           </div>
//         </section>

//         {/* Experience */}
//         <section>
//           <h2 className="font-semibold mb-3">Experience</h2>
//           <div className="flex gap-6">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={isFresher}
//                 onChange={() => setIsFresher(true)}
//               />
//               Fresher
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 checked={!isFresher}
//                 onChange={() => setIsFresher(false)}
//               />
//               Experienced
//             </label>
//           </div>
//         </section>

//         {/* Professional Details */}
//         {!isFresher && (
//           <section>
//             <h2 className="font-semibold mb-3">Professional Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input className="input" placeholder="Previous Company Name" />
//               <input className="input" placeholder="Company Location" />
//               <input className="input" placeholder="Role / Designation" />
//               <input className="input" placeholder="Total Years of Experience" />
//             </div>
//           </section>
//         )}

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
//         >
//           Save Profile
//         </button>
//       </form>
//     </div>
//   )
// }



'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CandidateProfilePage() {
  const router = useRouter()

  const [isFresher, setIsFresher] = useState(true)
  const [joiningType, setJoiningType] = useState<'Immediate' | 'Date'>('Immediate')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: API integration (POST /candidates/profile)
    router.push('/candidates')
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
          <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="First Name" />
            <input className="input" placeholder="Last Name" />
            <input className="input" placeholder="Phone Number" />
            <input className="input md:col-span-2" placeholder="Email ID" />
            <textarea className="input md:col-span-2" placeholder="Address" />
          </div>
        </section>

        {/* ================= Education & Experience ================= */}
        <section>
          <h2 className="font-semibold text-lg mb-4">Education & Experience</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="input" placeholder="Highest Qualification" />
          </div>

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

        {/* ================= Professional Details (Conditional) ================= */}
        {!isFresher && (
          <section>
            <h2 className="font-semibold text-lg mb-4">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" placeholder="Previous Company" />
              <input className="input" placeholder="Role / Designation" />
              <input className="input" placeholder="Company Location" />
              <input className="input" placeholder="Total Experience (Years)" />
            </div>
          </section>
        )}

        {/* ================= Compensation & Availability ================= */}
        <section>
          <h2 className="font-semibold text-lg mb-4">Compensation & Availability</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Current CTC (₹)" />
            <input className="input" placeholder="Expected CTC (₹)" />
            <input className="input" placeholder="Notice Period (Days)" />

            <select
              className="input"
              value={joiningType}
              onChange={(e) => setJoiningType(e.target.value as any)}
            >
              <option value="Immediate">Immediate Joining</option>
              <option value="Date">Select Joining Date</option>
            </select>

            {joiningType === 'Date' && (
              <input type="date" className="input md:col-span-2" />
            )}
          </div>
        </section>

        {/* ================= Submit ================= */}
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
