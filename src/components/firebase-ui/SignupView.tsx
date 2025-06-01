import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '../../redux/uiSlice';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-ui/firebase';

const SignupView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();

  const handleSignup = async () => {
    alert('Sign Up button clicked');
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setView('main'));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
      <p>
        Already have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => dispatch(setView('login'))}
        >
          Log In
        </span>
      </p>
    </div>
  );
};

export default SignupView;
