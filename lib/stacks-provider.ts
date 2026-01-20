// Stacks blockchain provider utilities
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { config } from './config';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const getStacksNetwork = () => {
  return config.stacks.network === 'mainnet'
    ? new StacksMainnet()
    : new StacksTestnet();
};

export const connectStacksWallet = () => {
  return new Promise<string>((resolve, reject) => {
    showConnect({
      appDetails: {
        name: config.app.name,
        icon: `${config.app.url}/logo.png`,
      },
      onFinish: () => {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          resolve(userData.profile.stxAddress.mainnet);
        } else {
          reject(new Error('User not signed in'));
        }
      },
      onCancel: () => {
        reject(new Error('User cancelled connection'));
      },
      userSession,
    });
  });
};

export const disconnectStacksWallet = () => {
  if (userSession.isUserSignedIn()) {
    userSession.signUserOut();
  }
};

export const getStacksAddress = (): string | null => {
  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    return userData.profile.stxAddress.mainnet;
  }
  return null;
};
