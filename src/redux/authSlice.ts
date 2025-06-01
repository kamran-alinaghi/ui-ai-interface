// redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface AuthState {
  currentUser: User | null;
  authChecked: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.authChecked = action.payload;
    },
  },
});

export const { setUser, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
