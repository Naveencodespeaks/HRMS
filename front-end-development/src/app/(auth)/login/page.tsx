import LoginForm from '@/components/forms/LoginForm'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <LoginForm />
      </div>
    </div>
  )
}