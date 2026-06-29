import { SystemConfig } from '../../../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsApi = {
  saveConfig: async (config: SystemConfig): Promise<SystemConfig> => {
    await sleep(600);
    localStorage.setItem('ent_config', JSON.stringify(config));
    return config;
  }
};
