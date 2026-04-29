import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FileText,
  MessageSquare,
  Heart,
  Eye,
  PlusCircle,
  User,
  Pencil,
  Trash2,
} from "lucide-react";

import { logoutUser } from "../redux/slices/authSlice";
import { deletePost, getAllPost } from "../redux/slices/postSlice";
import { getUserComments } from "../redux/slices/commentSlice";
import api from "../services/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { posts = [] } = useSelector((state) => state.posts);
  const { currentPost, loading, error } = useSelector((state) => state.posts);
  const { commentCount, comments, userComments } = useSelector(
    (state) => state.comments,
  );

  const userData = user?.data?.user;

  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  useEffect(() => {
    dispatch(getAllPost());
    dispatch(getUserComments());
  }, [dispatch]);

  // Filter posts to show only current user's posts
  const myPosts = posts.filter(
    (post) =>
      post.author?._id === userData?._id || post.author === userData?._id,
  );

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (result.type === logoutUser.fulfilled.type) {
      navigate("/login");
    }
  };

  const handleDelete = async (id) => {
    await dispatch(deletePost(id));
    dispatch(getAllPost());
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!profileImage) return alert("Select image first");

    try {
      setUploadLoading(true);

      const formData = new FormData();
      formData.append("profileImage", profileImage);

      await api.post("/upload", formData);

      setShowModal(false);
      setProfileImage(null);
    } catch (error) {
      console.log(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Posts",
      value: myPosts.length,
      icon: <FileText size={22} />,
    },
    {
      title: "Comments",
      value: commentCount,
      icon: <MessageSquare size={22} />,
    },
    {
      title: "Likes",
      value: 132,
      icon: <Heart size={22} />,
    },
    {
      title: "Views",
      value: "2.4K",
      icon: <Eye size={22} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {userData?.profileImage ? (
              <img
                src={userData.profileImage}
                alt="avatar"
                className="w-32 h-32 rounded-full object-contain border-4 border-white shadow"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-semibold">
                {getInitials(userData?.fullName)}
              </div>
            )}

            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {userData?.fullName || "User"}
            </h1>

            <p className="text-gray-500 mt-1">{userData?.email}</p>

            <p className="text-gray-500 text-sm mt-1">
              {userData?.bio || "No bio yet"}
            </p>

            <div className="flex flex-wrap gap-6 mt-5">
              {stats.map((item) => (
                <div key={item.title}>
                  <p className="text-xl font-bold">{item.value}</p>
                  <p className="text-sm text-gray-500">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to="/create-post"
              className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <PlusCircle size={16} />
              New Post
            </Link>

            <button
              onClick={() => setShowModal(true)}
              className="border px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <User size={16} />
              Add Image
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
                </div>

                <div className="bg-gray-100 p-3 rounded-xl">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Posts */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between mb-5">
            <h2 className="text-xl font-semibold">My Posts</h2>

            <Link to="/create-post" className="text-blue-600">
              + New Post
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-3">Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {myPosts.length > 0 ? (
                  myPosts.map((post) => (
                    <tr key={post._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 font-medium">
                        <Link
                          to={`/post/${post._id}`}
                          className="hover:text-blue-600"
                        >
                          {post.title}
                        </Link>
                      </td>

                      <td>{new Date(post.updatedAt).toLocaleDateString()}</td>

                      <td>
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          Published
                        </span>
                      </td>

                      <td>
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/edit-post/${post._id}`}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Pencil size={18} className="text-blue-600" />
                          </Link>

                          <button
                            onClick={() => handleDelete(post._id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No posts found.{" "}
                      <Link
                        to="/create-post"
                        className="text-blue-600 hover:underline"
                      >
                        Create your first post
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] space-y-4">
            <h2 className="text-xl font-bold">Upload Profile Image</h2>

            <input type="file" accept="image/*" onChange={handleFileChange} />

            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                className="bg-black text-white px-4 py-2 rounded-xl"
              >
                {uploadLoading ? "Uploading..." : "Upload"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
