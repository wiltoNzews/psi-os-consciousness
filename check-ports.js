import { exec } from 'child_process';

console.log('Checking running processes...');

// Run ps command to see all processes
exec('ps aux', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error running ps: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  
  console.log('Running processes:');
  console.log(stdout);
  
  // Try to find what's using port 5000
  exec('netstat -tnlp 2>/dev/null || ss -tnlp', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error checking ports: ${error.message}`);
      return;
    }
    
    console.log('\nPort information:');
    console.log(stdout);
    
    // Try to kill any process using port 5000
    exec('fuser -k 5000/tcp 2>/dev/null || pkill -f "node.*5000"', (error, stdout, stderr) => {
      if (error) {
        console.log(`Could not kill process on port 5000: ${error.message}`);
      } else {
        console.log('\nAttempted to kill processes on port 5000');
        console.log(stdout || 'No output from kill command');
      }
    });
  });
});