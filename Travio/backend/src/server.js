require('dotenv').config();
const app  = require('./app');
const { initDbSchema } = require('./config/initDb');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    console.log('🚀 Initializing database schema...');
    await initDbSchema();
    console.log('✅ Database schema initialized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err.message);
    console.error('Stack:', err.stack);

    // Di production, jangan exit process - coba start server tanpa init DB
    console.log('⚠️  Attempting to start server without database initialization...');

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} (DB init failed)`);
    });
  }
}

bootstrap();
