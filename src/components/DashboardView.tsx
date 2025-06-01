import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setUser } from '../redux/authSlice';
import { setView } from '../redux/uiSlice';
import styled from 'styled-components';
import PopupView from './PopupView';
import ThemeToggle from './ThemeToggle';
import { auth } from './firebase-ui/firebase';

// Styled Components
const DashboardContainer = styled.div<{ themeMode: 'light' | 'dark' }>`
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : '#f9f9f9')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#000')};
  padding: 24px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
`;

const Button = styled.button<{ themeMode: 'light' | 'dark' }>`
  padding: 8px 16px;
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#444' : '#2196F3')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#666' : '#1976D2')};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const DashboardView: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const user = auth.currentUser;
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme.theme);
    const DEFAULT_PROFILE_IMAGE = 'https://www.gravatar.com/avatar/?d=mp&s=80';

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                dispatch(setUser(null));
                dispatch(setView('login'));
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    };

    const handleChangePassword = () => {
        if (user?.email) {
            sendPasswordResetEmail(auth, user.email)
                .then(() => {
                    setShowPopup(true);
                })
                .catch((error) => {
                    console.error('Error sending password reset email:', error);
                });
        } else {
            console.error('No email available for user.');
        }
    };

    const handleBack = () => {
        dispatch(setView('main'));
    };

    if (!user) {
        return <div>No user data available.</div>;
    }

    const hasPasswordProvider = user.providerData.some(
        (provider) => provider.providerId === 'password'
    );

    return (
        <DashboardContainer themeMode={theme}>
            <h2>Dashboard</h2>
            <ProfileImage src={user.photoURL || DEFAULT_PROFILE_IMAGE} alt="Profile" />
            <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
            <p><strong>Email:</strong> {user.email || 'Unknown'}</p>
            <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
            <div><strong>Dark Theme: </strong><ThemeToggle /></div>
            

            <div style={{ marginTop: '16px' }}>
                {hasPasswordProvider && (
                    <Button themeMode={theme} onClick={handleChangePassword}>Change Password</Button>
                )}
            </div>

            {showPopup && (
                <PopupView
                    mode="message"
                    message="Password reset email sent!"
                    onClose={() => setShowPopup(false)}
                />
            )}
            <ButtonRow>
                <Button themeMode={theme} onClick={handleBack}>Back</Button>
                <Button themeMode={theme} onClick={handleLogout}>Log Out</Button>
            </ButtonRow>
        </DashboardContainer>
    );
};

export default DashboardView;
