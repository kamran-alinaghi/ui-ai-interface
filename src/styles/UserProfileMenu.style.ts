import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 10px;
`;

export const ProfileImage = styled.img`
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

export const AddButton = styled.button<{ themeMode: 'light' | 'dark' }>`
  background: ${({ themeMode }) => (themeMode === 'dark' ? '#444' : '#e0e0e0')};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#000')};
  transition: background 0.3s;

  &:hover {
    background: ${({ themeMode }) => (themeMode === 'dark' ? '#666' : '#ccc')};
  }
`;

export const Dropdown = styled.div<{ themeMode: 'light' | 'dark' }>`
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

export const DropdownItem = styled.div<{ themeMode: 'light' | 'dark' }>`
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

export const UserName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;