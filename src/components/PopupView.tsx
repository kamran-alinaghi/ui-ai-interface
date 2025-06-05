import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';

type PopupMode = 'message' | 'confirm' | 'prompt';

interface PopupProps {
  mode: PopupMode;
  message: string;
  onClose: (result?: string | boolean) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContainer = styled.div<{ themeMode: 'light' | 'dark' }>`
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : '#f9f9f9')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#000')};
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

const Button = styled.button`
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

const TextBox = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PopupView: React.FC<PopupProps> = ({ mode, message, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const theme = useAppSelector((state) => state.theme.theme);

  const handleConfirm = () => {
    if (mode === 'prompt') {
      onClose(inputValue);
    } else if (mode === 'confirm') {
      onClose(true);
    }
  };

  const handleDiscard = () => {
    if (mode === 'confirm') {
      onClose(false);
    } else if (mode === 'prompt') {
      onClose('');
    }
  };

  return (
    <Overlay>
      <PopupContainer themeMode={theme}>
        <p>{message}</p>
        {mode === 'prompt' && (
          <TextBox
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        <ButtonRow>
          {mode === 'message' && (
            <Button onClick={() => onClose()}>OK</Button>
          )}
          {(mode === 'confirm' || mode === 'prompt') && (
            <>
              <Button onClick={handleConfirm}>Confirm</Button>
              <Button onClick={handleDiscard}>Discard</Button>
            </>
          )}
        </ButtonRow>
      </PopupContainer>
    </Overlay>
  );
};

export default PopupView;
