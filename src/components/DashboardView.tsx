import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setUser } from '../redux/authSlice';
import { setView } from '../redux/uiSlice';
import PopupView from './PopupView';
import ThemeToggle from './ThemeToggle';
import { auth } from './firebase-ui/firebase';
import { Backgruond, Button, ButtonRow, DashboardContainer, ProfileImage } from '../styles/DashboardView.style';



const DashboardView: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [logOutPopup, setLogOutPopup] = useState(false);
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
        <Backgruond themeMode={theme}>
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
            {logOutPopup && (
                <PopupView
                    mode='confirm'
                    message='Are you sure you want to log out?'
                    onClose={(result) => {
                        if (result === true) { handleLogout(); }
                        setLogOutPopup(false);
                    }}
                />)}
            <ButtonRow>
                <Button themeMode={theme} onClick={handleBack}>Back</Button>
                <Button themeMode={theme} onClick={()=>setLogOutPopup(true)}>Log Out</Button>
            </ButtonRow>
        </DashboardContainer>
        </Backgruond>
    );
};

export default DashboardView;
