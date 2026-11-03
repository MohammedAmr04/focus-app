import createApp from "./app.js"
import type { Server } from "http";
const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

let isShuttingDown = false;

const app = createApp();
function shutdown( server :Server) {
  console.log('Shutting down gracefully...');
  
    if (isShuttingDown) {
    console.log('Shutdown already in progress. Ignoring additional shutdown request.');
    return;
    }
  
  isShuttingDown = true;
  const timeout = setTimeout(()=>{
    console.error('Shutdown timeout reached. Forcing exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
  server.close(() => {

    console.log('Server closed.');
    clearTimeout(timeout);
    process.exit(0); 
  });
}


  const server = app.listen(8000, () => {
    console.log('Server is running on port 8000');
  })


process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');

  shutdown(server);
  
  });

  process.on('SIGTERM',  () => {
    console.log('Received SIGTERM. Shutting down gracefully...');

    shutdown(server);
  })
