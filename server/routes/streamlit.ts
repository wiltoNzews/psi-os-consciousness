import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = Router();

// Route to start Streamlit application
router.get('/start', async (req, res) => {
  try {
    // Path to the streamlit launcher script
    const streamlitPath = path.join(process.cwd(), 'streamlit_launcher.py');
    
    // Spawn Python process to run Streamlit
    const streamlitProcess = spawn('python', [streamlitPath]);
    
    // Handle stdout data
    streamlitProcess.stdout.on('data', (data) => {
      console.log(`Streamlit: ${data}`);
    });
    
    // Handle stderr data
    streamlitProcess.stderr.on('data', (data) => {
      console.error(`Streamlit Error: ${data}`);
    });
    
    // Handle process exit
    streamlitProcess.on('close', (code) => {
      console.log(`Streamlit process exited with code ${code}`);
    });
    
    // Return success response with information
    res.json({
      success: true,
      message: 'Streamlit application started',
      streamlitUrl: 'http://localhost:8501' // Default Streamlit port
    });
  } catch (error: any) {
    console.error('Error starting Streamlit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start Streamlit application',
      error: error.message
    });
  }
});

// Route to provide information about the Streamlit integration
router.get('/info', (req, res) => {
  res.json({
    name: 'WiltonOS Dashboard',
    description: 'Streamlit-based dashboard with AI capabilities',
    streamlitUrl: 'http://localhost:8501',
    features: [
      'Chat Agent with GPT-4o-mini',
      'Audio Transcription with Whisper',
      'Image Generation with DALL-E',
      'Document Viewer'
    ]
  });
});

export default router;