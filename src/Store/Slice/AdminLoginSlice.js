import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_API + "/adminauth";

export const SchoolAdminCreate = createAsyncThunk(
  "auth/SchoolAdminCreate",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/register`, credentials);
      if (response.status === 404) {
        return rejectWithValue(response.data);
      }
      if (response.status === 200) {
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("Admintoken", response.data.adminToken);
        localStorage.setItem("schoolid", response.data.schoolid);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const SchoolAdminUpdate = createAsyncThunk(
  "auth/SchoolAdminUpdate",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/forget`, credentials);
      if (response.status === 404) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const SchoolAdminFind = createAsyncThunk(
  "auth/SchoolAdminFind",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/find/${data}`, data);
      if (response.status === 404) {
        return rejectWithValue(response.data);
      }
      if (response.status === 200) {
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("Admintoken", response.data.adminToken);
        localStorage.setItem("schoolid", response.data.schoolid);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const loginSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SchoolAdminCreate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SchoolAdminCreate.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(SchoolAdminCreate.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload.response?.data?.error;
      });
  },
});

export default loginSlice.reducer;
