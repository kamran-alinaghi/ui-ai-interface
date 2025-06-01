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
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const FloatingToggle = styled.button`
  position: absolute;
  top: 10px;
  right: -24px;
  width: 24px;
  height: 24px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 0px 4px 4px 0px;
  cursor: pointer;
  z-index: 1;

  &:hover {
    background-color: #d0d0d0;
  }
`;