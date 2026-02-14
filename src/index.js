import express from 'express';
import http from "http"
import dotenv from 'dotenv';
import { matchRouter } from './routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';

dotenv.config();

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Sports API!');
});

app.use('/matches', matchRouter)

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running on ${baseUrl}`);
  console.log(`Websocket server is running on ${baseUrl.replace('http', 'ws')}/ws`);
});