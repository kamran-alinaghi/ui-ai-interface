import { FieldValue, Timestamp } from "firebase/firestore";

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  archived?: boolean;
  createdAt: Date;   // mapped from Firestore Timestamp
  updatedAt: Date;   // mapped from Firestore Timestamp
};

export type ProjectDoc = {
  ownerId: string;
  name: string;
  description?: string;
  archived: boolean;
  createdAt: Timestamp | FieldValue; // serverTimestamp on create
  updatedAt: Timestamp | FieldValue; // serverTimestamp on create/update
};

export type CreateProjectInput = {
  name: string;
  description?: string;
};

export type UpdateProjectPatch = Partial<Pick<Project, 'name' | 'description' | 'archived'>>;

export type Unsubscribe = () => void;

export type ListOpts = { limit?: number; startAfterId?: string };