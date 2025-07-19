// Global test setup
// This file runs before all tests

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_KEY = 'test-jwt-secret-key';
process.env.PORT = '3001';
