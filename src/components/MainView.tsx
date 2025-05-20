// components/MainView.tsx
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import ChatWindow from './ChatWindow';
import MainInput from './MainInput';

export default function MainView() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SidebarLeft />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatWindow />
        <MainInput />
      </div>
      <SidebarRight content={<></>} />
    </div>
  );
}
