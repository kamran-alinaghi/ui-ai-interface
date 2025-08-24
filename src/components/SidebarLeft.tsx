import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { FloatingToggle, SidebarContainer, Wrapper } from '../styles/Sidebar.style';
import { ResizeHandle } from '../styles/SidebarLeft.style';
import ProjectListItem from './ProjectListItem';
import UserProfileMenu from './UserProfileMenu';

// 🔌 Firestore instance + thunk to subscribe projects
import { db } from './firebase-ui/firebase'; // adjust path if your db is exported elsewhere
import { subscribeUserProjects } from '../redux/projectsThunks';

export default function SidebarLeft() {
  const dispatch = useAppDispatch();

  // Auth + theme + projects from Redux
  const uid = useAppSelector((s) => s.auth.currentUser?.uid);
  const authChecked = useAppSelector((s) => s.auth.authChecked);
  const projects = useAppSelector((s) => s.projects.list);
  const theme = useAppSelector((s) => s.theme.theme);

  // Local UI state
  const [width, setWidth] = useState(250);
  const [hidden, setHidden] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);

  // 🧩 Subscribe to the user's projects in real time after auth is ready
  useEffect(() => {
    if (!authChecked) return;                 // wait until auth is known
    if (!uid) return; 
    // dispatch returns the unsubscribe function from the thunk
    const unsubscribe = dispatch(subscribeUserProjects(db, uid));
    return () => {
      // unsubscribe is a function
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [dispatch, uid, authChecked]);

  const toggleSidebar = () => {
    setIsToggling(true);
    setHidden((prev) => !prev);
    setTimeout(() => setIsToggling(false), 300);
  };

  // 🖱️ Resize logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const newWidth = e.clientX;
      if (newWidth >= 180 && newWidth <= 500) setWidth(newWidth);
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
    if (!hidden && resizer) resizer.addEventListener('mousedown', startResize);
    return () => resizer?.removeEventListener('mousedown', startResize);
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
        <UserProfileMenu />

        {projects.map((p) => (
          <ProjectListItem key={p.id} project={p} parentWidth={width} />
        ))}
      </SidebarContainer>

      <FloatingToggle onClick={toggleSidebar} themeMode={theme} isRight={false}>
        {hidden ? '▶' : '◀'}
      </FloatingToggle>
    </Wrapper>
  );
}
