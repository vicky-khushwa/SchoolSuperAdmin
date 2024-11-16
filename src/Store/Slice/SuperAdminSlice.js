import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../Config/Http";

// eslint-disable-next-line no-undef
const url = process.env.REACT_APP_API + "/superauth";

// Teacher and teacher
export const getAllTeacherBySchool = createAsyncThunk(
  "Teacher/BySchoolall",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/byschool/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// teacher portal
export const getByIdTeacher = createAsyncThunk(
  "Teacher/BySchoolall",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${id}`);
      localStorage.setItem("schoolid", res.data.school);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// admin / teacher / Teacher
export const createTeacher = createAsyncThunk(
  "Teacher/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(url, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// admin / teacher / Teacher
export const updateTeacher = createAsyncThunk(
  "Teacher/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${url}/${data._id}/${data.school}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const Superadmin = createSlice({
  name: "Teacher",
  initialState: {
    Teacher: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTeacherBySchool.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTeacherBySchool.fulfilled, (state, action) => {
        state.Teacher = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getAllTeacherBySchool.rejected, (state, action) => {
        state.loading = false;
        state.Teacher = [];
        state.error = action.payload;
      })
      .addCase(createTeacher.pending, (state) => {
        state.loading = false;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.error = null;
        state.Teacher.push(action.payload?.data);
        state.loading = false;
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTeacher.pending, (state) => {
        state.loading = false;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.Teacher.findIndex(
          (Teacher) => Teacher._id === action.payload.data._id
        );
        if (index !== -1) {
          state.Teacher[index] = action.payload.data;
        }
        state.error = null;
        state.loading = false;
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default Superadmin.reducer;
