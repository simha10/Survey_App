// Simple JavaScript execution wrapper for the TypeScript dummy data script
const { exec } = require('child_process');

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  try {
    if (args.includes('--cleanup')) {
      console.log('🧹 Running cleanup...');
      await runCommand('npx ts-node prisma/seedDummyQCLevel1.ts --cleanup');
    } else if (args.includes('--validate')) {
      console.log('🔍 Running validation...');
      await runCommand('npx ts-node prisma/seedDummyQCLevel1.ts --validate');
    } else {
      console.log('🚀 Generating dummy data...');
      await runCommand('npx ts-node prisma/seedDummyQCLevel1.ts');
    }
    console.log('✅ Operation completed successfully!');
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  }
}

main();