// redux/projectsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// If your existing Project type is { id; name; summary? }, keep it.
// We'll treat "summary" as optional and map description->summary in thunks.
import { Project } from '../types/project';

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
    // === legacy/local actions (keep to avoid breaking imports) ===
    createProject(state) {
      // Kept for backward compat, but not used in server-backed flow.
      const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
      const name = `Untitled${state.untitledCounter++}`;
      state.list.push({ id, name, summary: '' } as Project);
      state.activeProjectId = id;
    },
    selectProject(state, action: PayloadAction<string>) {
      state.activeProjectId = action.payload;
    },
    renameProject(state, action: PayloadAction<{ id: string; newName: string }>) {
      const proj = state.list.find(p => p.id === action.payload.id);
      if (proj) (proj as any).name = action.payload.newName;
    },
    deleteProject(state, action: PayloadAction<string>) {
      state.list = state.list.filter(p => p.id !== action.payload);
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = state.list.length ? state.list[0].id : null;
      }
    },

    // === new reducers for server-backed flow ===
    setProjects(state, action: PayloadAction<Project[]>) {
      state.list = action.payload;
      // keep activeProjectId if it still exists, else pick first
      if (state.activeProjectId && !state.list.some(p => p.id === state.activeProjectId)) {
        state.activeProjectId = state.list.length ? state.list[0].id : null;
      }
    },
    upsertProject(state, action: PayloadAction<Project>) {
      const idx = state.list.findIndex(p => p.id === action.payload.id);
      if (idx >= 0) state.list[idx] = action.payload;
      else state.list.unshift(action.payload);
    },
    removeProject(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.list = state.list.filter(p => p.id !== id);
      if (state.activeProjectId === id) {
        state.activeProjectId = state.list.length ? state.list[0].id : null;
      }
    },
    bumpUntitled(state) {
      state.untitledCounter += 1;
    },
    setUntitledCounter(state, action: PayloadAction<number>) {
      state.untitledCounter = action.payload;
    },
  },
});

export const {
  createProject, selectProject, renameProject, deleteProject, // legacy
  setProjects, upsertProject, removeProject, bumpUntitled, setUntitledCounter,
} = projectsSlice.actions;

export default projectsSlice.reducer;
