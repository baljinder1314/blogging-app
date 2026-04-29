import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPostById,
  clearCurrentPost,
  updatePost,
} from "../redux/slices/postSlice";
import { Toaster } from "react-hot-toast";

function EditPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentPost, loading } = useSelector((state) => state.posts);

  let newPost = currentPost?.post;

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    dispatch(getPostById(id));

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (newPost) {
      setForm({
        title: newPost.title,
        content: newPost.content,
      });
    }
  }, [newPost]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      updatePost({
        postId: id,
        postData: form,
      }),
    );

    if (result.type === updatePost.fulfilled.type) {
      navigate(`/post/${id}`);
    }
  };

  if (loading && !newPost) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-2xl shadow"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border rounded-xl px-4 py-3"
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows="10"
          placeholder="Content"
          className="w-full border rounded-xl px-4 py-3"
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-xl cursor-pointer"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
