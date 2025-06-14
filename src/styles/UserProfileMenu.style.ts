import { styled } from "styled-components";

export const Container = styled.div`
  position: relative;
  display: inline-block;
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