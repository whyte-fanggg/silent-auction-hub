import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { v4 as uuidv4 } from "uuid"

const EditAuction = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    cover_image: "",
  })

  const [newImage, setNewImage] = useState<File | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAuction = async () => {
      const { data, error } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        setError("Could not load auction")
      } else {
        setForm({
          title: data.title,
          description: data.description,
          start_time: data.start_time,
          end_time: data.end_time,
          cover_image: data.cover_image,
        })
      }
    }

    fetchAuction()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setNewImage(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    let imagePath = form.cover_image

    if (newImage) {
      const ext = newImage.name.split(".").pop()
      const fileName = `${uuidv4()}.${ext}`
      const fullPath = `auctions/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fullPath, newImage, { upsert: false })

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message)
        return
      }

      imagePath = supabase.storage.from("images").getPublicUrl(fullPath)
        .data.publicUrl
    }

    const { error } = await supabase
      .from("auctions")
      .update({
        title: form.title,
        description: form.description,
        start_time: form.start_time,
        end_time: form.end_time,
        cover_image: imagePath,
      })
      .eq("id", id)

    if (error) {
      setError(error.message)
    } else {
      navigate(`/auctions/${id}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4 mt-10"
    >
      <h2 className="text-2xl font-bold text-center">Edit Auction</h2>

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
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        rows={4}
        className="w-full p-2 border rounded"
      />

      <input
        type="datetime-local"
        name="start_time"
        value={form.start_time.slice(0, 16)}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="datetime-local"
        name="end_time"
        value={form.end_time.slice(0, 16)}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  )
}

export default EditAuction
