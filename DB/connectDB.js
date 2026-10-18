import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, memoryServer: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let connectionUrl = process.env.DB_URI;

    // Check if we can connect to provided DB_URI or need fallback
    cached.promise = (async () => {
      try {
        if (!connectionUrl) {
          throw new Error("DB_URI environment variable is not defined");
        }
        console.log(`[Database] Connecting to MongoDB at ${connectionUrl}...`);
        const conn = await mongoose.connect(connectionUrl, opts);
        console.log("[Database] Connected successfully to MongoDB.");
        return conn;
      } catch (err) {
        console.warn(`[Database] Primary connection failed: ${err.message}`);
        console.log("[Database] Initializing embedded MongoDB fallback instance...");

        try {
          const { MongoMemoryServer } = await import("mongodb-memory-server");
          if (!cached.memoryServer) {
            cached.memoryServer = await MongoMemoryServer.create();
          }
          const memoryUri = cached.memoryServer.getUri();
          console.log(`[Database] Connected to embedded fallback MongoDB at ${memoryUri}`);
          const fallbackConn = await mongoose.connect(memoryUri, opts);
          return fallbackConn;
        } catch (memErr) {
          console.error("[Database] Failed to initialize embedded fallback DB:", memErr);
          throw err;
        }
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  mongoose.set("strictQuery", false);
  return cached.conn;
};

export default connectDB;
