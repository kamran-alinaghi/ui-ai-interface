import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './side-bar';
import { appEntryStyle, mainViewStyle} from '../styles/ui-ai-chat-style';
import { Message, Project } from '../shared/interfaces';
import ProjectList from './projects-list';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useDispatch } from 'react-redux';
import { setProjects } from '../uiAISlice';


export default function UIAIChatApp() {
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState)=> state.uiAI.projects);
  const setProjects2 =(projs:Project[])=>{ dispatch(setProjects(projs));}
  const activeProjectId = useSelector((state: RootState) => state.uiAI.activeProjectId);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const updateProject = (updated: Project) => {
    setProjects2(projects.map((val)=>{
        if(val.id == updated.id){
            return updated;
        }
        return val;
    }));
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeProject) return;

    const newMessage: Message = { id: uuidv4(), role: 'pm', text: input };
    const updatedMessages = [...activeProject.messages, newMessage];
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ui-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: newMessage.id,
          role: newMessage.role,
          text: newMessage.text,
          messages: updatedMessages
        })
      });

      const data = await res.json();
      const aiMessage: Message = { id: uuidv4(), role: 'ai', text: data.reply };

      const updatedProject: Project = {
        ...activeProject,
        messages: [...updatedMessages, aiMessage],
        summary: data.summary,
        mosa: data.mosa
      };
      updateProject(updatedProject);
    } catch (err) {
      console.error('Failed to fetch AI response:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={appEntryStyle()}>
      <Sidebar side="left">
        <ProjectList/>
      </Sidebar>

      <main style={mainViewStyle()}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
          {activeProject?.messages.map(msg => (
            <div
              key={msg.id}
              style={{
                textAlign: msg.role === 'pm' ? 'right' : 'left',
                marginBottom: '10px'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: '20px',
                  backgroundColor: msg.role === 'pm' ? '#d1eaff' : '#e8e8e8',
                  color: '#333',
                  maxWidth: '70%',
                  wordWrap: 'break-word'
                }}
              >
                <strong>{msg.role === 'pm' ? 'PM' : 'UI AI'}:</strong> {msg.text}
              </div>
            </div>
          ))}
          {loading && <div style={{ fontStyle: 'italic', color: '#777' }}>UI AI is typing...</div>}
        </div>

        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              marginRight: '8px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: '10px 16px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </main>

      <Sidebar side="right">
        <h3>Future Content</h3>
      </Sidebar>
    </div>
  );
}
