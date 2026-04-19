import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface SellerProductState {
  products: any[];
  product: any | null;
  pagination: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SellerProductState = {
  products: [],
  product: null,
  pagination: null,
  status: "idle",
  actionStatus: "idle",
  error: null,
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/seller/products`;

const getToken = (getState: any) => {
  const { user } = getState();
  return user.userInfo?.token;
};

export const fetchPublicSellerProducts = createAsyncThunk(
  "sellerProducts/fetchPublicAll",
  async (params: { page?: number; city?: string; limit?: number } = { page: 1 }, { rejectWithValue }) => {
    try {
      const config = {
        params: {
          page: params.page || 1,
          city: params.city || undefined,
          limit: params.limit || undefined,
        },
      };
      const { data } = await axios.get(`${API_URL}/public/all`, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch marketplace products"
      );
    }
  }
);

export const fetchPublicProductsBySeller = createAsyncThunk(
  "sellerProducts/fetchPublicBySeller",
  async (sellerId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/public/seller/${sellerId}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store products"
      );
    }
  }
);

export const fetchPublicProductById = createAsyncThunk(
  "sellerProducts/fetchPublicById",
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/public/${productId}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
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
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your products"
      );
    }
  }
);

export const fetchAllProductsForAdmin = createAsyncThunk(
  "sellerProducts/fetchAllForAdmin",
  async (params: { page?: number; city?: string } = { page: 1 }, { getState, rejectWithValue }) => {
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
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products for admin"
      );
    }
  }
);

export const createSellerProduct = createAsyncThunk(
  "sellerProducts/create",
  async (productData: any, { getState, rejectWithValue }) => {
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
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateSellerProduct = createAsyncThunk(
  "sellerProducts/update",
  async ({ productId, productData }: { productId: string; productData: any }, { getState, rejectWithValue }) => {
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
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteSellerProduct = createAsyncThunk(
  "sellerProducts/delete",
  async (productId: string, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/${productId}`, config);
      return productId;
    } catch (error: any) {
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      })
      .addCase(fetchPublicProductsBySeller.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicProductsBySeller.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.pagination = null;
      })
      .addCase(fetchPublicProductsBySeller.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchPublicProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload;
      })
      .addCase(fetchPublicProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetActionStatus } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;
