import { Provider } from 'react-redux';
import './App.css';
import UIAIChatApp from './components/ui-ai-chat';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <UIAIChatApp />
      </div>
    </Provider>

  );
}

export default App;
