#!/bin/bash

# Test runner script for Docker
set -e

echo "🧪 Running X-Ray IoT Tests..."

# Build the test image
echo "📦 Building test image..."
docker build -f Dockerfile.test -t xray-iot-tests .

# Run tests with Docker Compose
echo "🚀 Starting test environment..."
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Get test results
echo "📊 Test Results:"
docker-compose -f docker-compose.test.yml logs test-runner

# Cleanup
echo "🧹 Cleaning up..."
docker-compose -f docker-compose.test.yml down -v

echo "✅ Tests completed!"
