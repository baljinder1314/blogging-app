import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/axios";
import toast from "react-hot-toast";

// ─── 1. Get All Posts ───────────────────────────────────────────────
export const getAllPost = createAsyncThunk(
  "post/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/posts");

      return res?.data?.data?.post; // Extract actual array from ApiResponse
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts",
      );
    }
  },
);

// ─── 2. Get Single Post (detail) ────────────────────────────────────
export const getPostById = createAsyncThunk(
  "post/getById",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/${postId}`);
      return res.data.data; // Extract actual post from ApiResponse
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post",
      );
    }
  },
);

// ─── 3. Add / Create Post ────────────────────────────────────────────
export const addPost = createAsyncThunk(
  "post/add",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await api.post("/posts", postData);
      return res.data.data.post; // Extract actual post from ApiResponse
    } catch (error) {
      const errorMessage =
        error?.response?.data[0].message ||
        error.response.data ||
        "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post",
      );
    }
  },
);

// ─── 4. Update Post ──────────────────────────────────────────────────
export const updatePost = createAsyncThunk(
  "post/update",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/posts/${postId}`, postData);
      return res.data?.data?.post; // Extract actual post from ApiResponse
    } catch (error) {
      const errorMessage =
        error?.response?.data[0].message ||
        error.response.data ||
        "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post",
      );
    }
  },
);

// ─── 5. Delete Post ──────────────────────────────────────────────────
export const deletePost = createAsyncThunk(
  "post/delete",
  async (postId, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}`);
      return postId; // return id so we can remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post",
      );
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [], // list of all posts
    currentPost: null, // single post detail
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },

  extraReducers: (builder) => {
    // ── Get All Posts ──
    builder
      .addCase(getAllPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getAllPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Get Single Post ──
    builder
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Add Post ──
    builder
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // add new post to top of list
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Update Post ──
    builder
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        // replace the updated post in the list
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p,
        );
        state.currentPost = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Delete Post ──
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        // remove deleted post from list by id
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;
