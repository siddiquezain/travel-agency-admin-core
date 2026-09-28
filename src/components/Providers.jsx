'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from '../store';
import { ColorModeProvider } from '../context/ColorModeContext';
import CssBaseline from '@mui/material/CssBaseline';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <ColorModeProvider>
          <CssBaseline />
          {children}
        </ColorModeProvider>
      </SessionProvider>
    </Provider>
  );
}
