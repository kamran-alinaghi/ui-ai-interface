import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import chatReducer from './chatSlice';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    chat: chatReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
