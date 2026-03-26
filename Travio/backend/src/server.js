require('dotenv').config();
const app  = require('./app');
const { initDbSchema } = require('./config/initDb');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await initDbSchema();
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err.message);
    process.exit(1);
  }
}

bootstrap();
