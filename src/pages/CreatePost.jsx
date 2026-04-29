import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { addPost } from "../redux/slices/postSlice";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  // text fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // image file
  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("image", form.image);

    const result = await dispatch(addPost(formData));

    if (result.type === addPost.fulfilled.type) {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto px-4 py-12 bg-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Create new post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Post title..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3"
            />
          </div>

          {/* Preview */}
          {form.image && (
            <img
              src={URL.createObjectURL(form.image)}
              alt="preview"
              className="w-40 h-40 object-cover rounded-xl"
            />
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={14}
              placeholder="Write your post content here..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              {loading ? "Publishing..." : "Publish post"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border px-6 py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;