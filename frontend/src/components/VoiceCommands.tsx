import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceCommands = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error('Browser does not support speech recognition.');
      return;
    }

    SpeechRecognition.startListening({ continuous: true });

    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  // Process voice commands
  useEffect(() => {
    const processCommand = (command: string) => {
      const lowerCommand = command.toLowerCase();
      
      if (lowerCommand.includes('show latest') || lowerCommand.includes('get latest')) {
        // Handle command to show latest articles
        console.log('Showing latest articles');
        resetTranscript();
      } else if (lowerCommand.includes('translate')) {
        // Handle translation command
        console.log('Translating content');
        resetTranscript();
      } else if (lowerCommand.includes('summarize')) {
        // Handle summarization command
        console.log('Summarizing content');
        resetTranscript();
      }
    };

    if (transcript) {
      processCommand(transcript);
    }
  }, [transcript, resetTranscript]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 3,
        zIndex: 'tooltip',
      }}
    >
      <Typography variant="body2" color={listening ? 'primary' : 'text.secondary'}>
        {listening ? 'Listening...' : 'Voice commands paused'}
      </Typography>
      {transcript && (
        <Typography variant="caption" display="block">
          {transcript}
        </Typography>
      )}
    </Box>
  );
};

export default VoiceCommands;
