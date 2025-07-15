import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type NavbarProps = {
  minimal?: boolean
}

const ADMIN_ID = "b5c7a291-45b9-44d5-b40d-0e42059c8f59" // change if needed

const Navbar = ({ minimal = false }: NavbarProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState<string | null>(null)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  useEffect(() => {
    const fetchName = async () => {
      if (!user) return
      const { data } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", user.id)
        .single()

      if (data) setFirstName(data.first_name)
    }
    fetchName()
  }, [user])

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center border-b bg-white">
      <Link to="/" className="text-xl font-bold text-gray-800">
        🧧 Silent Auction Hub
      </Link>

      {/* ⬇️ Nothing else on minimal mode */}
      {minimal ? null : (
        <>
          {user ? (
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">
                Welcome, {firstName ?? "User"}
              </span>
              <Link
                to="/create-auction"
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                ➕ Create
              </Link>
              {user.id === ADMIN_ID && (
                <Link
                  to="/admin-results"
                  className="px-3 py-1 bg-yellow-400 text-black text-sm rounded hover:bg-yellow-500"
                >
                  🏆 Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/auth"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Sign In / Sign Up
              </Link>
            </div>
          )}
        </>
      )}
    </nav>
  )
}

export default Navbar
