import React from 'react';
import AppSidebar from './AppSidebar';
import GlobalAudioControl from './GlobalAudioControl';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {children}
        <GlobalAudioControl />
      </div>
    </div>
  );
}
