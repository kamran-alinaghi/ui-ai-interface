// components/ProjectListItem.tsx
import React from 'react';
import { Project } from '../types/project';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectProject,
  renameProject,
  deleteProject,
} from '../redux/projectsSlice';
import { Container, NameButton } from '../styles/ProjectListItem.style';

interface Props {
  project: Project;
}

const ProjectListItem: React.FC<Props> = ({ project }) => {
  const dispatch = useAppDispatch();
  const activeId = useAppSelector((s) => s.projects.activeProjectId);

  const handleRename = () => {
    const newName = prompt('Rename project', project.name);
    if (newName) {
      dispatch(renameProject({ id: project.id, newName }));
    }
  };

  return (
    <Container>
      <NameButton
        active={project.id === activeId}
        onClick={() => dispatch(selectProject(project.id))}
      >
        {project.name}
      </NameButton>
      <button onClick={handleRename}>⋮</button>
      <button onClick={() => dispatch(deleteProject(project.id))}>🗑</button>
    </Container>
  );
};

export default ProjectListItem;
