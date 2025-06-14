import { useState, useRef, useEffect, JSX } from 'react';
import { FloatingToggle, SidebarContainer, Wrapper } from '../styles/Sidebar.style';
import { ResizeHandle } from '../styles/SidebarRight.style';
import FlowChart from './ReactFlow';
import { useAppSelector } from '../hooks';



export default function SidebarRight({ content }: { content: JSX.Element }) {
  const [width, setWidth] = useState(250);
  const [hidden, setHidden] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const theme = useAppSelector((state) => state.theme.theme);

  const toggleSidebar = () => {
    setIsToggling(true);
    setHidden((prev) => !prev);
    setTimeout(() => setIsToggling(false), 300);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const windowWidth = window.innerWidth;
      const newWidth = windowWidth - e.clientX;

      if (newWidth >= 250) {
        setWidth(newWidth);
      }
    };

    const stopResize = () => {
      resizingRef.current = false;
      document.body.style.userSelect = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResize);
    };

    const startResize = () => {
      resizingRef.current = true;
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResize);
    };

    const resizer = sidebarRef.current?.querySelector('.resize-handle');
    if (!hidden && resizer) {
      resizer.addEventListener('mousedown', startResize);
    }

    return () => {
      resizer?.removeEventListener('mousedown', startResize);
    };
  }, [hidden]);

  return (
    <Wrapper>
      <FloatingToggle onClick={toggleSidebar} themeMode={theme} isRight={true}>
        {hidden ? '◀' : '▶'}
      </FloatingToggle>

      <SidebarContainer
        ref={sidebarRef}
        width={width}
        hidden={hidden}
        isToggling={isToggling}
        themeMode={theme}
      >
        {!hidden && <ResizeHandle className="resize-handle"/>}
        {content}
        <FlowChart/>
      </SidebarContainer>
    </Wrapper>
  );
}
