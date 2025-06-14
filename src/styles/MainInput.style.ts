import styled from 'styled-components';

export const Container = styled.div<{ themeMode: 'light' | 'dark' }>`
  padding: 10px;
  border-top: 1px solid ${({ themeMode }) => (themeMode === 'dark' ? '#444' : '#ccc')};
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : '#fff')};
`;

export const Input = styled.input`
  width: 80%;
  padding: 6px;
  border: 1px solid #aaa;
  border-radius: 4px;
`;

export const Button = styled.button`
  padding: 10px 16px;
  font-size: 16px;
  background-color: #2196F3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 80px;
  height: 100%;

  &:hover {
    background-color: #1976D2;
  }
`;
export const TextArea = styled.textarea<{ themeMode: 'light' | 'dark' }>`
  flex-grow: 1;
  resize: none;
  overflow: hidden;
  padding: 8px;
  font-size: 16px;
  line-height: 1.4;
  border: 1px solid ${({ themeMode }) => (themeMode === 'dark' ? '#555' : '#ccc')};
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#333' : '#fff')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#000')};
  border-radius: 4px;
  margin-right: 10px;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 160px; /* ~8 lines */
  width: calc(100% - 90px);
  min-width: 200px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(100, 100, 100, 0.4);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(100, 100, 100, 0.6);
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
`;