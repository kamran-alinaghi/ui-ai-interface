import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types/project';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectProject } from '../redux/projectsSlice';
import {
  Container,
  NameButton,
  MoreButton,
  Dropdown,
  DropdownItem,
} from '../styles/ProjectListItem.style';
import PopupView from './PopupView';

// 🔌 Firestore + thunks
import { db } from './firebase-ui/firebase';
import { renameUserProject, deleteUserProject } from '../redux/projectsThunks';

interface Props {
  project: Project;
  parentWidth: number;
}

const ProjectListItem: React.FC<Props> = ({ project, parentWidth }) => {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.projects.activeProjectId);
  const theme = useAppSelector((s) => s.theme.theme);

  const [menuOpen, setMenuOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<'prompt' | 'confirm' | null>(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [dropdownLeft, setDropdownLeft] = useState(90);
  const ref = useRef<HTMLDivElement>(null);

  // 👉 store the action we want to run when popup resolves
  const pendingActionRef = useRef<((result?: string | boolean) => void) | null>(null);

  const handleDropDownPosition = (e: React.MouseEvent) => {
    const max = parentWidth - 80;
    const left = e.clientX > max ? max : e.clientX;
    setDropdownLeft(left);
    setMenuOpen(true);
  };

  // ✅ Logic now lives here (sets up the action + opens popup)
  const handleRename = () => {
    setPopupMessage(`Rename project "${project.name}"`);
    setPopupMode('prompt');
    setMenuOpen(false);

    pendingActionRef.current = (result) => {
      if (typeof result === 'string' && result.trim() !== '' && result !== project.name) {
        // Firestore-backed rename
        dispatch(renameUserProject(db, project.id, result.trim()));
      }
    };
  };

  // ✅ Logic now lives here (sets up the action + opens popup)
  const handleDelete = () => {
    setPopupMessage(`Are you sure you want to delete "${project.name}"?`);
    setPopupMode('confirm');
    setMenuOpen(false);

    pendingActionRef.current = (result) => {
      if (result === true) {
        // Firestore-backed delete
        dispatch(deleteUserProject(db, project.id));
      }
    };
  };

  // Popup just triggers whatever action we prepared
  const handlePopupClose = (result?: string | boolean) => {
    try {
      pendingActionRef.current?.(result);
    } finally {
      pendingActionRef.current = null;
      setPopupMode(null);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <Container ref={ref}>
      <NameButton
        active={project.id === activeId}
        themeMode={theme}
        onClick={() => dispatch(selectProject(project.id))}
      >
        {project.name}
      </NameButton>

      <MoreButton
        active={project.id === activeId}
        themeMode={theme}
        onClick={handleDropDownPosition}
      >
        ⋮
      </MoreButton>

      {menuOpen && (
        <Dropdown themeMode={theme} left={dropdownLeft}>
          <DropdownItem onClick={handleRename}>Rename</DropdownItem>
          <DropdownItem onClick={handleDelete}>Delete</DropdownItem>
        </Dropdown>
      )}

      {popupMode && (
        <PopupView
          mode={popupMode}
          message={popupMessage}
          onClose={handlePopupClose}
          defaultValue={popupMode === 'prompt' ? project.name : undefined}
        />
      )}
    </Container>
  );
};

export default ProjectListItem;
