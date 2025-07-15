import { Link } from 'react-router-dom'

const BidButton = ({ itemId }: { itemId: string }) => {
  return (
    <Link to={`/items/${itemId}/bid`} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
      Place Bid
    </Link>
  )
}

export default BidButton