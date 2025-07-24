import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Translate as TranslateIcon,
  Description as DescriptionIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

interface Article {
  id: number;
  title: string;
  content: string;
  source: string;
  created_at: string;
}

const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/articles/');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleTranslate = async (articleId: number) => {
    try {
      const response = await axios.post(`http://localhost:8000/translate/${articleId}`, {
        target_language: 'hi'  // TODO: Make this configurable
      });
      console.log('Translation:', response.data);
    } catch (error) {
      console.error('Error translating article:', error);
    }
  };

  const handleExportPDF = async (article: Article) => {
    const content = document.createElement('div');
    content.innerHTML = `
      <h1>${article.title}</h1>
      <p><strong>Source:</strong> ${article.source}</p>
      <p><strong>Date:</strong> ${new Date(article.created_at).toLocaleDateString()}</p>
      <div>${article.content}</div>
    `;

    const options = {
      margin: 1,
      filename: `article_${article.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(options).from(content).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
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
      <Typography variant="h4" gutterBottom>
        Articles
      </Typography>

      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} key={article.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Source: {article.source}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Date: {new Date(article.created_at).toLocaleDateString()}
                </Typography>

                <Box mt={2} display="flex" gap={1}>
                  <IconButton
                    onClick={() => handleTranslate(article.id)}
                    color="primary"
                  >
                    <TranslateIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedArticle(article);
                      setOpenDialog(true);
                    }}
                    color="primary"
                  >
                    <DescriptionIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleExportPDF(article)}
                    color="primary"
                  >
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedArticle?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography>{selectedArticle?.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleList;
