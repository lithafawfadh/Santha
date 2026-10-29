import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.santha.app',
  appName: 'Santha',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#0E1117',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0E1117'
    }
  }
};

export default config;
