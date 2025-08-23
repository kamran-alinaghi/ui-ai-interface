// utils/authHandlers.ts
import type { User } from 'firebase/auth';
import type { AppDispatch } from '../redux/store';
import { setUser, setAuthChecked, updateToken, clearToken } from '../redux/authSlice';
import { setView } from '../redux/uiSlice';
import { setTheme } from '../redux/themeSlice';
import { readData } from '../components/firebase-ui/firebaseUtils';

/** Handles onAuthStateChanged */
export async function handleAuthState(dispatch: AppDispatch, user: User | null) {
  if (user) {
    // fresh ID token on login
    const idToken = await user.getIdToken(true);
    dispatch(setUser(user));
    dispatch(updateToken(idToken));
    dispatch(setAuthChecked(true));
    dispatch(setView('main'));

    // optional: load theme
    try {
      const themeValue = await readData(user.uid, 'theme');
      if (themeValue) dispatch(setTheme(themeValue));
    } catch (e) {
      console.error('Error fetching theme:', e);
    }
  } else {
    // logged out
    dispatch(setUser(null));
    dispatch(updateToken(null)); // or dispatch(clearToken())
    dispatch(setAuthChecked(true));
    dispatch(setView('login'));
  }
}

/** Handles onIdTokenChanged */
export async function handleTokenRefresh(dispatch: AppDispatch, user: User | null) {
  if (user) {
    const idToken = await user.getIdToken(false);
    dispatch(updateToken(idToken ?? null));
  } else {
    dispatch(clearToken());
  }
}
