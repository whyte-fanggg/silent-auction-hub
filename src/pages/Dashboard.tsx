import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { supabase } from "../lib/supabase"

const ADMIN_ID = "a0c1a668-0c81-49fb-9dfe-b0b94f65f88e" 

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState<string | null>(null) 

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  useEffect(() => {
    const fetchName = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", user.id)
        .single()

      if (!error && data) {
        setFirstName(data.first_name)
      }
    }

    fetchName()
  }, [user])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>
      <p className="mb-6">Welcome, {firstName ?? user?.email}</p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          to="/create-auction"
          className="bg-blue-600 text-white py-2 px-4 rounded text-center"
        >
          ➕ Create Auction
        </Link>
        <Link
          to="/auctions"
          className="bg-green-600 text-white py-2 px-4 rounded text-center"
        >
          🔍 Browse Auctions
        </Link>

        {user?.id === ADMIN_ID && (
          <Link
            to="/admin-results"
            className="bg-yellow-400 text-black py-2 px-4 rounded text-center"
          >
            🏆 View Winners
          </Link>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard
