from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from .database import (
    articles_collection, translations_collection,
    summaries_collection, topic_alerts_collection
)
from . import models, schemas
from .celery_worker import scrape_websites, monitor_topics
from .agents.scraping_agent import ScrapingAgent
from .agents.translation_agent import TranslationAgent
from .agents.summarization_agent import SummarizationAgent
from .agents.topic_watch_agent import TopicWatchAgent

app = FastAPI(title="Deep Research Multi-Agent System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Deep Research Multi-Agent System API"}

@app.post("/articles/", response_model=models.Article)
async def create_article(article: models.Article):
    article_dict = article.dict(by_alias=True)
    result = await articles_collection.insert_one(article_dict)
    article_dict["_id"] = result.inserted_id
    return models.Article(**article_dict)

@app.get("/articles/", response_model=List[models.Article])
async def list_articles(skip: int = 0, limit: int = 10):
    articles = db.query(models.Article).offset(skip).limit(limit).all()
    return articles

@app.post("/scrape/")
async def scrape_url(url_data: dict):
    agent = ScrapingAgent()
    result = await agent.execute(url_data)
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return result

@app.post("/translate/{article_id}")
async def translate_article(
    article_id: int,
    target_language: str,
    db: Session = Depends(get_db)
):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    agent = TranslationAgent()
    result = await agent.execute({
        'text': article.content,
        'source_language': 'en',  # TODO: Detect language
        'target_language': target_language,
        'article_id': article_id
    })
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return result

@app.post("/summarize/{article_id}")
async def summarize_article(
    article_id: int,
    db: Session = Depends(get_db)
):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    agent = SummarizationAgent()
    result = await agent.execute({
        'text': article.content,
        'article_id': article_id
    })
    
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return result

@app.get("/topics/", response_model=List[schemas.TopicAlert])
async def list_topic_alerts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    alerts = db.query(models.TopicAlert).offset(skip).limit(limit).all()
    return alerts

@app.post("/monitor-topics/")
async def watch_topics(topics: List[str]):
    agent = TopicWatchAgent()
    result = await agent.execute({'topics': topics})
    if not result['success']:
        raise HTTPException(status_code=400, detail=result['error'])
    return result
