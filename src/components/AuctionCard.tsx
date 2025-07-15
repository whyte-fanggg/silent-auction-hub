import type { Auction } from "../types"
import { supabase } from "../lib/supabase"

const AuctionCard = ({ auction }: { auction: Auction }) => {
  const imageUrl = supabase.storage
    .from("images")
    .getPublicUrl(auction.cover_image).data.publicUrl

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition">
      <img
        src={imageUrl}
        alt={auction.title}
        className="w-full h-48 object-cover rounded-t-lg"
        onError={(e) => {
          e.currentTarget.src = "/fallback.jpg"
        }}
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{auction.title}</h2>
        <p className="text-sm text-gray-500">
          Ends: {new Date(auction.end_time).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default AuctionCard
