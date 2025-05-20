// redux/projectsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../types/project';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsState {
  list: Project[];
  activeProjectId: string | null;
  untitledCounter: number;
}

const initialState: ProjectsState = {
  list: [],
  activeProjectId: null,
  untitledCounter: 1,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject(state) {
      const id = uuidv4();
      const name = `Untitled${state.untitledCounter++}`;
      state.list.push({ id, name, summary: '' });
      state.activeProjectId = id;
    },
    selectProject(state, action: PayloadAction<string>) {
      state.activeProjectId = action.payload;
    },
    renameProject(state, action: PayloadAction<{ id: string; newName: string }>) {
      const proj = state.list.find(p => p.id === action.payload.id);
      if (proj) proj.name = action.payload.newName;
    },
    deleteProject(state, action: PayloadAction<string>) {
      state.list = state.list.filter(p => p.id !== action.payload);
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = state.list.length ? state.list[0].id : null;
      }
    },
  },
});

export const { createProject, selectProject, renameProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;
