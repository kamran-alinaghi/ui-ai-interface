import { styled } from "styled-components";

export const ResizeHandle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
  background-color: transparent;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const FloatingToggle = styled.button`
  position: absolute;
  top: 10px;
  left: -24px;
  width: 24px;
  height: 24px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 4px 0px 0px 4px;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: #d0d0d0;
  }
`;