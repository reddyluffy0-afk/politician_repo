import axios, { AxiosInstance } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Article endpoints
  async getArticles() {
    const response = await this.api.get('/articles/');
    return response.data;
  }

  async translateArticle(articleId: number, targetLanguage: string) {
    const response = await this.api.post(`/translate/${articleId}`, {
      target_language: targetLanguage,
    });
    return response.data;
  }

  async summarizeArticle(articleId: number) {
    const response = await this.api.post(`/summarize/${articleId}`);
    return response.data;
  }

  // Topic monitoring endpoints
  async getTopics() {
    const response = await this.api.get('/topics/');
    return response.data;
  }

  async monitorTopics(topics: string[]) {
    const response = await this.api.post('/monitor-topics/', { topics });
    return response.data;
  }

  // Statistics endpoints
  async getStats() {
    const response = await this.api.get('/api/stats');
    return response.data;
  }
}

export const apiService = new ApiService();
