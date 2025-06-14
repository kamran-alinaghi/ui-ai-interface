// components/MainView.tsx
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import ChatView from './ChatView';

export default function MainView() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SidebarLeft />
      <ChatView/>
      <SidebarRight content={<></>} />
    </div>
  );
}
