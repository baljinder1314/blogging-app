import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getPostById, clearCurrentPost } from "../redux/slices/postSlice";
import { addComment, deleteComment } from "../redux/slices/commentSlice";
import toast from "react-hot-toast";

function PostDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { currentPost, loading, error } = useSelector((state) => state.posts);

  const { loading: commentLoading, error: commentError } = useSelector(
    (state) => state.comments,
  );

  

  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(getPostById(id));

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  const handleComment = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const result = await dispatch(
        addComment({
          postId: id,
          text,
        }),
      );

      if (result.type === addComment.fulfilled.type) {
        toast.success("Comment added successfully!");
        setText("");
        // Refresh post to get updated comments
        dispatch(getPostById(id));
      } else {
        toast.error(result.payload || "Failed to add comment");
      }
    } catch (err) {
      toast.error("Error adding comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const result = await dispatch(deleteComment(commentId));

      if (result.type === deleteComment.fulfilled.type) {
        toast.success("Comment deleted successfully!");
        // Refresh post to get updated comments
        dispatch(getPostById(id));
      } else {
        toast.error(result.payload || "Failed to delete comment");
      }
    } catch (err) {
      toast.error("Error deleting comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No post found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back */}
      <Link
        to="/"
        className="inline-block mb-4  px-2 py-1 bg-black text-white rounded-xl cursor-pointer"
      >
        ← Back
      </Link>
      <Link
        to={`/edit-post/${currentPost?.post?._id}`}
        className="inline-block mb-4  px-2 py-1 bg-black text-white rounded-xl cursor-pointer"
      >
        Edit
      </Link>

      {/* Post */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {currentPost?.post?.image && (
          <img
            src={currentPost.post.image}
            alt={currentPost.post.title}
            className="w-full h-96 object-contain"
          />
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-3">
            {currentPost?.post?.title}
          </h1>

          <p className="text-gray-500 mb-4">
            {new Date(currentPost?.post?.createdAt).toLocaleDateString()}
          </p>

          <p className="text-gray-700 leading-7">
            {currentPost?.post?.content}
          </p>

          <div className="mt-6 pt-4 border-t">
            <p className="font-medium">
              Author: {currentPost?.post?.author?.fullName}
            </p>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-5">Comments</h2>

        {/* Add Comment */}
        <form
          onSubmit={handleComment}
          className="flex gap-3 mb-6 flex-col md:flex-row "
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write comment..."
            className="flex-1 border rounded-xl px-4 py-3"
          />

          <button
            type="submit"
            disabled={commentLoading}
            className="bg-black text-white px-5 py-3 rounded-xl disabled:opacity-50"
          >
            {commentLoading ? "Adding..." : "Comment"}
          </button>
        </form>

        {commentError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
            {commentError}
          </div>
        )}

        {/* All Comments */}
        {currentPost?.comments && currentPost.comments.length > 0 ? (
          <div className="space-y-4">
            {currentPost.comments.map((comment) => (
              <div
                key={comment._id}
                className="border rounded-xl p-4 flex justify-between items-start gap-4"
              >
                {/* User Profile Photo */}
                <div className="shrink-0">
                  <img
                    src={
                      comment.user?.profileImage ||
                      "https://ui-avatars.com/api/?name=User&background=random"
                    }
                    alt={comment.user?.fullName}
                    className="w-12 h-12 rounded-full object-contain border"
                  />
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {comment.user?.fullName}
                  </p>

                  <p className="mt-1 text-gray-700">{comment.text}</p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  disabled={commentLoading}
                  className="text-red-500 border px-2 py-1 font-semibold rounded-xl hover:bg-red-600 hover:text-white  text-sm cursor-pointer disabled:opacity-50"
                >
                  Delete
                </button>

                {/* Delete Button */}
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
