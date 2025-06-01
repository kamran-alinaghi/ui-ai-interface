import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type View = 'login' | 'signup' | 'main' | 'dashboard';

interface UIState {
  currentView: View;
}

const initialState: UIState = {
  currentView: 'login',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<View>) => {
      state.currentView = action.payload;
    },
  },
});

export const { setView } = uiSlice.actions;
export default uiSlice.reducer;
