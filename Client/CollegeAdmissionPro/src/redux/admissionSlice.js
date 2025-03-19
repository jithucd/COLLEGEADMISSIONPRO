import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAdmissions = createAsyncThunk('admissions/fetchAdmissions', async (_, { getState, rejectWithValue }) => {
  try {
    // ✅ Get userId directly from Redux state
    const userId = getState().auth.userData?._id;

    if (!userId) {
      console.error("User ID is undefined");
      return rejectWithValue("User ID is undefined");
    }

    const response = await axios.get(`http://localhost:5000/api/admissions/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch admissions:', error);
    return rejectWithValue(error.response?.data?.error || "Failed to fetch admissions");
  }
});

const admissionSlice = createSlice({
  name: 'admissions',
  initialState: { admissions: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.admissions = action.payload;
      })
      .addCase(fetchAdmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default admissionSlice.reducer;
