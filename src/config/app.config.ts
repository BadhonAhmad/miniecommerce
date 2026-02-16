export const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: 'api/v1',
});
