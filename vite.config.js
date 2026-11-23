// Con "npm run dev" (Vite), las llamadas a /api se envían al servidor de server.js.
// Para usarlo: en una terminal "npm start" y en otra "npm run dev".
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
