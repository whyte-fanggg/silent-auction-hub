// src/pages/EditItem.tsx

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
// import { useAuth } from "../hooks/useAuth"
// import type { Item } from "../types"

export default function EditItem() {
  const { id } = useParams() // item id
  const navigate = useNavigate()
  //const { user } = useAuth()

  const [form, setForm] = useState({
    name: "",
    description: "",
    starting_bid: "",
    min_increment: "",
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", id)
        .single()
      if (error || !data) {
        setError("Item not found.")
      } else {
        setForm({
          name: data.name,
          description: data.description,
          starting_bid: data.starting_bid.toString(),
          min_increment: data.min_increment.toString(),
        })
      }
      setLoading(false)
    }
    fetchItem()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase
      .from("items")
      .update({
        name: form.name,
        description: form.description,
        starting_bid: parseFloat(form.starting_bid),
        min_increment: parseFloat(form.min_increment),
      })
      .eq("id", id)

    if (error) {
      setError("Update failed.")
    } else {
      navigate(-1) // go back
    }
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white mt-10 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Item</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="starting_bid"
          type="number"
          value={form.starting_bid}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="min_increment"
          type="number"
          value={form.min_increment}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
