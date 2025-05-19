import { configureStore } from '@reduxjs/toolkit';
import uiAISlice from './uiAISlice';

export const store = configureStore({
  reducer: {
    uiAI: uiAISlice,
  },
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
