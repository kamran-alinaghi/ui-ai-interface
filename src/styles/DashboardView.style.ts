import { styled } from "styled-components";

export const DashboardContainer = styled.div<{ themeMode: 'light' | 'dark' }>`
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : '#f9f9f9')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#000')};
  padding: 24px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
`;

export const Backgruond = styled.div<{ themeMode: 'light' | 'dark' }>`
    background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : '#f9f9f9')};
    color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#000')};
    width: 100%;
    height: 100%;
    padding: 100px 0px;
`;

export const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
`;

export const Button = styled.button<{ themeMode: 'light' | 'dark' }>`
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

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;