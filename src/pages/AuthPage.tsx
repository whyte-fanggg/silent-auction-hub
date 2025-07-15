import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Navbar from "../components/Navbar"

const AuthPage = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError("")
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password)
      }
      navigate("/auctions")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Something went wrong.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar minimal />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded shadow p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Sign In" : "Create an Account"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              className="ml-2 text-indigo-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
