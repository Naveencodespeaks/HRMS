// src/app/hr/layout.tsx
export default function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex-1 p-6 bg-gray-100">
      {children}
    </section>
  )
}