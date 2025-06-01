import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Writes a single field to the user's Firestore document.
 *
 * @param uid The user's UID.
 * @param dataName The name of the field to write.
 * @param dataToWrite The value to write to that field.
 */
export async function writeData(
  uid: string,
  dataName: string,
  dataToWrite: any
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { [dataName]: dataToWrite }, { merge: true });
    console.log(`Wrote field "${dataName}" for user "${uid}".`);
  } catch (error) {
    console.error(`Error writing data for user "${uid}":`, error);
    throw error;
  }
}

/**
 * Reads a single field from the user's Firestore document.
 *
 * @param uid The user's UID.
 * @param dataName The name of the field to read.
 * @returns The value of the field, or null if not found.
 */
export async function readData(
  uid: string,
  dataName: string
): Promise<any | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      if (data && dataName in data) {
        console.log(`Read field "${dataName}" for user "${uid}":`, data[dataName]);
        return data[dataName];
      } else {
        console.log(`Field "${dataName}" not found for user "${uid}".`);
        return null;
      }
    } else {
      console.log(`User document "${uid}" does not exist.`);
      return null;
    }
  } catch (error) {
    console.error(`Error reading data for user "${uid}":`, error);
    throw error;
  }
}
