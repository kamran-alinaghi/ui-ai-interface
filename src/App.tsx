// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import MainView from './components/MainView';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <MainView />
      </div>
    </Provider>
  );
};

export default App;
