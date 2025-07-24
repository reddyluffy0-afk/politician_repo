import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';

interface TopicAlert {
  id: number;
  topic: string;
  content: string;
  source: string;
  created_at: string;
}

const TopicMonitor = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [alerts, setAlerts] = useState<TopicAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/topics/');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAddTopic = async () => {
    if (!newTopic) return;

    try {
      await axios.post('http://localhost:8000/monitor-topics/', {
        topics: [newTopic]
      });
      setTopics([...topics, newTopic]);
      setNewTopic('');
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleRemoveTopic = async (topic: string) => {
    try {
      // TODO: Implement backend endpoint for removing topics
      await axios.delete(`http://localhost:8000/topics/${encodeURIComponent(topic)}`);
      setTopics(topics.filter(t => t !== topic));
    } catch (error) {
      console.error('Error removing topic:', error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAlerts();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Topic Monitor</Typography>
        <Button
          startIcon={<RefreshIcon />}
          variant="contained"
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Topic
              </Typography>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  size="small"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Enter topic keyword"
                />
                <Button
                  variant="contained"
                  onClick={handleAddTopic}
                  disabled={!newTopic}
                >
                  Add
                </Button>
              </Box>

              <List>
                {topics.map((topic) => (
                  <ListItem key={topic}>
                    <ListItemText primary={topic} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveTopic(topic)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Alerts
              </Typography>
              <List>
                {alerts.map((alert) => (
                  <ListItem key={alert.id}>
                    <ListItemText
                      primary={alert.topic}
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            Source: {alert.source}
                          </Typography>
                          <Typography variant="body2">
                            {alert.content}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(alert.created_at).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopicMonitor;
