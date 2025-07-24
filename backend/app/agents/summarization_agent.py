from typing import Dict
import google.generativeai as genai
from .base_agent import BaseAgent
from ..database import summaries_collection
from ..models import Summary
import os
import logging
import json
import asyncio

class SummarizationAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        # Initialize Gemini API with simple API key
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')

    async def validate_input(self, input_data: Dict) -> bool:
        """Validate summarization input data."""
        required_fields = ['text', 'article_id']
        return all(field in input_data for field in required_fields)

    async def process(self, input_data: Dict) -> Dict:
        """Generate summary and insights using Gemini API."""
        try:
            # Create the prompt for summarization
            summary_prompt = f"""
            Please provide a concise summary of the following text in 5 bullet points,
            followed by 3 key insights. Format the response in JSON with 'summary' and 'insights' keys:

            {input_data['text']}
            """
            
            # Get prediction from Gemini
            response = await asyncio.to_thread(
                self.model.generate_content, 
                summary_prompt
            )
            
            # Parse the JSON response
            try:
                result = json.loads(response.text)
                summary_text = "\n".join(result['summary'])
                insights = result['insights']
            except json.JSONDecodeError:
                # Fallback if response is not proper JSON
                summary_text = response.text
                insights = []
            
            # Store summary in database
            db = SessionLocal()
            try:
                summary = Summary(
                    article_id=input_data['article_id'],
                    summary_text=summary_text,
                    insights=insights
                )
                db.add(summary)
                db.commit()
                db.refresh(summary)
                
                return {
                    'success': True,
                    'summary_id': summary.id,
                    'summary': summary_text,
                    'insights': insights
                }
            finally:
                db.close()
                
        except Exception as e:
            logging.error(f"Summarization error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
