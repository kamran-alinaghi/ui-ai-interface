// redux/projectsThunks.ts
import { createAsyncThunk, type ThunkAction } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store';
import { setProjects, upsertProject, removeProject, bumpUntitled, selectProject } from './projectsSlice';
import type { Project as UIProject } from '../types/project';
import { addDoc, collection, serverTimestamp, type Firestore } from 'firebase/firestore';
import {
  subscribeProjects as repoSubscribe,
  listProjects as repoList,
  createProject as repoCreate,
  updateProject as repoUpdate,
  deleteProject as repoDelete,
} from '../data/projectsRepo';
import { type Project as RepoProject } from '../data/dataTypes';
import { auth, db } from '../components/firebase-ui/firebase';
import { initProject } from './chatSlice';

// Map repo.Project -> UI Project type (keeps your existing shape)
function toUI(p: RepoProject): UIProject {
  // If your UI Project has `summary`, map description to it.
  return {
    id: p.id,
    name: p.name,
    summary: (p.description ?? '') as any, // adjust if your type differs
    // If your UI type has more fields, extend here.
  };
}

// --- Subscribe (realtime) ---
// Returns an unsubscribe function to be called by the component.
export function subscribeUserProjects(db: Firestore, ownerId: string, includeArchived = false) {
  return (dispatch: AppDispatch) => {
    const unsub = repoSubscribe(db, ownerId, (list) => {
      dispatch(setProjects(list.map(toUI)));
    }, { includeArchived });
    return unsub; // caller holds and calls it in cleanup
  };
}

// --- One-shot list ---
export function fetchUserProjects(db: Firestore, ownerId: string): ThunkAction<Promise<void>, RootState, unknown, any> {
  return async (dispatch) => {
    const list = await repoList(db, ownerId, { limit: 100 });
    dispatch(setProjects(list.map(toUI)));
  };
}

// --- Create ---
export function createUserProject(db: Firestore, ownerId: string, name?: string, description?: string)
: ThunkAction<Promise<UIProject>, RootState, unknown, any> {
  return async (dispatch, getState) => {
    const state = getState();
    const nextName = name ?? `Untitled${state.projects.untitledCounter}`;
    const created = await repoCreate(db, ownerId, { name: nextName, description });
    const ui = toUI(created);
    dispatch(upsertProject(ui));
    dispatch(selectProject(ui.id));
    dispatch(bumpUntitled());
    return ui;
  };
}

// --- Rename ---
export function renameUserProject(db: Firestore, projectId: string, newName: string)
: ThunkAction<Promise<void>, RootState, unknown, any> {
  return async (dispatch) => {
    await repoUpdate(db, projectId, { name: newName });
    // Optimistic: update state (or you can rely on subscribe to reflect it)
    dispatch(upsertProject({ id: projectId, name: newName, summary: '' } as UIProject));
  };
}

// --- Delete ---
export function deleteUserProject(db: Firestore, projectId: string)
: ThunkAction<Promise<void>, RootState, unknown, any> {
  return async (dispatch) => {
    await repoDelete(db, projectId);
    dispatch(removeProject(projectId));
  };
}

export function createProjectWithChat(
  dbArg = db,
  ownerIdArg?: string,
  name?: string,
  description?: string
): ThunkAction<Promise<string>, RootState, unknown, any> {
  return async (dispatch, getState) => {
    const state = getState();
    const ownerId = ownerIdArg ?? auth.currentUser?.uid ?? 'anonymous';
    const nextName = name ?? `Untitled${state.projects.untitledCounter}`;

    // Create in repo
    const created = await repoCreate(dbArg, ownerId, { name: nextName, description });
    const ui: UIProject = {
      id: created.id,
      name: created.name,
      summary: (created.description ?? '') as any,
    };

    // Update UI store
    dispatch(upsertProject(ui));
    dispatch(selectProject(ui.id));
    dispatch(bumpUntitled());

    // Init chat state for this project so messages can be added immediately
    dispatch(initProject(ui.id));

    // Return new id to the caller
    return ui.id;
  };
}