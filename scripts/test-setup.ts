#!/usr/bin/env node

/**
 * Test Setup Script for EmotionTamer
 * 
 * This script helps set up the testing environment and run tests
 * for both the React Native app and the Node.js server.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 EmotionTamer Testing Setup\n');

// Helper function to run commands
function runCommand(command: string, description: string, options: { cwd?: string, optional?: boolean } = {}) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: options.cwd || process.cwd() 
    });
    console.log(`✅ ${description} completed\n`);
  } catch (error: any) {
    console.error(`❌ ${description} failed:`, error.message);
    if (!options.optional) {
      process.exit(1);
    }
    console.log(`⚠️  Continuing despite error...\n`);
  }
}

// Helper function to check if file exists
function fileExists(filePath: string) {
  return fs.existsSync(path.resolve(filePath));
}

// Main setup function
function setupTesting() {
  console.log('Setting up testing environment...\n');

  // Check if we're in the right directory
  if (!fileExists('package.json')) {
    console.error('❌ Please run this script from the project root directory');
    process.exit(1);
  }

  // Install main app testing dependencies
  console.log('📦 Installing React Native testing dependencies...');
  runCommand(
    'npm install --save-dev @testing-library/react-native @testing-library/jest-native jest jest-expo @types/jest react-test-renderer',
    'Installing app testing dependencies',
    { optional: true }
  );

  // Install server testing dependencies
  if (fileExists('server/package.json')) {
    console.log('📦 Installing server testing dependencies...');
    runCommand(
      'npm install --save-dev jest @types/jest supertest @types/supertest ts-jest',
      'Installing server testing dependencies',
      { cwd: 'server', optional: true }
    );
  }

  // Create test directories if they don't exist
  const testDirs = [
    'app/__tests__',
    'app/__tests__/utils',
    'app/__tests__/integration',
    'app/components/__tests__',
    'app/context/__tests__',
    'app/services/__tests__',
    'app/utils/__tests__',
    'server/__tests__'
  ];

  testDirs.forEach(dir => {
    if (!fileExists(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  console.log('\n🎉 Testing setup completed!');
  console.log('\n📚 Available test commands:');
  console.log('  npm test                 - Run app tests');
  console.log('  npm run test:watch       - Run app tests in watch mode');
  console.log('  npm run test:coverage    - Run app tests with coverage');
  console.log('  npm run test:ci          - Run app tests for CI');
  console.log('  cd server && npm test    - Run server tests');
  console.log('  cd server && npm run test:coverage - Run server tests with coverage');
}

// Run all tests function
function runAllTests() {
  console.log('🚀 Running all tests...\n');

  // Run app tests
  runCommand('npm test', 'Running React Native app tests');

  // Run server tests
  if (fileExists('server/package.json')) {
    runCommand('npm test', 'Running server tests', { cwd: 'server' });
  }

  console.log('🎉 All tests completed!');
}

// Run tests with coverage
function runTestsWithCoverage() {
  console.log('📊 Running tests with coverage...\n');

  // Run app tests with coverage
  runCommand('npm run test:coverage', 'Running app tests with coverage');

  // Run server tests with coverage
  if (fileExists('server/package.json')) {
    runCommand('npm run test:coverage', 'Running server tests with coverage', { cwd: 'server' });
  }

  console.log('📊 Coverage reports generated!');
  console.log('📁 App coverage: ./coverage/lcov-report/index.html');
  console.log('📁 Server coverage: ./server/coverage/lcov-report/index.html');
}

// Watch mode for development
function runTestsInWatchMode() {
  console.log('👀 Starting tests in watch mode...\n');
  console.log('Press Ctrl+C to stop watching\n');

  try {
    runCommand('npm run test:watch', 'Running tests in watch mode');
  } catch (error) {
    console.log('👋 Watch mode stopped');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'setup':
    setupTesting();
    break;
  case 'run':
    runAllTests();
    break;
  case 'coverage':
    runTestsWithCoverage();
    break;
  case 'watch':
    runTestsInWatchMode();
    break;
  case 'help':
  case '--help':
  case '-h':
    console.log('EmotionTamer Test Setup Script\n');
    console.log('Usage: node scripts/test-setup.js [command]\n');
    console.log('Commands:');
    console.log('  setup     - Set up testing environment');
    console.log('  run       - Run all tests');
    console.log('  coverage  - Run tests with coverage');
    console.log('  watch     - Run tests in watch mode');
    console.log('  help      - Show this help message');
    break;
  default:
    console.log('🤔 No command specified. Running setup...\n');
    setupTesting();
    break;
} 