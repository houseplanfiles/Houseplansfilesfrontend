import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

const getToken = (state: RootState) => state.user.userInfo?.token;

const userInfoFromStorage = (() => {
  const stored = localStorage.getItem("userInfo");
  if (!stored) return null;
  try {
    const user = JSON.parse(stored);
    if (user && user.role) {
      user.role = user.role.toLowerCase();
    }
    return user;
  } catch (e) {
    return null;
  }
})();

interface UserInfo {
  _id: string;
  name?: string;
  email: string;
  token?: string;
  photoUrl?: string;
  role?: string;
  businessName?: string;
  shopImageUrl?: string;
  companyName?: string;
  materialType?: string;
  city?: string;
  address?: string;
  experience?: string;
  isApproved?: boolean;
  status?: string;
  contractorType?: "Normal" | "Verified" | "Premium";
  [key: string]: any;
}

interface UserState {
  userInfo: UserInfo | null;
  users: UserInfo[];
  sellers: UserInfo[];
  contractors: UserInfo[];
  pagination: any;
  sellerPagination: any;
  contractorPagination: any;
  stats: any;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  sellerListStatus: "idle" | "loading" | "succeeded" | "failed";
  contractorListStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: any;
}

const initialState: UserState = {
  userInfo: userInfoFromStorage,
  users: [],
  sellers: [],
  contractors: [],
  pagination: null,
  sellerPagination: null,
  contractorPagination: null,
  stats: null,
  listStatus: "idle",
  sellerListStatus: "idle",
  contractorListStatus: "idle",
  actionStatus: "idle",
  error: null,
};

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

export const fetchSellers = createAsyncThunk(
  "user/fetchSellers",
  async (params: { page?: number; limit?: number } = { page: 1, limit: 12 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}?role=seller`, { params });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sellers"
      );
    }
  }
);

export const fetchContractors = createAsyncThunk(
  "user/fetchContractors",
  async (params: { page?: number; limit?: number } = { page: 1, limit: 12 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}?role=Contractor`, { params });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contractors"
      );
    }
  }
);

export const registerUser = createAsyncThunk<UserInfo, FormData>(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(
        `${API_URL}/register`,
        userData,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<UserInfo, void, { state: RootState }>(
  "user/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.user.userInfo?._id;
      const token = getToken(state);
      if (!userId || !token) throw new Error("Missing auth info");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/${userId}`, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const loginUser = createAsyncThunk<
  UserInfo,
  { email: string; password: string }
>("user/login", async (userData, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(`${API_URL}/login`, userData, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const updateProfile = createAsyncThunk<
  UserInfo,
  FormData,
  { state: RootState }
>("user/updateProfile", async (formData, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    if (!state.user.userInfo) {
      throw new Error("User not logged in");
    }
    const userId = state.user.userInfo._id;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(`${API_URL}/${userId}`, formData, config);
    const updatedUserInfo = { ...state.user.userInfo, ...data };
    return updatedUserInfo;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update profile"
    );
  }
});

export const fetchUsers = createAsyncThunk<
  { users: UserInfo[]; pagination: any },
  Record<string, any>,
  { state: RootState }
>("user/fetchAll", async (params = {}, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` }, params };
    const { data } = await axios.get(API_URL, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

export const updateUserByAdmin = createAsyncThunk<
  UserInfo,
  { userId: string; userData: any },
  { state: RootState }
>("user/updateByAdmin", async (args, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(
      `${API_URL}/${args.userId}`,
      args.userData,
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update user"
    );
  }
});

export const createUserByAdmin = createAsyncThunk<
  UserInfo,
  any,
  { state: RootState }
>("user/createByAdmin", async (userData, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${API_URL}/admin/create`,
      userData,
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create user"
    );
  }
});

export const deleteUserByAdmin = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("user/deleteByAdmin", async (userId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = getToken(state);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/${userId}`, config);
    return userId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete user"
    );
  }
});

export const getUserStats = createAsyncThunk<any, void, { state: RootState }>(
  "user/getStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = getToken(state);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/stats`, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk<
  { message: string },
  { email: string }
>("user/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      `${API_URL}/forgot-password`,
      { email },
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send reset link"
    );
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { token: string; password: string }
>("user/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.put(
      `${API_URL}/reset-password/${token}`,
      { password },
      config
    );
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to reset password"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userInfo");
      state.userInfo = null;
      state.users = [];
      state.sellers = [];
      state.contractors = [];
      state.listStatus = "idle";
      state.sellerListStatus = "idle";
      state.contractorListStatus = "idle";
      state.actionStatus = "idle";
      state.error = null;
    },
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const actionPending = (state: UserState) => {
      state.actionStatus = "loading";
      state.error = null;
    };
    const actionRejected = (state: UserState, action: AnyAction) => {
      state.actionStatus = "failed";
      state.error = action.payload;
    };

    builder
      .addCase(registerUser.pending, actionPending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const user = { ...action.payload };
        if (user.role) user.role = user.role.toLowerCase();
        state.userInfo = user;
        localStorage.setItem("userInfo", JSON.stringify(user));
      })
      .addCase(registerUser.rejected, actionRejected)
      .addCase(loginUser.pending, actionPending)
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.actionStatus = "succeeded";
          const user = { ...action.payload };
          if (user.role) user.role = user.role.toLowerCase();
          state.userInfo = user;
          localStorage.setItem("userInfo", JSON.stringify(user));
        }
      )
      .addCase(loginUser.rejected, actionRejected)
      .addCase(updateProfile.pending, actionPending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const user = { ...action.payload };
        if (user.role) user.role = user.role.toLowerCase();
        state.userInfo = user;
        localStorage.setItem("userInfo", JSON.stringify(user));
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const user = { ...action.payload };
        if (user.role) user.role = user.role.toLowerCase();
        state.userInfo = user;
        localStorage.setItem("userInfo", JSON.stringify(user));
      })
      .addCase(updateProfile.rejected, actionRejected)
      .addCase(forgotPassword.pending, actionPending)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(forgotPassword.rejected, actionRejected)
      .addCase(resetPassword.pending, actionPending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.actionStatus = "succeeded";
      })
      .addCase(resetPassword.rejected, actionRejected);

    builder
      .addCase(fetchUsers.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(createUserByAdmin.pending, actionPending)
      .addCase(createUserByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.users.unshift(action.payload);
      })
      .addCase(createUserByAdmin.rejected, actionRejected)
      .addCase(updateUserByAdmin.pending, actionPending)
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUserByAdmin.rejected, actionRejected)
      .addCase(deleteUserByAdmin.pending, actionPending)
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUserByAdmin.rejected, actionRejected)
      .addCase(getUserStats.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(fetchSellers.pending, (state) => {
        state.sellerListStatus = "loading";
      })
      .addCase(
        fetchSellers.fulfilled,
        (state, action: PayloadAction<{ users: UserInfo[]; pagination: any }>) => {
          state.sellerListStatus = "succeeded";
          state.sellers = action.payload.users;
          state.sellerPagination = action.payload.pagination;
        }
      )
      .addCase(fetchSellers.rejected, (state, action: AnyAction) => {
        state.sellerListStatus = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(fetchContractors.pending, (state) => {
        state.contractorListStatus = "loading";
      })
      .addCase(
        fetchContractors.fulfilled,
        (state, action: PayloadAction<{ users: UserInfo[]; pagination: any }>) => {
          state.contractorListStatus = "succeeded";
          state.contractors = action.payload.users;
          state.contractorPagination = action.payload.pagination;
        }
      )
      .addCase(fetchContractors.rejected, (state, action: AnyAction) => {
        state.contractorListStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, resetActionStatus } = userSlice.actions;
export default userSlice.reducer;
