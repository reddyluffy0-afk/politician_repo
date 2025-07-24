from typing import Dict, List, Optional
from tavily import TavilyClient
from .base_agent import BaseAgent
from ..database import articles_collection
from ..models import Article
import os
import logging
import asyncio

class ScrapingAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

    async def validate_input(self, input_data: Dict) -> bool:
        """Validate the input data contains required fields."""
        required_fields = ['query']
        return all(field in input_data for field in required_fields)

    async def process(self, input_data: Dict) -> Dict:
        """Search and scrape content using Tavily API."""
        try:
            # Use Tavily API to search and get content
            search_result = await asyncio.to_thread(
                self.client.search,
                query=input_data['query'],
                search_depth="advanced",
                include_content=True
            )
            
            if not search_result['results']:
                raise ValueError("No results found")
            
            # Get the most relevant result
            article_data = search_result['results'][0]
            
            # Create article object
            article = Article(
                url=article_data['url'],
                title=article_data['title'],
                content=article_data['content'],
                source=article_data['domain']
            )
                db.add(article)
                db.commit()
                db.refresh(article)
                
                return {
                    'success': True,
                    'article_id': article.id,
                    'title': title,
                    'content_length': len(content)
                }
            finally:
                db.close()
                
        except Exception as e:
            logging.error(f"Error scraping {input_data['url']}: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
