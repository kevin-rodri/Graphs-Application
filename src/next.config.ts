// https://medium.com/@desinaoluseun/using-env-to-store-environment-variables-in-angular-20c15c7c0e6a 
import Dotenv from 'dotenv-webpack';
import { NextConfig } from 'next';
import { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  webpack(config: Configuration, { isServer }) {
    config.plugins = config.plugins || [];
    config.plugins.push(new Dotenv());
    return config;
  },
};

export default nextConfig;
