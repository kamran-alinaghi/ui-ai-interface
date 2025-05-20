// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
