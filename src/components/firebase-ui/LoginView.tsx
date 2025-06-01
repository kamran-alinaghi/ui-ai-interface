import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '../../redux/uiSlice';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '../firebase-ui/firebase';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Create an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => dispatch(setView('signup'))}
        >
          Sign Up
        </span>
      </p>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginView;
