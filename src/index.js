import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(0,128,128, 1)'
    },
    action: {
      disabled: 'rgba(0,128,128, 0.4)',
      disabledBackground: 'rgba(0,128,128, 0.4)',
    }
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

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
