import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './redux';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(0,128,128, 1)'
    },
    action: {
      disabled: 'rgba(0,128,128, 0.4)',
      disabledBackground: 'rgba(0,128,128, 0.4)',
    },
    mode: 'light'
  },
  typography: {
    htmlFontSize: 16,
    fontSize: 12,
    h1: {
      fontFamily: "'Maven Pro', sans-serif"
    },
    h2: {
      fontFamily: "'Maven Pro', sans-serif"
    },
    h3: {
      fontFamily: "'Maven Pro', sans-serif"
    },
    h4: {
      fontFamily: "'Maven Pro', sans-serif"
    },
    h5: {
      fontFamily: "'Maven Pro', sans-serif"
    },
    h6: {
      fontFamily: "'Maven Pro', sans-serif"
    },
  },
  zIndex: {
    appBar: 10
  }
});

axios.defaults.headers.post['Content-Type'] ='application/json';
axios.defaults.baseURL = 'http://localhost:5000/api/v1/';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
  </React.StrictMode>
);

