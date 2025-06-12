import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { auth } from './firebase-ui/firebase';
import { setView } from '../redux/uiSlice';
import { setUser } from '../redux/authSlice';

const DEFAULT_PROFILE_IMAGE = 'https://www.gravatar.com/avatar/?d=mp&s=80';

// Styled Components
const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  &:hover {
    border-color: #2196F3;
  }
`;

const Dropdown = styled.div<{ themeMode: 'light' | 'dark' }>`
  position: absolute;
  left: 50px;
  top: 40px;
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#333' : '#fff')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#000')};
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border-radius: 4px;
  min-width: 200px;
  z-index: 20;
`;

const DropdownItem = styled.div<{ themeMode: 'light' | 'dark' }>`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${({ themeMode }) => (themeMode === 'dark' ? '#444' : '#eee')};

  &:hover {
    background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#555' : '#f5f5f5')};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const UserName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const UserProfileMenu: React.FC = () => {
  const user = auth.currentUser;
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const handleDashboard = () => {
    dispatch(setView('dashboard'));
    setMenuOpen(false);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  if (!user) return null;

  return (
    <Container ref={ref}>
      <ProfileImage
        src={user.photoURL || DEFAULT_PROFILE_IMAGE}
        alt="Profile"
        onClick={() => setMenuOpen((open) => !open)}
      />
      {menuOpen && (
        <Dropdown themeMode={theme}>
          <DropdownItem themeMode={theme}>
            <UserName>{user.displayName || user.email}</UserName>
          </DropdownItem>
          <DropdownItem themeMode={theme} onClick={handleDashboard}>
            Dashboard
          </DropdownItem>
          <DropdownItem themeMode={theme} onClick={handleLogout}>
            Log Out
          </DropdownItem>
        </Dropdown>
      )}
    </Container>
  );
};

export default UserProfileMenu;
