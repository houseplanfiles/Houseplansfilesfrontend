import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/notifications`;

interface NotificationType {
  _id: string;
  message: string;
  link: string;
  createdAt: string;
}

interface NotificationCounts {
  newUsers: number;
  orders: number;
  sellerEnquiries: number;
  requests: { customization: number; premium: number; total: number };
  inquiries: { corporate: number; sellerContractor: number; total: number };
}

interface NotificationState {
  counts: NotificationCounts;
  notifications: NotificationType[];
  totalUnreadCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotificationState = {
  counts: {
    newUsers: 0,
    orders: 0,
    sellerEnquiries: 0,
    requests: { customization: 0, premium: 0, total: 0 },
    inquiries: { corporate: 0, sellerContractor: 0, total: 0 },
  },
  notifications: [],
  totalUnreadCount: 0,
  status: "idle",
  error: null,
};

type ThunkApiConfig = {
  rejectValue: string;
  state: { user: { userInfo: { token: string } | null } };
};

export const fetchUnreadCounts = createAsyncThunk<
  NotificationCounts,
  void,
  ThunkApiConfig
>(
  "notifications/fetchUnreadCounts",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().user.userInfo?.token;
    if (!token) return rejectWithValue("Not authorized");
    try {
      const { data } = await axios.get<NotificationCounts>(
        `${API_URL}/counts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Could not fetch counts"
      );
    }
  }
);

export const fetchNotifications = createAsyncThunk<
  NotificationType[],
  void,
  ThunkApiConfig
>(
  "notifications/fetchNotifications",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().user.userInfo?.token;
    if (!token) return rejectWithValue("Not authorized");
    try {
      const { data } = await axios.get<NotificationType[]>(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Could not fetch notifications"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk<
  string,
  string,
  ThunkApiConfig
>(
  "notifications/markAsRead",
  async (notificationId, { getState, rejectWithValue }) => {
    const token = getState().user.userInfo?.token;
    if (!token) return rejectWithValue("Not authorized");
    try {
      await axios.put(
        `${API_URL}/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return notificationId;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Could not mark as read"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.notifications = [];
      state.totalUnreadCount = 0;
      state.counts = initialState.counts;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUnreadCounts.fulfilled,
        (state, action: PayloadAction<NotificationCounts>) => {
          state.status = "succeeded";
          state.counts = action.payload;

          const newUsersCount = action.payload?.newUsers || 0;
          const ordersCount = action.payload?.orders || 0;
          const sellerEnquiriesCount = action.payload?.sellerEnquiries || 0;
          const requestsTotal = action.payload?.requests?.total || 0;
          const inquiriesTotal = action.payload?.inquiries?.total || 0;

          const calculatedTotal =
            newUsersCount +
            ordersCount +
            sellerEnquiriesCount +
            requestsTotal +
            inquiriesTotal;

          state.totalUnreadCount = calculatedTotal;
        }
      )
      .addCase(fetchUnreadCounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "An unknown error occurred";
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<NotificationType[]>) => {
          state.notifications = action.payload;
        }
      )
      .addCase(
        markNotificationAsRead.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.notifications = state.notifications.filter(
            (n) => n._id !== action.payload
          );
          if (state.totalUnreadCount > 0) {
            state.totalUnreadCount -= 1;
          }
        }
      );
  },
});

export const { resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
