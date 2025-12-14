// File: src/lib/features/products/productSlice.ts

import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/products`;
const getToken = (getState: () => RootState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

export interface Product {
  _id: string;
  user?: any;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  description: string;
  price: number;
  isSale?: boolean;
  salePrice?: number;
  category: string | string[];
  planType?: string;
  plotSize?: string;
  plotArea?: number;
  rooms?: number | string;
  bathrooms?: number;
  kitchen?: number;
  floors?: number | string;
  direction?: string;
  country?: string[];
  city?: string | string[];
  propertyType?: string;
  mainImage?: string;
  planFile?: string[];
  galleryImages?: string[];
  youtubeLink?: string;
  reviews?: any[];
  rating?: number;
  numReviews?: number;
  seo?: any;
  taxRate?: number;
  crossSellProducts?: Product[];
  upSellProducts?: Product[];
  productNo?: string | number;
  status?: "Published" | "Pending Review" | "Draft" | "Rejected";
  [key: string]: any;
}

interface FetchProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  count: number;
}

interface ProductState {
  products: Product[];
  myProducts: Product[];
  product: Product | null;
  page: number;
  pages: number;
  count: number;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: ProductState = {
  products: [],
  myProducts: [],
  product: null,
  page: 1,
  pages: 1,
  count: 0,
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk<
  FetchProductsResponse,
  { [key: string]: any },
  { rejectValue: string }
>("products/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL, { params });
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
});

export const fetchAdminProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState; rejectValue: string }
>("products/fetchAdmin", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/admin`, config);
    return data.products;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch admin products"
    );
  }
});

export const fetchMyProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState; rejectValue: string }
>("products/fetchMy", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(`${API_URL}/myproducts`, config);
    return data.products;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch your products"
    );
  }
});

export const fetchProductBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/slug/${slug}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Product not found"
    );
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchById", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${productId}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Product not found"
    );
  }
});

export const createProduct = createAsyncThunk<
  Product,
  FormData,
  { state: RootState; rejectValue: string }
>("products/create", async (productData, { getState, rejectWithValue }) => {
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
});

export const updateProduct = createAsyncThunk<
  Product,
  { productId: string; productData: FormData },
  { state: RootState; rejectValue: string }
>(
  "products/update",
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
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("products/delete", async (productId, { getState, rejectWithValue }) => {
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
});

export const createReview = createAsyncThunk<
  { message: string },
  { productId: string; reviewData: { rating: number; comment: string } },
  { state: RootState; rejectValue: string }
>(
  "products/createReview",
  async ({ productId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}/${productId}/reviews`,
        reviewData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

export const removeCsvImage = createAsyncThunk<
  Product,
  { productId: string; imageUrl: string },
  { state: RootState; rejectValue: string }
>(
  "products/removeCsvImage",
  async ({ productId, imageUrl }, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: { imageUrl },
      };
      const { data } = await axios.delete(
        `${API_URL}/${productId}/csv-image`,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove image"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.count = action.payload.count;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.myProducts = action.payload;
      })
      // <<< YEH HISSA ADD KARNA BAHUT ZAROORI HAI >>>
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      // <<< CHANGE YAHAN KHATAM HUA >>>
      .addCase(createProduct.fulfilled, (state, action) => {
        state.myProducts.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        state.myProducts = state.myProducts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.myProducts = state.myProducts.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(removeCsvImage.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        state.product = updatedProduct;
        state.products = state.products.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        state.myProducts = state.myProducts.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          if (action.type.includes("fetch")) {
            state.listStatus = "loading";
          } else {
            state.actionStatus = "loading";
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          if (state.listStatus === "loading") {
            state.listStatus = "succeeded";
          }
          if (state.actionStatus === "loading") {
            state.actionStatus = "succeeded";
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          if (state.listStatus === "loading") {
            state.listStatus = "failed";
          } else {
            state.actionStatus = "failed";
          }
          state.error = action.payload;
        }
      );
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;