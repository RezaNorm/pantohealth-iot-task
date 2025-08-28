// MongoDB initialization script
db = db.getSiblingDB('xray-iot');

// Create a user for the application
db.createUser({
  user: 'xray-user',
  pwd: 'xray-password',
  roles: [
    {
      role: 'readWrite',
      db: 'xray-iot'
    }
  ]
});

// Create the signals collection with indexes
db.createCollection('signals');

// Create indexes for better performance
db.signals.createIndex({ deviceId: 1 });
db.signals.createIndex({ timestamp: 1 });
db.signals.createIndex({ processedAt: 1 });
db.signals.createIndex({ deviceId: 1, timestamp: 1 });

print('MongoDB initialization completed successfully!');
