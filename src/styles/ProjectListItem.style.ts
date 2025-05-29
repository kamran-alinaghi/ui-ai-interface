// styles/ProjectListItem.style.ts
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 0px 0px 10px;
  position: relative;
  margin-bottom: 8px;
`;

export const NameButton = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? '#2a93f5' : '#1e3a8a')};
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 6px 0 0 6px;
  cursor: pointer;
  height: 30px;

  &:hover {
    color: #14f53d;
  }
`;

export const MoreButton = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? '#2a93f5' : '#1e3a8a')};
  color: white;
  padding: 6px 8px;
  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  height: 30px;

  &:hover {
    color: #14f53d;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

export const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #e5e5e5;
  }
`;
