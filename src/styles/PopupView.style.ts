import { styled } from "styled-components";

export const Overlay = styled.div<{ themeMode: 'light' | 'dark'}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)')};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const PopupContainer = styled.div<{ themeMode: 'light' | 'dark' }>`
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : '#f9f9f9')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#000')};
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #2196F3;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1976D2;
  }
`;

export const TextBox = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;