import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../hooks';
import { FloatingToggle, SidebarContainer, Wrapper } from '../styles/Sidebar.style';
import { ResizeHandle } from '../styles/SidebarLeft.style';
import ProjectListItem from './ProjectListItem';
import UserProfileMenu from './UserProfileMenu';

export default function SidebarLeft() {
  const projects = useAppSelector((s) => s.projects.list);

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
      const newWidth = e.clientX;
      if (newWidth >= 180 && newWidth <= 500) {
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
      <SidebarContainer
        ref={sidebarRef}
        width={width}
        hidden={hidden}
        isToggling={isToggling}
        themeMode={theme}
      >
        {!hidden && <ResizeHandle className="resize-handle" />}
        <UserProfileMenu/>

        {projects.map((p) => (
          <ProjectListItem key={p.id} project={p} parentWidth={width}/>
        ))}
      </SidebarContainer>

      <FloatingToggle onClick={toggleSidebar} themeMode={theme} isRight={false}>
        {hidden ? '▶' : '◀'}
      </FloatingToggle>
    </Wrapper>
  );
}
