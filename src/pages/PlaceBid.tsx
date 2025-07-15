import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../hooks/useAuth"
import type { Item } from "../types"

export default function PlaceBid() {
  const { id: itemId } = useParams()
  const { user } = useAuth()

  const [item, setItem] = useState<Item | null>(null)
  const [highestBid, setHighestBid] = useState<number | null>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const fetchItem = async () => {
    if (!itemId) return

    const { data: fetchedItem, error: itemError } = await supabase
      .from("items")
      .select("*")
      .eq("id", itemId)
      .single()

    if (itemError || !fetchedItem) {
      setError("Failed to load item.")
      return
    }

    setItem(fetchedItem)
  }

  const fetchHighestBid = async () => {
    if (!itemId) return

    const { data: bids } = await supabase
      .from("bids")
      .select("amount")
      .eq("item_id", itemId)
      .order("amount", { ascending: false })
      .limit(1)

    if (bids && bids.length > 0) {
      setHighestBid(bids[0].amount)
    }
  }

  useEffect(() => {
    fetchItem()
    fetchHighestBid()
  }, [itemId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!user || !item || !itemId) return

    const current = highestBid ?? item.starting_bid
    const min = current + item.min_increment
    const entered = Number(bidAmount)

    if (entered < min) {
      setError(`Bid must be at least $${min}`)
      return
    }

    const { error: insertError } = await supabase.from("bids").insert([
      {
        user_id: user.id,
        item_id: itemId,
        amount: entered,
      },
    ])

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess(true)
    setBidAmount("")
    await fetchHighestBid() // only fetch latest bid now
  }

  if (!item) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Place a Bid on {item.name}</h1>

      <p className="mb-2 font-semibold text-lg">
        Current highest bid: $
        {highestBid !== null
          ? highestBid.toFixed(2)
          : item.starting_bid.toFixed(2)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter your bid"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <p className="text-sm text-green-600">Bid placed successfully!</p>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Place Bid
        </button>
      </form>
    </div>
  )
}
