import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "../hooks/useAuth"

const CreateAuction = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    coverImage: null as File | null,
  })

  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, coverImage: e.target.files?.[0] ?? null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user) {
      setError("User not authenticated")
      return
    }

    let imageUrl: string | null = null

    // 1️⃣ Upload image to Supabase Storage
    if (form.coverImage) {
      const fileExt = form.coverImage.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(`auctions/${fileName}`, form.coverImage!, {
          cacheControl: "3600",
          upsert: false, // or true if you want to overwrite
        })

      if (uploadError) {
        console.error("🛑 Upload Error:", uploadError.message)
        setError("Failed to upload image")
        return
      }

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(`auctions/${fileName}`)
      imageUrl = data.publicUrl
    }

    // 2️⃣ Insert into auctions table
    const { error: insertError } = await supabase.from("auctions").insert([
      {
        title: form.title,
        description: form.description,
        start_time: form.startTime,
        end_time: form.endTime,
        cover_image: imageUrl,
        user_id: user.id,
      },
    ])

    if (insertError) {
      setError("Failed to create auction")
      return
    }

    navigate("/")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow space-y-4 mt-10"
    >
      <h2 className="text-2xl font-bold text-center">Create New Auction</h2>

      <input
        name="title"
        placeholder="Auction Title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="description"
        placeholder="Auction Description"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded resize-none"
        rows={4}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Create Auction
      </button>
    </form>
  )
}

export default CreateAuction
