import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

export interface ProductState {
  products: Product[];
  myProducts: Product[];
  homeFloorPlans: Product[];
  homeElevations: Product[];
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
  homeFloorPlans: [],
  homeElevations: [],
  product: null,
  page: 1,
  pages: 1,
  count: 0,
  listStatus: "idle",
  actionStatus: "idle",
  error: null,
};

// PUBLIC ENDPOINT - No authentication required
export const fetchProducts = createAsyncThunk<
  FetchProductsResponse,
  { [key: string]: any },
  { rejectValue: string }
>("products/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL, {
      params,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error: any) {
    console.error("Fetch products error:", error);
    return rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch products"
    );
  }
});

// Separate thunk for Home Floor Plans to avoid state collision
export const fetchHomeFloorPlans = createAsyncThunk<
  FetchProductsResponse,
  { [key: string]: any },
  { rejectValue: string }
>("products/fetchHomeFloorPlans", async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL, {
      params,
      timeout: 15000,
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch floor plans");
  }
});

// Separate thunk for Home Elevations to avoid state collision
export const fetchHomeElevations = createAsyncThunk<
  FetchProductsResponse,
  { [key: string]: any },
  { rejectValue: string }
>("products/fetchHomeElevations", async (params, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL, {
      params,
      timeout: 15000,
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch elevations");
  }
});

export const fetchAdminProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState; rejectValue: string }
>("products/fetchAdmin", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState);
    if (!token) {
      return rejectWithValue("Please login to access admin products");
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    };
    const { data } = await axios.get(`${API_URL}/admin`, config);
    return data.products;
  } catch (error: any) {
    console.error("Fetch admin products error:", error);
    if (error.response?.status === 401) {
      return rejectWithValue("Session expired. Please login again.");
    }
    return rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch admin products"
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
    if (!token) {
      return rejectWithValue("Please login to view your products");
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    };
    const { data } = await axios.get(`${API_URL}/myproducts`, config);
    return data.products;
  } catch (error: any) {
    console.error("Fetch my products error:", error);
    if (error.response?.status === 401) {
      return rejectWithValue("Session expired. Please login again.");
    }
    return rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch your products"
    );
  }
});

// PUBLIC ENDPOINT - No authentication required
export const fetchProductBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/slug/${slug}`, {
      timeout: 15000,
    });
    return data;
  } catch (error: any) {
    console.error("Fetch product by slug error:", error);
    return rejectWithValue(
      error.response?.data?.message || error.message || "Product not found"
    );
  }
});

// PUBLIC ENDPOINT - No authentication required
export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchById", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${productId}`, {
      timeout: 15000,
    });
    return data;
  } catch (error: any) {
    console.error("Fetch product by ID error:", error);
    return rejectWithValue(
      error.response?.data?.message || error.message || "Product not found"
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
    if (!token) {
      return rejectWithValue("Please login to create products");
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000,
    };
    const { data } = await axios.post(API_URL, productData, config);
    return data;
  } catch (error: any) {
    console.error("Create product error:", error);
    if (error.response?.status === 401) {
      return rejectWithValue("Session expired. Please login again.");
    }
    return rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to create product"
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
      if (!token) {
        return rejectWithValue("Please login to update products");
      }
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      };
      const { data } = await axios.put(
        `${API_URL}/${productId}`,
        productData,
        config
      );
      return data;
    } catch (error: any) {
      console.error("Update product error:", error);
      if (error.response?.status === 401) {
        return rejectWithValue("Session expired. Please login again.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to update product"
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
    if (!token) {
      return rejectWithValue("Please login to delete products");
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000,
    };
    await axios.delete(`${API_URL}/${productId}`, config);
    return productId;
  } catch (error: any) {
    console.error("Delete product error:", error);
    if (error.response?.status === 401) {
      return rejectWithValue("Session expired. Please login again.");
    }
    return rejectWithValue(
      error.response?.data?.message ||
      error.message ||
      "Failed to delete product"
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
      if (!token) {
        return rejectWithValue("Please login to submit a review");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      };
      const { data } = await axios.post(
        `${API_URL}/${productId}/reviews`,
        reviewData,
        config
      );
      return data;
    } catch (error: any) {
      console.error("Create review error:", error);
      if (error.response?.status === 401) {
        return rejectWithValue("Session expired. Please login again.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to submit review"
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
      if (!token) {
        return rejectWithValue("Please login to remove images");
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: { imageUrl },
        timeout: 15000,
      };
      const { data } = await axios.delete(
        `${API_URL}/${productId}/csv-image`,
        config
      );
      return data;
    } catch (error: any) {
      console.error("Remove CSV image error:", error);
      if (error.response?.status === 401) {
        return rejectWithValue("Session expired. Please login again.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to remove image"
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
      .addCase(fetchProducts.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.count = action.payload.count;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchHomeFloorPlans.fulfilled, (state, action) => {
        state.homeFloorPlans = action.payload.products;
      })
      .addCase(fetchHomeElevations.fulfilled, (state, action) => {
        state.homeElevations = action.payload.products;
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMyProducts.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.myProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.myProducts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        const myIndex = state.myProducts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (myIndex !== -1) {
          state.myProducts[myIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.myProducts = state.myProducts.filter(
          (p) => p._id !== action.payload
        );
        state.count = (state.count || 1) - 1;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })
      .addCase(createReview.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.actionStatus = "succeeded";
        state.error = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      })
      .addCase(removeCsvImage.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(removeCsvImage.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updatedProduct = action.payload;
        state.product = updatedProduct;
        state.products = state.products.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        state.myProducts = state.myProducts.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        state.error = null;
      })
      .addCase(removeCsvImage.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
