import React, { useState } from 'react';
import { useAppSelector } from '../hooks';
import { Button, ButtonRow, Overlay, PopupContainer, TextBox } from '../styles/PopupView.style';

type PopupMode = 'message' | 'confirm' | 'prompt';

interface PopupProps {
  mode: PopupMode;
  message: string;
  onClose: (result?: string | boolean) => void;
  defaultValue?: string;
}



const PopupView: React.FC<PopupProps> = ({ mode, message, onClose, defaultValue }) => {
  const [inputValue, setInputValue] = useState(defaultValue ??'');
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
    <Overlay themeMode={theme}>
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
