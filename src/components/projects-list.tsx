import { useState, useRef, JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../shared/interfaces';
import { newProjectStyle, projectListStyle } from '../styles/ui-ai-chat-style';
import { setActiveProjectId, setProjects } from '../uiAISlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';


export default function ProjectList(): JSX.Element {
    const activeProjectId = useSelector((state: RootState) => state.uiAI.activeProjectId);
    const dispatch = useDispatch();
    const projects = useSelector((state: RootState)=> state.uiAI.projects);
    const setProjects2 =(projs:Project[])=>{ dispatch(setProjects(projs));}
    const createProject = () => {
        const newProject: Project = {
            id: uuidv4(),
            name: `Untitled${projects.length + 1}`,
            messages: [],
            summary: '',
            mosa: {}
        };
        setProjects2([...projects, newProject]);
        dispatch(setActiveProjectId(newProject.id));
    };
    return (
        <div>
            <h3>Projects</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {projects.map(p => (
                    <li
                        key={p.id}
                        onClick={() => dispatch(setActiveProjectId(p.id))}
                        style={projectListStyle(p.id === activeProjectId)}
                    >
                        {p.name}
                    </li>
                ))}
            </ul>
            <button onClick={createProject} style={newProjectStyle()}>
                + New Project
            </button>
        </div>
    );
}

