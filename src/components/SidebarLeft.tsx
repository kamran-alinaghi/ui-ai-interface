import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { createProject} from '../redux/projectsSlice';
import { SidebarContainer, Wrapper } from '../styles/Sidebar.style';
import { FloatingToggle, ResizeHandle, TopBar, UserAccount } from '../styles/SidebarLeft.style';
import ProjectListItem from './ProjectListItem';
import { setView } from '../redux/uiSlice';
import { auth } from './firebase-ui/firebase';
import { setUser } from '../redux/authSlice';
import ThemeToggle from './ThemeToggle';
import UserProfileMenu from './UserProfileMenu';

export default function SidebarLeft() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((s) => s.projects.list);

  const [width, setWidth] = useState(250);
  const [hidden, setHidden] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);

  const toggleSidebar = () => {
    setIsToggling(true);
    setHidden((prev) => !prev);
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleLogout = () => {     
        dispatch(setView('login'));  
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
      >
        {!hidden && <ResizeHandle className="resize-handle" />}
        <UserProfileMenu/>
        <TopBar>
          <button onClick={() => dispatch(createProject())}>+ New</button>
        </TopBar>

        {projects.map((p) => (
          <ProjectListItem key={p.id} project={p} />
        ))}
      </SidebarContainer>

      <FloatingToggle onClick={toggleSidebar}>
        {hidden ? '▶' : '◀'}
      </FloatingToggle>
    </Wrapper>
  );
}
