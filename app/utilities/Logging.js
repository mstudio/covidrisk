// @ts-nocheck

// Disables console.log in UAT and PROD environments
const initConsoleLogging = (env) => {
  if (env === 'uat' || env === 'prod') {
    console.log = () => false;
  }
};

export { initConsoleLogging };
