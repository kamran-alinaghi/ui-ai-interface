import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from './shared/interfaces';

interface UIAIState {
  activeProjectId: string | null;
  sidebarLeftVisible: boolean;
  sidebarRightVisible: boolean;
  projects: Project[];
}

const initialState: UIAIState = {
  activeProjectId: null,
  sidebarLeftVisible: true,
  sidebarRightVisible: true,
  projects: [],
};

const uiAISlice = createSlice({
  name: 'uiAI',
  initialState,
  reducers: {
    setActiveProjectId(state, action: PayloadAction<string | null>) {
      state.activeProjectId = action.payload;
    },
    toggleLeftSidebar(state) {
      state.sidebarLeftVisible = !state.sidebarLeftVisible;
    },
    toggleRightSidebar(state) {
      state.sidebarRightVisible = !state.sidebarRightVisible;
    },
    setProjects(state, action: PayloadAction<Project[]>){
        state.projects = action.payload;
    }
  },
});

export const {
  setActiveProjectId,
  toggleLeftSidebar,
  toggleRightSidebar,
  setProjects,
} = uiAISlice.actions;

export default uiAISlice.reducer;
