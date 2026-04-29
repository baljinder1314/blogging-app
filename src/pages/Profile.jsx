import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Mail, User, FileText, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { logoutUser } from "../redux/slices/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const userData = user?.data?.user;

  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Get initials for avatar fallback
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!profileImage) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("profileImage", profileImage);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.success("Profile image updated successfully!");
        setShowModal(false);
        setProfileImage(null);
        setPreviewImage(null);
        // Refresh page to show updated profile
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    if (result.type === logoutUser.fulfilled.type) {
      toast.success("Logged out successfully!");
      navigate("/login");
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-black to-white h-32"></div>

        {/* Profile Info */}
        <div className="px-6 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Profile Image */}
            <div className="-mt-16 relative">
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-contain bg-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-semibold shadow-lg">
                  {getInitials(userData?.fullName)}
                </div>
              )}

              {/* Change Profile Image Button */}
              <button
                onClick={() => setShowModal(true)}
                className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition shadow-lg"
                title="Change profile picture"
              >
                <Camera size={18} />
              </button>
            </div>

            {/* User Info */}
            <div className="pb-2 flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                {userData?.fullName || "User"}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Mail size={16} />
                {userData?.email}
              </p>
              {userData?.bio && (
                <p className="text-gray-600 mt-3 text-lg">{userData.bio}</p>
              )}
            </div>

            {/* Logout Button */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="mt-10 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name - Display Only */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 bg-gray-50">
                  <User size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={userData?.fullName || ""}
                    disabled
                    className="w-full outline-none bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Display name (read-only)
                </p>
              </div>

              {/* Email - Display Only */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 bg-gray-50">
                  <Mail size={18} className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={userData?.email || ""}
                    disabled
                    className="w-full outline-none bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email address (read-only)
                </p>
              </div>

              {/* Bio - Display Only */}
              {userData?.bio && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Bio
                  </label>
                  <div className="flex items-start border border-gray-300 rounded-xl px-3 py-3 bg-gray-50">
                    <FileText size={18} className="text-gray-400 mt-3 mr-2" />
                    <textarea
                      rows="4"
                      value={userData?.bio || ""}
                      disabled
                      className="w-full outline-none bg-gray-50 text-gray-700 resize-none cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Bio (read-only)</p>
                </div>
              )}
            </div>

            {/* Info Message */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Note:</strong> Your profile details are read-only.
                You can only change your profile image by clicking the camera
                icon on your profile photo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Change Profile Picture
            </h2>

            {/* Preview */}
            {previewImage ? (
              <div className="flex justify-center">
                <img
                  src={previewImage}
                  alt="preview"
                  className="w-48 h-48 rounded-full object-contain border-4 border-blue-200"
                />
              </div>
            ) : userData?.profileImage ? (
              <div className="flex justify-center">
                <img
                  src={userData.profileImage}
                  alt="current"
                  className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
                No Image
              </div>
            )}

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-600 cursor-pointer hover:border-blue-400 transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF (max. 5MB)
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpload}
                disabled={!profileImage || uploading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setProfileImage(null);
                  setPreviewImage(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition font-medium"
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

export default Profile;
