import 'dotenv/config';
import app from './src/app.js';
import connectToDatabase from './src/config/db.js';
import config from './src/config/config.js';

const PORT = config.port;

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();