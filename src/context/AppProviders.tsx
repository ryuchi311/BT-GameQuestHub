import React from 'react';
import { AuthProvider } from './AuthContext';
import { QuestProvider } from './QuestContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <QuestProvider>
        {children}
      </QuestProvider>
    </AuthProvider>
  );
};