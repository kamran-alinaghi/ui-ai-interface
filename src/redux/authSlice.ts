// redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface AuthState {
  currentUser: User | null;
  authChecked: boolean;
  /** Short‑lived Firebase ID token kept only in memory (for HTTP/WS auth) */
  idToken: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  authChecked: false,
  idToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ✅ existing actions (unchanged)
    setUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
      // Optional convenience: clear token if user logs out
      if (!action.payload) state.idToken = null;
    },
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.authChecked = action.payload;
    },

    // ✅ new actions (non‑breaking additions)
    /** Set or refresh the short‑lived Firebase ID token */
    updateToken(state, action: PayloadAction<string | null>) {
      state.idToken = action.payload;
    },
    /** Explicitly clear the token (e.g., manual logout) */
    clearToken(state) {
      state.idToken = null;
    },
  },
});

export const { setUser, setAuthChecked, updateToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
