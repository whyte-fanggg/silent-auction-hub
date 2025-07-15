export type Auction = {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  cover_image: string
  user_id?: string
}

export type Item = {
  id: string
  name: string
  description: string
  image: string
  starting_bid: number
  min_increment: number
  auction_id: string
}

export type Bid = {
  id: string
  amount: number
  user_id: string
  item_id: string
  created_at: string
}

export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
}

export type WinnerResult = {
  item_name: string
  user_email: string
  max_bid: number
}
