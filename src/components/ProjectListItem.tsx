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
import { ConfirmDialog } from './ConfirmDialog';

interface Props {
  project: Project;
}

const ProjectListItem: React.FC<Props> = ({ project }) => {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.projects.activeProjectId);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);


  const handleRename = () => {
    const newName = prompt('Rename project', project.name);
    if (newName) {
      dispatch(renameProject({ id: project.id, newName }));
    }
    setMenuOpen(false);
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
    setMenuOpen(false);
  };

  const confirmDelete = () => {
    dispatch(deleteProject(project.id));
    setIsConfirmOpen(false);
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
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
        onClick={() => dispatch(selectProject(project.id))}
      >
        {project.name}
      </NameButton>
      <MoreButton 
      active={project.id === activeId}
      onClick={() => setMenuOpen((open) => !open)}>⋮</MoreButton>
      {menuOpen && (
        <Dropdown>
          <DropdownItem onClick={handleRename}>Rename</DropdownItem>
          <DropdownItem onClick={handleDelete}>Delete</DropdownItem>
        </Dropdown>
      )}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        message={`Are you sure you want to delete "${project.name}"?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Container>
  );
};

export default ProjectListItem;
