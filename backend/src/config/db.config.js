const mongoose = require('mongoose');
const { ATLAS_DB_URL } = require('./server.config');

let instance; // stores db instance

class DBConnection {
  #isConnected;
  constructor(db_uri) {
    if (instance) {
      throw new Error("Only one connection can exist");
    }
    this.uri = db_uri;
    instance = this;
    this.#isConnected = false;
  }

  async connect() {
    if (this.#isConnected) {
      throw new Error("DB Already connected");
    }
    try {
      await mongoose.connect(this.uri);

      this.#isConnected = true;
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ DB Connection Error:", error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.#isConnected) {
      await mongoose.disconnect();
      this.#isConnected = false;
      console.log("DB Disconnected");
    }
  }
}

const db = Object.freeze(new DBConnection(ATLAS_DB_URL));

module.exports = db;