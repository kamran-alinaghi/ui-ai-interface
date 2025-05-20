import styled from 'styled-components';
export interface FloatingToggleProps {
  position: 'left' | 'right';
}
export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
`;

export const SidebarContainer = styled.div<{
  width: number;
  hidden: boolean;
  isToggling: boolean;
}>`
  width: ${({ hidden, width }) => (hidden ? '0px' : `${width}px`)};
  ${({ isToggling }) => isToggling && 'transition: width 300ms ease;'}
  overflow: hidden;
  background-color: #fafafa;
  position: relative;
  display: flex;
  flex-direction: column;
`;