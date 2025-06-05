import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types/project';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectProject,
  renameProject,
  deleteProject,
} from '../redux/projectsSlice';
import {
  Container,
  NameButton,
  MoreButton,
  Dropdown,
  DropdownItem,
} from '../styles/ProjectListItem.style';
import PopupView from './PopupView';

interface Props {
  project: Project;
}

const ProjectListItem: React.FC<Props> = ({ project }) => {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.projects.activeProjectId);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const theme = useAppSelector((state) => state.theme.theme);

  const [popupMode, setPopupMode] = useState<'prompt' | 'confirm' | null>(null);
  const [popupMessage, setPopupMessage] = useState('');

  const handleRename = () => {
    setPopupMessage(`Rename project "${project.name}"`);
    setPopupMode('prompt');
    setMenuOpen(false);
  };

  const handleDelete = () => {
    setPopupMessage(`Are you sure you want to delete "${project.name}"?`);
    setPopupMode('confirm');
    setMenuOpen(false);
  };

  const handlePopupClose = (result?: string | boolean) => {
    if (popupMode === 'prompt' && typeof result === 'string' && result.trim() !== '') {
      dispatch(renameProject({ id: project.id, newName: result }));
    } else if (popupMode === 'confirm' && result === true) {
      dispatch(deleteProject(project.id));
    }
    setPopupMode(null);
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
        onClick={() => setMenuOpen((open) => !open)}
      >
        ⋮
      </MoreButton>
      {menuOpen && (
        <Dropdown themeMode={theme}>
          <DropdownItem onClick={handleRename}>Rename</DropdownItem>
          <DropdownItem onClick={handleDelete}>Delete</DropdownItem>
        </Dropdown>
      )}
      {popupMode && (
        <PopupView
          mode={popupMode}
          message={popupMessage}
          onClose={handlePopupClose}
        />
      )}
    </Container>
  );
};

export default ProjectListItem;
