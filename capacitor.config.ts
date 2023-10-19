import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // appId: 'io.ionic.starter',
  appId: 'SyncSpace',
  appName: 'SyncSpace',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
