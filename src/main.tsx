import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    sl: true
  }
}

const theme = createTheme({
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl", "sl"],
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1536, sl: 2560 }
  },
  palette: {
    primary: {
      main: '#354F52'
    },
    secondary: {
      main: '#52796F'
    },
    text: {
      primary: '#2F3E46',
      secondary: '#354F52'
    },
    action: {
      disabled: '#354F5260',
      disabledBackground: '#CAD2C5',
    },
    mode: 'light'
  },
  typography: {
    htmlFontSize: 16,
    fontSize: 12,
    h1: {
      fontFamily: "'Maven Pro', sans-serif",
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
axios.defaults.baseURL = 'http://localhost:5500/api/';

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
