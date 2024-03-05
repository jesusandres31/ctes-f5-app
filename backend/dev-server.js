const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const pocketBasePath = path.resolve(__dirname, 'pocketbase.exe');
const pbHooksPath = path.resolve(__dirname, 'pb_hooks');

let pocketBase;
let restartTimer = null;

// Function to start pocketbase.exe
function startPocketBase() {
  console.log('Starting pocketbase.exe...');
  pocketBase = spawn(pocketBasePath, ['serve'], { stdio: 'inherit' });

  pocketBase.on('error', (err) => {
    console.error('Error starting pocketbase.exe:', err);
  });

  pocketBase.on('close', (code) => {
    console.log(`pocketbase.exe closed with code ${code}`);
  });

  return pocketBase;
}

// Function to schedule restart of pocketbase.exe
function scheduleRestart() {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    restartPocketBase();
  }, 1000); // Wait for 1 second before restarting
}

// Function to restart pocketbase.exe
function restartPocketBase() {
  console.log('Restarting pocketbase.exe...');
  if (pocketBase) {
    pocketBase.kill();
  }
  startPocketBase();
}

// Function to watch for changes in pb_hooks directory
function watchPBHooks() {
  console.log('Watching for changes in pb_hooks directory...');
  fs.watch(pbHooksPath, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.js')) {
      console.log(
        `${filename} has been modified. Restarting pocketbase.exe...`
      );
      scheduleRestart(); // Schedule restart
    }
  });
}

// Start pocketbase.exe and watch for changes in pb_hooks
startPocketBase();
watchPBHooks();
