import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { auth } from './firebase-ui/firebase';
import { setView } from '../redux/uiSlice';
import { setUser } from '../redux/authSlice';
import { Container, Dropdown, DropdownItem, ProfileImage, UserName } from '../styles/UserProfileMenu.style';

const DEFAULT_PROFILE_IMAGE = 'https://www.gravatar.com/avatar/?d=mp&s=80';

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
