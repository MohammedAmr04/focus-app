import express, { type Express } from 'express';
import cors from 'cors';


const corsOptions= {
    origin: ['http://localhost:3000', 'https://focus-app-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true,
  }
 

function createApp(): Express{
    const app: Express = express();
  
    app.use(cors(corsOptions));
    // Global JSON parsing middleware
    app.use(express.json());
    
    
  return app;
}


export default createApp;

