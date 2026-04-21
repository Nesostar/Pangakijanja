import React, { useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { PACKAGE_LIMITS } from "../config/packages"

export default function AddRoom() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")
  const [roomType, setRoomType] = useState("")
  const [images, setImages] = useState([])
  const [preview, setPreview] = useState([])
  const [loading, setLoading] = useState(false)

  const userPackage = profile?.package || "Primary"
  const limit = PACKAGE_LIMITS[userPackage].listings

  // 📸 HANDLE IMAGE UPLOAD
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    setImages((prev) => [...prev, ...files])

    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPreview((prev) => [...prev, ...newPreviews])
  }

  // ❌ REMOVE IMAGE
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setPreview(preview.filter((_, i) => i !== index))
  }

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      alert("User not logged in ❌")
      return
    }

    if (images.length < 4) {
      alert("Upload at least 4 images")
      return
    }

    setLoading(true)

    try {
      // 🔥 CHECK ROOM LIMIT
      const { count, error: countError } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user.id)

      if (countError) {
        console.error(countError)
      }

      if (count >= limit) {
        alert(`🚫 Limit reached (${limit} rooms for ${userPackage})`)
        setLoading(false)
        return
      }

      // ✅ 1. CREATE ROOM
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .insert([
          {
            title,
            price,
            location,
            room_type: roomType,
            owner_id: user.id,
          },
        ])
        .select()
        .single()

      if (roomError) {
        console.error("ROOM INSERT ERROR:", roomError)
        alert(roomError.message)
        setLoading(false)
        return
      }

      const roomId = roomData.id
      console.log("✅ ROOM CREATED:", roomId)

      // ✅ 2. UPLOAD IMAGES
      let imageUrls = []

      for (let file of images) {
        const fileName = `${user.id}/${Date.now()}_${file.name}`

        const { error: uploadError } = await supabase.storage
          .from("rooms")
          .upload(fileName, file)

        if (uploadError) {
          console.error("UPLOAD ERROR:", uploadError)
          alert(uploadError.message)
          setLoading(false)
          return
        }

        const { data } = supabase.storage
          .from("rooms")
          .getPublicUrl(fileName)

        imageUrls.push(data.publicUrl)
      }

      console.log("✅ IMAGE URLS:", imageUrls)

      // ✅ 3. UPDATE ROOM WITH IMAGES
      const { error: updateError } = await supabase
        .from("rooms")
        .update({ images: imageUrls })
        .eq("id", roomId)

      if (updateError) {
        console.error("UPDATE ERROR:", updateError)
        alert("Failed to save images")
        setLoading(false)
        return
      }

      alert("Room added successfully ✅")
      navigate("/listings")

    } catch (err) {
      console.error("🔥 UNEXPECTED ERROR:", err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-6xl p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Room
        </h2>

        {/* PACKAGE INFO */}
        <p className="text-center text-gray-600 mb-6">
          Package: <b>{userPackage}</b> (Max {limit} listings)
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div>
            <input
              placeholder="Room Title"
              className="w-full border p-3 rounded mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              placeholder="Price"
              type="number"
              className="w-full border p-3 rounded mb-3"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              placeholder="Location"
              className="w-full border p-3 rounded mb-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <select
              className="w-full border p-3 rounded mb-3"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              required
            >
              <option value="">Select Room Type</option>
              <option value="Single">Single</option>
              <option value="Master">Master</option>
              <option value="Self-contained">Self-contained</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
              <p className="text-gray-600">
                Click or drag images here
              </p>
              <p className="text-sm text-gray-400">
                Upload multiple images (min 4)
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {/* PREVIEW */}
            {preview.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {preview.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt="preview"
                      className="w-full h-24 object-cover rounded"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Save Room"}
        </button>
      </form>
    </div>
  )
}