import styled from 'styled-components';
export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

export const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Slider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked }) => (checked ? '#2196F3' : '#ccc')};
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: ${({ checked }) => (checked ? '30px' : '4px')};
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;


export const CheckedSlider = styled(Slider)`
  background-color: #2196F3;

  &:before {
    transform: translateX(26px);
  }
`;
