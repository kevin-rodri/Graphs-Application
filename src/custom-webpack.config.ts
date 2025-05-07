// https://medium.com/@desinaoluseun/using-env-to-store-environment-variables-in-angular-20c15c7c0e6a 
import Dotenv from 'dotenv-webpack';
import { Configuration } from 'webpack';

const config: Configuration = {
  plugins: [new Dotenv()],
};

export default config;
