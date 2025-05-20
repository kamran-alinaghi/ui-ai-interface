// utils/generateUntitledName.ts

// This creates names like "Untitled1", "Untitled2", ...
export function generateUntitledName(counter: number): string {
  return `Untitled${counter}`;
}
