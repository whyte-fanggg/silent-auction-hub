//import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"


const Home = () => {
  const { user, logout } = useAuth()
  console.log("user from context:", user)

  if (user === null) {
    return <div className="p-6 text-gray-500">Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏠 Silent Auction Hub</h1>
      <p>Welcome, {user.email}</p>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  )
}

export default Home
