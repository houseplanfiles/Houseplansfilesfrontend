import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  pagination: null,
  status: "idle",
  actionStatus: "idle",
  error: null,
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/seller/products`;

const getToken = (getState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

export const fetchPublicSellerProducts = createAsyncThunk(
  "sellerProducts/fetchPublicAll",
  async (params = { page: 1 }, { rejectWithValue }) => {
    try {
      const config = {
        params: {
          page: params.page || 1,
          city: params.city || undefined,
        },
      };
      const { data } = await axios.get(`${API_URL}/public/all`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch marketplace products"
      );
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  "sellerProducts/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(API_URL, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your products"
      );
    }
  }
);

export const fetchAllProductsForAdmin = createAsyncThunk(
  "sellerProducts/fetchAllForAdmin",
  async (params = { page: 1 }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: params.page || 1,
          city: params.city || undefined,
        },
      };
      const { data } = await axios.get(`${API_URL}/admin/all`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products for admin"
      );
    }
  }
);

export const createSellerProduct = createAsyncThunk(
  "sellerProducts/create",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(API_URL, productData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateSellerProduct = createAsyncThunk(
  "sellerProducts/update",
  async ({ productId, productData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/${productId}`,
        productData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteSellerProduct = createAsyncThunk(
  "sellerProducts/delete",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${productId}`, config);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const sellerProductSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicSellerProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicSellerProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          totalProducts: action.payload.totalProducts,
        };
      })
      .addCase(fetchPublicSellerProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSellerProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.pagination = null;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllProductsForAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProductsForAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllProductsForAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createSellerProduct.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(createSellerProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.products.unshift(action.payload);
      })
      .addCase(createSellerProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateSellerProduct.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateSellerProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSellerProduct.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteSellerProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetActionStatus } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;
