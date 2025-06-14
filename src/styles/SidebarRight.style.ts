import { styled } from "styled-components";

export const ResizeHandle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
  background-color: transparent;
  z-index: 100;

  &:hover {
    background-color: rgb(125, 125, 125);
  }
`;