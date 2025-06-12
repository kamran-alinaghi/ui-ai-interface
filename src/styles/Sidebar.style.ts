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
  themeMode: 'light' | 'dark';
}>`
  width: ${({ hidden, width }) => (hidden ? '0px' : `${width}px`)};
  ${({ isToggling }) => isToggling && 'transition: width 300ms ease;'}
  overflow: hidden;
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? 'rgb(15,15,15)' : '#fafafa')};
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const FloatingToggle = styled.button<{ themeMode: 'light' | 'dark'; isRight:boolean; }>`
  position: absolute;
  top: 10px;
  ${({isRight})=>(isRight? 'left: -24px;':'right: -24px;')}
  width: 24px;
  height: 24px;
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#1b3070' : '#e0e0e0')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? 'white' : 'black')};
  border: 1px solid ${({ themeMode }) => (themeMode === 'dark' ? 'black' : 'white')};
  ${({isRight})=>(isRight? 'border-radius: 4px 0px 0px 4px;':'border-radius: 0px 4px 4px 0px;')}
  cursor: pointer;
  z-index: 1;

  &:hover {
    color: #14f53d;
  }
`;