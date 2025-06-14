import styled from 'styled-components';

export const ProjectItem = styled.div<{ active: boolean }>`
  padding: 6px 8px;
  margin-bottom: 4px;
  background-color: ${({ active }) => (active ? '#ddeeff' : 'transparent')};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e6f0ff;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 4px;
`;

export const UserAccount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 4px;
  background-color: rgb(250, 250, 100);
`;

export const ResizeHandle = styled.div`
  position: absolute;
  right: 0;
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