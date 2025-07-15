import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"

type Auction = {
  id: string
  title: string
  cover_image: string
  start_time: string
  end_time: string
}

const AuctionList = () => {
  const [auctions, setAuctions] = useState<Auction[]>([])

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const { data, error } = await supabase
          .from("auctions")
          .select("*")
          .order("start_time", { ascending: true })

        if (error) {
          console.error("Fetch error:", error.message)
        } else {
          setAuctions(data)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
      }
    }

    fetchAuctions()
  }, [])

  const now = new Date()

  const ongoing = auctions.filter(
    (a) => new Date(a.start_time) <= now && new Date(a.end_time) > now
  )
  const upcoming = auctions.filter((a) => new Date(a.start_time) > now)
  const ended = auctions.filter((a) => new Date(a.end_time) <= now)

  console.log("Auctions:", auctions)

  return (
    <div className="p-8 space-y-12">
      {[
        { title: "🎯 Ongoing Auctions", items: ongoing },
        { title: "⏳ Upcoming Auctions", items: upcoming },
        { title: "✅ Ended Auctions", items: ended },
      ].map(({ title, items }) => (
        <div key={title}>
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          {items.length === 0 ? (
            <p className="text-gray-500">No auctions in this section.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((auction) => (
                <Link
                  to={`/auctions/${auction.id}`}
                  key={auction.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  <img
                    src={auction.cover_image}
                    alt={auction.title}
                    className="w-full aspect-video object-contain rounded-t-lg bg-white"
                    onError={
                      (e) => (e.currentTarget.src = "/fallback.jpg") // Optional fallback image
                    }
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{auction.title}</h2>
                    <p className="text-sm text-gray-500">
                      Ends: {new Date(auction.end_time).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AuctionList
