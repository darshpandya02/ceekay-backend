
// scripts/start.js
const { spawn } = require('child_process');

const startServer = () => {
  console.log('Starting E-commerce Backend Server...');
  
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
  });

  server.on('error', (error) => {
    console.error('Server error:', error);
  });
};

startServer();