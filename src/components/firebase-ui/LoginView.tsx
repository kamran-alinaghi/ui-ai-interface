import React, { useState } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAppDispatch } from '../../hooks';
import { setUser } from '../../redux/authSlice';
import { setView } from '../../redux/uiSlice';
import {
  LoginWrapper,
  LoginForm,
  LoginInput,
  LoginButton,
  ErrorText,
  LoginTitle,
  GoogleButton,
  Divider,
  SecondaryButton
} from '../../styles/LoginView.style';

export default function Login() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser(result.user));
      dispatch(setView('main'));
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(setUser(result.user));
      dispatch(setView('main'));
    } catch (err: any) {
      setError(err.message || 'Google Sign-in failed');
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      setError("Email and password are required to sign up.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setUser(result.user));
      dispatch(setView('main'));
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <LoginWrapper>
      <LoginForm onSubmit={handleLogin}>
        <LoginTitle>Welcome Back</LoginTitle>
        <LoginInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <LoginInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <LoginButton type="submit">Sign In</LoginButton>

        <Divider>or</Divider>

        <GoogleButton type="button" onClick={handleGoogleLogin}>
          Continue with Google
        </GoogleButton>

        <SecondaryButton type="button" onClick={handleSignup}>
          Sign Up
        </SecondaryButton>

        {error && <ErrorText>{error}</ErrorText>}
      </LoginForm>
    </LoginWrapper>
  );
}
