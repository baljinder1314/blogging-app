import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/axios";

// ─── 1. Add Comment ───────────────────────────────────────────────
export const addComment = createAsyncThunk(
  "comment/add",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/comment/${postId}`, { text });
      return res.data.data.comment; // Extract actual comment from ApiResponse
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment",
      );
    }
  },
);

// ─── 2. Delete Comment ─────────────────────────────────────────────
export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/comment/${commentId}`);
      return commentId; // return id so we can remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);

// ─── 3. Get User Comments ─────────────────────────────────────────
export const getUserComments = createAsyncThunk(
  "comment/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/my-comments");
      return res.data.data; // Returns { comments: [], count: number }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user comments",
      );
    }
  },
);

// ─── Initial State ─────────────────────────────────────────────────
const initialState = {
  comments: [], // list of comments (for current post)
  userComments: [], // current user's comments
  commentCount: 0, // count of current user's comments
  loading: false,
  error: null,
};

// ─── Slice ─────────────────────────────────────────────────────────
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearCommentError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },

  extraReducers: (builder) => {
    // ── Add Comment ──
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload); // add new comment to top
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Delete Comment ──
    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        // remove deleted comment from list by id
        state.comments = state.comments.filter((c) => c._id !== action.payload);
        // Also remove from user comments if it exists
        state.userComments = state.userComments.filter(
          (c) => c._id !== action.payload,
        );
        // Update comment count
        state.commentCount = state.userComments.length;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Get User Comments ──
    builder
      .addCase(getUserComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserComments.fulfilled, (state, action) => {
        state.loading = false;
        state.userComments = action.payload.comments;
        state.commentCount = action.payload.count;
      })
      .addCase(getUserComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.commentCount = 0;
      });
  },
});

export const { clearCommentError, clearComments } = commentSlice.actions;
const commentReducer = commentSlice.reducer;
export default commentReducer;
