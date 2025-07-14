import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const tonConnectConfig = {
  manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json',
  buttonRootId: 'ton-connect-button',
  uiPreferences: {
    theme: 'SYSTEM',
    borderRadius: 'xs',
    colorsSet: {
      [Symbol.for('THEME')]: {
        connectButton: {
          background: '#2563EB',
          foreground: '#FFFFFF',
        },
      },
    },
  },
};