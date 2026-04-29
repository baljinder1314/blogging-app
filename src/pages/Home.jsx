import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Clock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "../redux/slices/postSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { posts = [], loading } = useSelector((state) => state.posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(getAllPost());
  }, [dispatch]);

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-sm font-medium text-blue-600 mb-3">
            🚀 Share Ideas With The World
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Read, Write & Grow
            <span className="block text-blue-600">With DevBlog</span>
          </h1>

          <p className="mt-5 text-gray-500 max-w-2xl mx-auto text-lg">
            Explore blogs about coding, technology, career growth, and life.
          </p>

          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <Link
              to="/register"
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              Login to Write
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex gap-3 flex-wrap">
          {["All", "React", "Node", "MongoDB", "AI", "Career"].map(
            (item, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(item)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedCategory === item
                    ? "bg-black text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </section>

      {/* Blogs */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Latest Blogs ({filteredPosts.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading blogs...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((blog) => (
              <Link
                key={blog._id}
                to={`/post/${blog._id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
              >
                {/* Image */}
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-contain"
                  />
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {blog.content}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User size={14} />
                      <span>{blog.author?.fullName || "Unknown"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found</p>
            <p className="text-gray-400 text-sm mt-2">
              Check back soon for new content!
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          © 2026 DevBlog. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
