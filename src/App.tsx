import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ViewSelector from './components/ViewSelector';

const AppWrapper: React.FC = () => (
  <Provider store={store}>
    <ViewSelector />
  </Provider>
);

export default AppWrapper;
