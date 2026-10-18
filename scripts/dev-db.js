const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function startDatabase() {
  const dbDir = path.join(__dirname, '..', '.db-data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  try {
    console.log('[KajKhoj DB] Starting embedded MongoDB on port 27017...');
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'kajkhoj',
        dbPath: dbDir,
        storageEngine: 'wiredTiger',
      },
    });

    const uri = mongod.getUri();
    console.log(`[KajKhoj DB] MongoDB is live and ready!`);
    console.log(`[KajKhoj DB] Connection URI: ${uri}kajkhoj`);
    console.log(`[KajKhoj DB] Press Ctrl+C to stop.`);

    const cleanup = async () => {
      console.log('\n[KajKhoj DB] Stopping MongoDB...');
      await mongod.stop();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  } catch (error) {
    if (error.message && error.message.includes('EADDRINUSE')) {
      console.log('[KajKhoj DB] Port 27017 is already in use by an active MongoDB instance. You are ready to go!');
    } else {
      console.error('[KajKhoj DB] Error starting MongoDB:', error);
    }
  }
}

if (require.main === module) {
  startDatabase();
}

module.exports = { startDatabase };
