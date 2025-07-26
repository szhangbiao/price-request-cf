export interface Config {
  apiUrl: string;
  debug: boolean;
  version: string;
}

export const config: Config = {
  apiUrl: 'https://api.example.com',
  debug: process.env.NODE_ENV !== 'production',
  version: '0.1.0',
};