interface DBDataStructure {
  key: string;
  values: { [index: number]: string };
}

interface IndexedDBConfig {
  dbName: string;
  version: number;
  storeName: string;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private config: IndexedDBConfig;

  constructor(config: IndexedDBConfig) {
    this.config = config;
  }

  // Open or create the IndexedDB database
  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not available in this environment'));
        return;
      }

      const request = window.indexedDB.open(this.config.dbName, this.config.version);

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, { keyPath: 'key' });
          store.createIndex('key', 'key', { unique: true });
        }
      };
    });
  }

  // Store data in the database
  async storeData(data: DBDataStructure): Promise<void> {
    if (!this.db) {
      await this.openDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.config.storeName], 'readwrite');
      const store = transaction.objectStore(this.config.storeName);

      const request = store.put(data);

      request.onerror = () => {
        reject(new Error(`Failed to store data: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  // Load data from the database by key
  async loadData(key: string): Promise<DBDataStructure | null> {
    if (!this.db) {
      await this.openDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.config.storeName], 'readonly');
      const store = transaction.objectStore(this.config.storeName);

      const request = store.get(key);

      request.onerror = () => {
        reject(new Error(`Failed to load data: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  }

  // Remove data from the database by key
  async removeData(key: string): Promise<void> {
    if (!this.db) {
      await this.openDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.config.storeName], 'readwrite');
      const store = transaction.objectStore(this.config.storeName);

      const request = store.delete(key);

      request.onerror = () => {
        reject(new Error(`Failed to remove data: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  // Get all data from the database
  async getAllData(): Promise<DBDataStructure[]> {
    if (!this.db) {
      await this.openDB();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.config.storeName], 'readonly');
      const store = transaction.objectStore(this.config.storeName);

      const request = store.getAll();

      request.onerror = () => {
        reject(new Error(`Failed to get all data: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  // Close the database connection
  closeDB(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Default configuration for the database
const defaultConfig: IndexedDBConfig = {
  dbName: 'TiptapDB',
  version: 1,
  storeName: 'dataStore'
};

// Create and export a default instance
export const dbManager = new IndexedDBManager(defaultConfig);

// Export individual functions for easier usage
export const openDB = () => dbManager.openDB();
export const storeData = (data: DBDataStructure) => dbManager.storeData(data);
export const loadData = (key: string) => dbManager.loadData(key);
export const removeData = (key: string) => dbManager.removeData(key);
export const getAllData = () => dbManager.getAllData();
export const closeDB = () => dbManager.closeDB();

// Export the class for custom configurations
export { IndexedDBManager };
export type { DBDataStructure, IndexedDBConfig };
