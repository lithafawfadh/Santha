import React, { useEffect, lazy, Suspense } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import OfflineBadge from './components/common/OfflineBadge';

const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const MemberDashboard = lazy(() => import('./components/member/MemberDashboard'));

function AppContent() {
  const { currentUser, loading, isDarkMode } = useApp();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Mobile Hardware Back Button Handling
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let lastBackPress = 0;
    const backListenerPromise = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack && window.history.length > 1) {
        window.history.back();
        return;
      }

      const now = Date.now();
      if (now - lastBackPress < 2000) {
        CapApp.exitApp();
      } else {
        lastBackPress = now;
      }
    });

    return () => {
      backListenerPromise.then(l => l.remove());
    };
  }, []);

  // Mobile Status Bar & Notch / Safe-Area Inset Management
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupStatusBar = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: true });

        // Retrieve native hardware status bar height
        const info = await StatusBar.getInfo();
        const height = (info && info.height && info.height > 0) ? info.height : 28;
        document.documentElement.style.setProperty('--sat', `${height}px`);

        // Dynamically configure status bar style and background color
        if (isDarkMode) {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#0E1117' });
        } else {
          await StatusBar.setStyle({ style: Style.Light });
          const barColor = !currentUser
            ? '#FAF7F2'
            : currentUser.role === 'admin'
            ? '#FFFFFF'
            : '#FAF7F2';
          await StatusBar.setBackgroundColor({ color: barColor });
        }
      } catch (err) {
        console.warn('StatusBar configuration notice:', err);
      }
    };

    setupStatusBar();
  }, [isDarkMode, currentUser]);

  if (!currentUser) {
    return <Login />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <OfflineBadge />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
          </div>
        </div>
      }>
        {currentUser.role === 'admin' ? <AdminDashboard /> : <MemberDashboard />}
      </Suspense>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
