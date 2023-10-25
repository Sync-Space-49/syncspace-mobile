import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.syncspace.syncspace',
  appName: 'SyncSpace',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
