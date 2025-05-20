import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
`;

export const NameButton = styled.div<{ active: boolean }>`
  padding: 6px 8px;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#ddeeff' : 'transparent')};
  cursor: pointer;

  &:hover {
    background-color: #e6f0ff;
  }
`;