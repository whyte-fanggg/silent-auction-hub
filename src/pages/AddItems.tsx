// src/pages/AddItems.tsx

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../hooks/useAuth"
//import type { Item } from '../types';
import { v4 as uuidv4 } from "uuid"

export default function AddItems() {
  const { id: auctionId } = useParams() // auction ID from route
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: "",
    description: "",
    starting_bid: "",
    min_increment: "",
    imageFile: null as File | null,
  })

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement
    const { name, value, files } = target

    if (name === "imageFile" && files) {
      setForm((prev) => ({ ...prev, imageFile: files[0] }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setError("")

    if (!user) {
      setError("You must be logged in.")
      setUploading(false)
      return
    }

    if (!auctionId) {
      setError("Invalid auction.")
      setUploading(false)
      return
    }

    let imageUrl = ""

    if (form.imageFile) {
      const fileExt = form.imageFile.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `images/items/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, form.imageFile)

      if (uploadError) {
        setError("Failed to upload image.")
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from("images").getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }

    const { error: insertError } = await supabase.from("items").insert([
      {
        auction_id: auctionId,
        name: form.name,
        description: form.description,
        starting_bid: parseFloat(form.starting_bid),
        min_increment: parseFloat(form.min_increment),
        image: imageUrl,
      },
    ])

    if (insertError) {
      setError("Failed to add item.")
      setUploading(false)
      return
    }

    navigate(`/auctions/${auctionId}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add Item to Auction
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        <textarea
          name="description"
          placeholder="Item Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        <input
          name="starting_bid"
          type="number"
          step="0.01"
          placeholder="Starting Bid"
          value={form.starting_bid}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        <input
          name="min_increment"
          type="number"
          step="0.01"
          placeholder="Minimum Increment"
          value={form.min_increment}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />

        <input
          name="imageFile"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          {uploading ? "Adding Item..." : "Add Item"}
        </button>
      </form>
    </div>
  )
}
