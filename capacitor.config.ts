import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.syncspace',
  appName: 'SyncSpace',
  webDir: 'dist',
  ios: {
    loggingBehavior: 'debug',
    limitsNavigationsToAppBoundDomains: true
  },
  server: {
    androidScheme: 'https',
    errorPath: '/error'
  }
};

export default config;
