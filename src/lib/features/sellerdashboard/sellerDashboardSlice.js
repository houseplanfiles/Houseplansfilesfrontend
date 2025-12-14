import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  stats: null,
  recentInquiries: [],
  status: "idle",
  error: null,
};

const getToken = (getState) => {
  const { user } = getState();
  return user.userInfo?.token;
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/seller-dashboard`;

export const fetchSellerDashboardData = createAsyncThunk(
  "sellerDashboard/fetchData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(API_URL, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

const sellerDashboardSlice = createSlice({
  name: "sellerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSellerDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = {
          totalProducts: action.payload.totalProducts,
          totalInquiries: action.payload.totalInquiries,
          totalBuyers: action.payload.totalBuyers,
        };
        state.recentInquiries = action.payload.recentInquiries;
      })
      .addCase(fetchSellerDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default sellerDashboardSlice.reducer;
