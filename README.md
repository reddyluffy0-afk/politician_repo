# Deep Research Multi-Agent System

A full-stack application for automated news collection, analysis, and monitoring using AI agents. The system scrapes news from government websites, translates content, generates summaries, and provides insights using Google Gemini API.

## Features

- 🤖 Multi-agent system for parallel processing
- 📰 Automated news collection and scraping
- 🌐 Content translation
- 📝 AI-powered summarization
- 🎯 Topic monitoring
- 🗣️ Voice command interface
- 📱 Responsive web interface
- 📄 PDF export capabilities

## Tech Stack

### Backend
- FastAPI
- LangGraph (Agent Orchestration)
- Google Gemini API (using simple API key)
- Motor (Async MongoDB driver)
- MongoDB
- Celery
- Redis
- Tavily API (for web scraping)

### Frontend
- React
- TypeScript
- Material-UI
- Web Speech API
- HTML2PDF

## Prerequisites

- Docker and Docker Compose
- Node.js 16+ (for local development)
- Python 3.9+
- Gemini API key (for AI features)
- Tavily API key (for web scraping)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/politician_repo.git
   cd politician_repo
   ```

2. Create environment variables file:
   ```bash
   cp .env.example .env
   ```

3. Configure the following variables in `.env`:
   ```env
   # MongoDB
   MONGODB_URL=mongodb://mongodb:27017
   MONGODB_DB=politician_db

   # Redis
   REDIS_HOST=redis

   # AI Services
   GEMINI_API_KEY=your_gemini_api_key
   TAVILY_API_KEY=your_tavily_api_key

   # Backend
   BACKEND_CORS_ORIGINS=["http://localhost:5173"]
   ```

4. Start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Development Setup

### Backend

1. Set up Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

3. Run Celery worker:
   ```bash
   celery -A app.celery_worker.celery worker --loglevel=info
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Usage

1. Access the applications:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

2. Initial Setup:
   - Add websites to monitor in the dashboard
   - Configure topics to track
   - Set up preferred translation languages

3. Features:
   - Use voice commands by clicking the microphone icon
   - View articles in the Articles section
   - Monitor topics in the Topic Monitor section
   - Export content as PDF
   - Translate content to different languages
   - View AI-generated summaries and insights

## API Endpoints

### Articles
- `GET /articles/` - List all articles
- `POST /articles/` - Create new article
- `POST /scrape/` - Trigger web scraping

### Translation
- `POST /translate/{article_id}` - Translate article content

### Summarization
- `POST /summarize/{article_id}` - Generate article summary

### Topics
- `GET /topics/` - List monitored topics
- `POST /monitor-topics/` - Add new topics to monitor

## Docker Services

- `web`: FastAPI backend server
- `mongodb`: MongoDB database
- `celery_worker`: Background task processor
- `redis`: Message broker for Celery

## Architecture

The system follows a microservices architecture with:
- Multi-agent system for parallel processing
- MongoDB for efficient document storage
- Scheduled tasks for periodic updates
- RESTful API for frontend communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
