import type { Item } from "../types"
import { useAuth } from "../hooks/useAuth"
import BidButton from "./BidButton"

type Props = {
  item: Item
  isOwner?: boolean // passed from parent
}

const ItemCard = ({ item, isOwner }: Props) => {
  const { user } = useAuth()

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition p-4">
      {item.image && (
        <img
          src={item.image}
          alt="Item"
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
      <p className="text-gray-600 text-sm mb-2 line-clamp-3">
        {item.description}
      </p>
      <p className="text-sm text-gray-500">Starting at ${item.starting_bid}</p>

      {!isOwner && user && (
        <div className="mt-4">
          <BidButton itemId={item.id} />
        </div>
      )}
    </div>
  )
}

export default ItemCard
