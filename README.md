# X-Ray IoT Data Processing System

A NestJS-based monorepo application that processes x-ray data from IoT devices using RabbitMQ, stores processed information in MongoDB, and provides RESTful API endpoints for data retrieval and analysis.

## 🏗️ Technology Stack

### Core Framework
- **NestJS** - Progressive Node.js framework for building efficient and scalable server-side applications
- **TypeScript** - Strongly typed programming language that builds on JavaScript
- **Node.js** - JavaScript runtime built on Chrome's V8 JavaScript engine

### Database & Messaging
- **MongoDB** - NoSQL document database for storing x-ray signal data
- **Mongoose** - MongoDB object modeling tool designed to work in an asynchronous environment
- **RabbitMQ** - Message broker that enables asynchronous communication between services

### API & Documentation
- **REST API** - RESTful web services for data access and manipulation
- **Swagger/OpenAPI** - API documentation and testing interface
- **Class-validator/Class-transformer** - DTO validation and transformation

### Testing & Quality
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertions for testing Node.js HTTP servers
- **Docker & Docker Compose** - Containerization and orchestration

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **NestJS CLI** - Command-line interface for NestJS applications

## 🏛️ Architecture & Design Patterns

### Monorepo Structure
The project follows a monorepo architecture with clear separation of concerns:

```
├── apps/                    # Applications
│   ├── api/                # REST API service
│   ├── producer/           # IoT data producer/simulator
│   └── consumer/           # Message consumer service
├── libs/                   # Shared libraries
│   ├── mongo/             # MongoDB integration
│   ├── rabbitmq/          # RabbitMQ integration
│   ├── signals/           # Signal processing logic
│   └── common/            # Shared utilities and exceptions
```

### Design Patterns

#### 1. **Dependency Injection**
- Uses NestJS's built-in DI container
- Services are injected into controllers and other services
- Promotes loose coupling and testability

#### 2. **Repository Pattern**
- `MongoService` acts as a repository for data access
- Abstracts database operations from business logic
- Provides a clean interface for CRUD operations

#### 3. **Service Layer Pattern**
- Business logic is encapsulated in service classes
- Controllers handle HTTP requests and delegate to services
- Clear separation between presentation and business layers

#### 4. **Module Pattern**
- Each feature is organized into modules
- Modules encapsulate related functionality
- Promotes modularity and reusability

#### 5. **DTO Pattern**
- Data Transfer Objects for API request/response validation
- Ensures type safety and data integrity
- Provides clear API contracts

#### 6. **Exception Handling**
- Global exception filter for consistent error responses
- Custom exception classes for different error types
- Centralized error handling and logging

### Data Flow Architecture

```
IoT Devices → RabbitMQ → Consumer Service → MongoDB
                                    ↓
                              REST API ← Client Applications
```

1. **Producer**: Simulates IoT devices sending x-ray data to RabbitMQ
2. **Consumer**: Processes messages from RabbitMQ and stores data in MongoDB
3. **API**: Provides REST endpoints for data retrieval and analysis

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/RezaNorm/pantohealth-iot-task.git
   cd pantohealth-iot-task
   ```

2. **Configure environment variables** (optional - defaults are provided)
   ```bash
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/xray-iot
   
   # RabbitMQ
   RABBITMQ_URL=amqp://localhost
   
   # API Ports
   API_PORT=3000
   PRODUCER_PORT=3001
   CONSUMER_PORT=3002
   
   # Environment
   NODE_ENV=development
   ```

## 🐳 Running with Docker

### Full Application Stack
Run the complete application with all services:

```bash
# Start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Services Overview
- **API Service**: http://localhost:3000
- **Producer Service**: http://localhost:3001
- **Consumer Service**: http://localhost:3002
- **MongoDB**: localhost:27017
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### API Documentation
- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs-json

## 📊 Sample Data Structure

### X-Ray Signal Data
```json
{
  "deviceId": "66bb584d4ae73e488c30a072",
  "timestamp": 1735683480000,
  "dataLength": 3,
  "dataVolume": 24,
  "rawData": {
    "data": [
      [762, [51.339764, 12.339223833333334, 1.2038000000000002]],
      [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
      [2763, [51.339782, 12.339196166666667, 2.13906]]
    ]
  },
  "processedAt": "2025-01-01T12:00:00.000Z",
  "status": "processed"
}
```

## 📁 Project Structure

```
├── apps/                          # Applications
│   ├── api/                      # REST API service
│   │   ├── src/
│   │   │   ├── api.module.ts
│   │   │   └── main.ts
│   │   └── Dockerfile.api
│   ├── producer/                 # IoT data producer
│   │   ├── src/
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── Dockerfile.producer
│   └── consumer/                 # Message consumer
│       ├── src/
│       │   ├── consumer.controller.ts
│       │   ├── consumer.service.ts
│       │   ├── consumer.module.ts
│       │   └── main.ts
│       └── Dockerfile.consumer
├── libs/                         # Shared libraries
│   ├── mongo/                   # MongoDB integration
│   │   ├── src/
│   │   │   ├── mongo.module.ts
│   │   │   ├── mongo.service.ts
│   │   │   ├── mongo.service.spec.ts
│   │   │   └── schemas/
│   │   └── tsconfig.lib.json
│   ├── rabbitmq/                # RabbitMQ integration
│   │   ├── src/
│   │   │   ├── rabbitmq.module.ts
│   │   │   ├── rabbitmq.service.ts
│   │   │   └── rabbitmq.service.spec.ts
│   │   └── tsconfig.lib.json
│   ├── signals/                 # Signal processing
│   │   ├── src/
│   │   │   ├── signal.module.ts
│   │   │   ├── signal.service.ts
│   │   │   ├── signal.service.spec.ts
│   │   │   ├── signal.controller.ts
│   │   │   ├── signal.controller.spec.ts
│   │   │   └── dto/
│   │   └── tsconfig.lib.json
│   └── common/                  # Shared utilities
│       ├── src/
│       │   ├── exceptions/
│       │   └── filters/
│       └── tsconfig.lib.json
├── docker/                      # Docker configuration
│   └── mongo/
│       └── init-mongo.js
├── docker-compose.yml           # Production Docker setup
├── docker-compose.dev.yml       # Development Docker setup
├── docker-compose.test.yml      # Test Docker setup
├── Dockerfile.test              # Test container
├── package.json                 # Dependencies and scripts
├── nest-cli.json               # NestJS CLI configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :27017
   lsof -i :5672
   ```

2. **Docker build failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **MongoDB connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

4. **RabbitMQ connection issues**
   ```bash
   # Check RabbitMQ logs
   docker-compose logs rabbitmq
   
   # Access RabbitMQ management
   # http://localhost:15672 (guest/guest)
   ```

### Health Checks
All services include health checks. Check service status:
```bash
docker-compose ps
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For questions or issues, please create an issue in the repository or contact the development team.
