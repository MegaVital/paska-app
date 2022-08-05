import React from 'react';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Router } from './Router';
import { createRoot } from 'react-dom/client';
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { SearchBar } from './components/Header';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <React.Fragment>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.Fragment>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
