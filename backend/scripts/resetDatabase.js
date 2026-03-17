#!/usr/bin/env node

/**
 * Database Reset and Migration Script
 * 
 * This script:
 * 1. Drops all tables in the database
 * 2. Runs fresh migrations
 * 3. Generates Prisma Client
 * 4. Seeds the database with initial data
 * 
 * WARNING: This will DELETE ALL DATA from your database!
 */

const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const execute = (command) => {
  try {
    // Run commands from backend root, not scripts folder
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    return true;
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    console.error(error.message);
    return false;
  }
};

const main = async () => {
  console.log('⚠️  DATABASE RESET AND MIGRATION SCRIPT ⚠️\n');
  console.log('This script will:');
  console.log('  1. Drop ALL tables from the database');
  console.log('  2. Run fresh migrations (auto-seeds)');
  console.log('  3. Generate Prisma Client');
  console.log('\n🔴 WARNING: ALL DATA WILL BE PERMANENTLY DELETED!\n');

  rl.question('Are you sure you want to continue? Type "YES" to confirm: ', (answer) => {
    if (answer !== 'YES') {
      console.log('\n❌ Operation cancelled. No changes were made.');
      rl.close();
      process.exit(0);
    }

    rl.close();
    console.log('\n' + '='.repeat(60));
    console.log('Starting database reset and migration...\n');

    // Step 1: Migrate (this will drop and recreate tables if using migrate reset)
    console.log('📊 Step 1/4: Running database migrations...');
    if (!execute('npx prisma migrate reset --force')) {
      console.error('\n❌ Migration failed. Please check your database connection.');
      process.exit(1);
    }
    console.log('✅ Migrations completed\n');

    // Step 2: Generate Prisma Client
    console.log('🔧 Step 2/4: Generating Prisma Client...');
    if (!execute('npx prisma generate')) {
      console.error('\n❌ Prisma client generation failed.');
      process.exit(1);
    }
    console.log('✅ Prisma Client generated\n');

    // NOTE: Seeding happens automatically with 'prisma migrate reset'
    // No need to run it again - skip Step 3

    // Step 4: Summary
    console.log('='.repeat(60));
    console.log('🎉 Database reset and migration completed successfully!\n');
    console.log('📋 Summary:');
    console.log('   ✅ All tables dropped and recreated');
    console.log('   ✅ Migrations applied');
    console.log('   ✅ Prisma Client generated');
    console.log('   ✅ Initial data seeded (automatic via migrate reset)');
    console.log('\n💡 You can now run your application or seed additional data.\n');
  });
};

main();
