import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    userRole: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      login: (state, action) => {
        state.isLoggedIn = true;
        state.userRole = action.payload.userRole;
      },
      logout: (state) => {
        state.isLoggedIn = false;
        state.userRole = null;
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
      },
    },
  });

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
