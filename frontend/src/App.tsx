import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ArticleList from './pages/ArticleList';
import TopicMonitor from './pages/TopicMonitor';
import VoiceCommands from './components/VoiceCommands';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [voiceCommandsActive, setVoiceCommandsActive] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navbar onVoiceCommandToggle={() => setVoiceCommandsActive(!voiceCommandsActive)} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            {voiceCommandsActive && <VoiceCommands />}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/articles" element={<ArticleList />} />
              <Route path="/topics" element={<TopicMonitor />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
