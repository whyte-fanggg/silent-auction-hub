import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../hooks/useAuth"
import type { Auction, Item } from "../types"
import ItemCard from "../components/ItemCard"

const AuctionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [auction, setAuction] = useState<Auction | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  useEffect(() => {
    const fetchAuction = async () => {
      const { data, error } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error fetching auction:", error.message)
      } else {
        setAuction(data)
      }
    }

    fetchAuction()
  }, [id])

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("auction_id", id)

      if (error) {
        console.error("Error fetching items:", error.message)
      } else {
        setItems(data || [])
        console.log("Fetched items:", data);
      }

      setLoadingItems(false)
    }

    fetchItems()
  }, [id])

  const handleDeleteAuction = async () => {
    const confirmed = confirm("Are you sure you want to delete this auction?")
    if (!confirmed) return

    const { error } = await supabase
      .from("auctions")
      .delete()
      .eq("id", auction?.id)
    if (error) {
      alert("Failed to delete auction: " + error.message)
    } else {
      navigate("/auctions")
    }
  }

  // const handleDeleteItem = async (itemId: string) => {
  //   const confirmed = confirm("Delete this item?")
  //   if (!confirmed) return

  //   const { error } = await supabase.from("items").delete().eq("id", itemId)
  //   if (error) {
  //     alert("Failed to delete item: " + error.message)
  //   } else {
  //     setItems((prev) => prev.filter((item) => item.id !== itemId))
  //   }
  // }

  if (!auction) return <div className="p-6">Loading...</div>

  const isOwner = user?.id === auction.user_id

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img
        src={auction.cover_image}
        alt={auction.title}
        className="rounded-lg mb-4 w-full aspect-video object-contain bg-white"
      />

      <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
      <p className="text-gray-700 mb-4">{auction.description}</p>
      <p className="text-sm text-gray-500">
        Starts: {new Date(auction.start_time).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Ends: {new Date(auction.end_time).toLocaleString()}
      </p>

      {isOwner && (
        <div className="mb-10 flex gap-4">
          <button
            onClick={() => navigate(`/auctions/${auction.id}/edit`)}
            className="bg-yellow-500 text-black px-4 py-2 rounded"
          >
            ✏️ Edit
          </button>

          <button
            onClick={handleDeleteAuction}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            🗑️ Delete
          </button>

          <button
            onClick={() => navigate(`/auctions/${auction.id}/items/new`)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Add Item
          </button>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Auction Items</h2>

        {loadingItems ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 italic">No items added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} isOwner={isOwner} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuctionDetails
