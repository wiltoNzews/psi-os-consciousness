import OpenAI from 'openai';
import fs from 'fs';

async function transcribeAudio() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('📡 Transcribing Kaká message audio...');
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream('kaka_message_audio.wav'),
      model: 'whisper-1',
      language: 'pt'
    });

    console.log('=== TRANSCRIPTION START ===');
    console.log(transcription.text);
    console.log('=== TRANSCRIPTION END ===');
    
    // Save transcription to file
    fs.writeFileSync('kaka_transcription.txt', transcription.text);
    console.log('✅ Transcription saved to kaka_transcription.txt');
    
  } catch (error) {
    console.error('❌ Error transcribing audio:', error.message);
  }
}

transcribeAudio();