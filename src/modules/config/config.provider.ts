import { Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';

export const CONFIG = 'ConfigAuthService';

export const ConfigProvider: Provider = {
  provide: CONFIG,
  useFactory: () => {
    dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
    return import('config');
  },
};
