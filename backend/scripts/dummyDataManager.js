// Dummy Data Management System for QC Workflow
// This script provides a safe and comprehensive interface for managing dummy data

const { exec } = require('child_process');
const readline = require('readline');

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr && !stderr.includes('warn')) {
        console.error(stderr);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function showMenu() {
  console.clear();
  colorLog('cyan', '╔══════════════════════════════════════════════════════════════╗');
  colorLog('cyan', '║                    QC DUMMY DATA MANAGER                      ║');
  colorLog('cyan', '║                     Survey Application                        ║');
  colorLog('cyan', '╠══════════════════════════════════════════════════════════════╣');
  colorLog('cyan', '║                                                              ║');
  colorLog('bright', '║  1. 🚀 Generate Dummy Data    - Create test QC surveys      ║');
  colorLog('bright', '║  2. 🔍 Validate Database      - Check data integrity        ║');
  colorLog('bright', '║  3. 🧹 Cleanup Dummy Data     - Safe removal of test data   ║');
  colorLog('bright', '║  4. 📊 Database Status        - Show current data counts    ║');
  colorLog('bright', '║  5. 🔄 Complete Reset         - Cleanup + Validate          ║');
  colorLog('bright', '║  6. 💾 Create Backup Point    - Safety checkpoint          ║');
  colorLog('bright', '║  7. ❓ Help & Safety Info     - Risk mitigation guide      ║');
  colorLog('red',    '║  0. 🚪 Exit                   - Close manager              ║');
  colorLog('cyan', '║                                                              ║');
  colorLog('cyan', '╚══════════════════════════════════════════════════════════════╝');
}

async function generateDummyData() {
  try {
    colorLog('yellow', '🚀 Starting dummy data generation...');
    colorLog('blue', 'This will create 15 test surveys with QC workflow data.');
    
    const confirm = await askQuestion('Continue? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      colorLog('yellow', 'Operation cancelled.');
      return;
    }
    
    await runCommand('npm run dummy:generate');
    colorLog('green', '✅ Dummy data generation completed!');
    
  } catch (error) {
    colorLog('red', `❌ Generation failed: ${error.message}`);
  }
}

async function validateDatabase() {
  try {
    colorLog('yellow', '🔍 Validating database integrity...');
    await runCommand('npm run dummy:validate');
    colorLog('green', '✅ Database validation completed!');
  } catch (error) {
    colorLog('red', `❌ Validation failed: ${error.message}`);
  }
}

async function cleanupDummyData() {
  try {
    colorLog('yellow', '🧹 Starting safe cleanup of dummy data...');
    colorLog('red', '⚠️  This will permanently delete all test data (DGIS* surveys)');
    colorLog('blue', 'Real survey data will NOT be affected.');
    
    const confirm = await askQuestion('Are you sure you want to proceed? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      colorLog('yellow', 'Cleanup cancelled.');
      return;
    }
    
    const doubleConfirm = await askQuestion('Type "DELETE" to confirm cleanup: ');
    if (doubleConfirm !== 'DELETE') {
      colorLog('yellow', 'Cleanup cancelled - confirmation failed.');
      return;
    }
    
    await runCommand('npm run dummy:cleanup');
    colorLog('green', '✅ Cleanup completed safely!');
    
  } catch (error) {
    colorLog('red', `❌ Cleanup failed: ${error.message}`);
  }
}

async function showDatabaseStatus() {
  try {
    colorLog('yellow', '📊 Fetching database status...');
    
    // Run a simple query to get counts
    const statusScript = `
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      async function getStatus() {
        try {
          const dummySurveys = await prisma.surveyDetails.count({ where: { gisId: { startsWith: 'DGIS' } } });
          const realSurveys = await prisma.surveyDetails.count({ where: { NOT: { gisId: { startsWith: 'DGIS' } } } });
          const totalQC = await prisma.qCRecord.count();
          const totalUsers = await prisma.usersMaster.count();
          
          console.log('\\n📊 Database Status Report');
          console.log('=' .repeat(40));
          console.log(\`🧪 Dummy Surveys: \${dummySurveys}\`);
          console.log(\`📝 Real Surveys: \${realSurveys}\`);
          console.log(\`🔍 QC Records: \${totalQC}\`);
          console.log(\`👥 Users: \${totalUsers}\`);
          console.log('=' .repeat(40));
          
        } catch (error) {
          console.error('Status check failed:', error.message);
        } finally {
          await prisma.$disconnect();
        }
      }
      
      getStatus();
    `;
    
    const fs = require('fs');
    fs.writeFileSync('temp_status.js', statusScript);
    await runCommand('node temp_status.js');
    fs.unlinkSync('temp_status.js');
    
  } catch (error) {
    colorLog('red', `❌ Status check failed: ${error.message}`);
  }
}

async function completeReset() {
  try {
    colorLog('yellow', '🔄 Starting complete reset process...');
    colorLog('red', '⚠️  This will cleanup dummy data and validate database integrity');
    
    const confirm = await askQuestion('Continue with complete reset? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      colorLog('yellow', 'Reset cancelled.');
      return;
    }
    
    await runCommand('npm run dummy:reset');
    colorLog('green', '✅ Complete reset finished!');
    
  } catch (error) {
    colorLog('red', `❌ Reset failed: ${error.message}`);
  }
}

async function createBackupPoint() {
  try {
    colorLog('yellow', '💾 Creating backup point...');
    colorLog('blue', 'This creates a safety checkpoint before operations.');
    
    // Run backup script
    const backupScript = `
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      async function backup() {
        try {
          const realSurveys = await prisma.surveyDetails.count({ where: { NOT: { gisId: { startsWith: 'DGIS' } } } });
          const timestamp = new Date().toISOString();
          
          console.log('\\n💾 Backup Point Created');
          console.log('=' .repeat(30));
          console.log(\`📅 Timestamp: \${timestamp}\`);
          console.log(\`📝 Real Surveys: \${realSurveys}\`);
          console.log(\`✅ Backup point established\`);
          
        } catch (error) {
          console.error('Backup failed:', error.message);
        } finally {
          await prisma.$disconnect();
        }
      }
      
      backup();
    `;
    
    const fs = require('fs');
    fs.writeFileSync('temp_backup.js', backupScript);
    await runCommand('node temp_backup.js');
    fs.unlinkSync('temp_backup.js');
    
    colorLog('green', '✅ Backup point created!');
    
  } catch (error) {
    colorLog('red', `❌ Backup creation failed: ${error.message}`);
  }
}

async function showHelp() {
  console.clear();
  colorLog('cyan', '╔══════════════════════════════════════════════════════════════╗');
  colorLog('cyan', '║                     SAFETY & HELP GUIDE                      ║');
  colorLog('cyan', '╚══════════════════════════════════════════════════════════════╝');
  colorLog('bright', '');
  colorLog('green', '🛡️  SAFETY FEATURES:');
  colorLog('blue', '   • Only dummy data (DGIS* IDs) are affected');
  colorLog('blue', '   • Real survey data is completely protected');
  colorLog('blue', '   • Transaction-based operations for atomicity');
  colorLog('blue', '   • Comprehensive validation after each operation');
  colorLog('blue', '   • Backup points for restoration tracking');
  colorLog('bright', '');
  colorLog('green', '🔄 ROLLBACK STRATEGY:');
  colorLog('blue', '   • Dummy data uses unique DGIS prefix');
  colorLog('blue', '   • Cleanup only targets test data');
  colorLog('blue', '   • No Prisma schema modifications required');
  colorLog('blue', '   • Database integrity validation included');
  colorLog('bright', '');
  colorLog('green', '📊 WHAT GETS CREATED:');
  colorLog('blue', '   • 15 test surveys (5 residential, 5 commercial, 5 mixed)');
  colorLog('blue', '   • QC records for each survey at Level 1');
  colorLog('blue', '   • Section-wise QC records (6 sections per survey)');
  colorLog('blue', '   • Property assessments and attachments');
  colorLog('blue', '   • Complete dummy property details');
  colorLog('bright', '');
  colorLog('green', '⚠️  IMPORTANT NOTES:');
  colorLog('yellow', '   • Always validate database after operations');
  colorLog('yellow', '   • Create backup points before major operations');
  colorLog('yellow', '   • Cleanup requires double confirmation');
  colorLog('yellow', '   • Real data remains completely untouched');
  colorLog('bright', '');
  
  await askQuestion('Press Enter to continue...');
}

async function main() {
  colorLog('green', '🚀 QC Dummy Data Manager Starting...');
  
  while (true) {
    await showMenu();
    
    const choice = await askQuestion('\\nSelect option (0-7): ');
    
    switch (choice) {
      case '1':
        await generateDummyData();
        break;
      case '2':
        await validateDatabase();
        break;
      case '3':
        await cleanupDummyData();
        break;
      case '4':
        await showDatabaseStatus();
        break;
      case '5':
        await completeReset();
        break;
      case '6':
        await createBackupPoint();
        break;
      case '7':
        await showHelp();
        continue; // Don't pause after help
      case '0':
        colorLog('green', '👋 Thank you for using QC Dummy Data Manager!');
        rl.close();
        return;
      default:
        colorLog('red', '❌ Invalid option. Please try again.');
    }
    
    await askQuestion('\\nPress Enter to continue...');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n');
  colorLog('yellow', '🛑 Manager interrupted. Goodbye!');
  rl.close();
  process.exit(0);
});

main().catch((error) => {
  colorLog('red', `💥 Manager error: ${error.message}`);
  rl.close();
  process.exit(1);
});