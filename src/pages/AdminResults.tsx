import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import type { WinnerResult } from "../types"

const AdminResults = () => {
  const [results, setResults] = useState<WinnerResult[]>([])

  useEffect(() => {
    const fetchWinners = async () => {
      const { data } = await supabase.rpc("get_highest_bids") // assume a Postgres function for this or use grouped query
      setResults(data || [])
    }
    fetchWinners()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏆 Auction Winners</h1>
      <div className="space-y-4">
        {results.map((row, i) => (
          <div key={i} className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">{row.item_name}</h2>
            <p>Winner: {row.user_email}</p>
            <p>Winning Bid: ${row.max_bid}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminResults
