from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json
from supabase import create_client, Client
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')
supabase_jwt_secret = os.environ.get('SUPABASE_JWT_SECRET')
supabase: Client = create_client(supabase_url, supabase_key)

# AI Integration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== AUTH ====================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, supabase_jwt_secret, algorithms=["HS256"], audience="authenticated")
        user_id = payload.get("sub")
        email = payload.get("email")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "email": email}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.exceptions.PyJWTError as e:
        logger.error(f"JWT error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== MODELS ====================

class CampaignGenerate(BaseModel):
    product_description: str
    category: str
    subcategory: str
    campaign_type: str
    tone: str = "professional"
    reference_image_url: Optional[str] = None

class PosterDesign(BaseModel):
    title: str
    subtitle: str
    main_text: str
    cta_text: str
    color_scheme: str
    layout_suggestion: str

class CampaignOutput(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    campaign_type: str
    category: str
    subcategory: str
    product_description: str
    tone: str
    content: Dict[str, Any]
    poster_design: Optional[Dict[str, Any]] = None
    reference_image_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class DashboardStats(BaseModel):
    total_campaigns: int
    total_assets: int
    active_campaigns: int
    downloads: int
    content_usage: List[Dict[str, Any]]
    growth_data: List[Dict[str, Any]]

# ==================== HELPERS ====================

async def generate_content_with_ai(prompt: str) -> str:
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message="You are an expert marketing content creator. Generate highly relevant, engaging, and conversion-focused marketing content that directly relates to the product/service described. Be creative and specific."
        ).with_model("gemini", "gemini-3-flash-preview")
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        return response
    except Exception as e:
        logger.error(f"AI error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI generation failed")

async def generate_poster_design(product_desc: str, category: str, tone: str) -> PosterDesign:
    prompt = f"""
Product: {product_desc}
Category: {category}
Tone: {tone}

Create a compelling poster design that directly showcases this specific product. Generate in JSON:
{{
  "title": "Catchy headline directly about THIS product (max 6 words)",
  "subtitle": "Specific benefit of THIS product (max 10 words)",
  "main_text": "Key feature or unique selling point of THIS product (15-20 words)",
  "cta_text": "Action-oriented CTA (2-4 words like 'Get Yours Now', 'Order Today')",
  "color_scheme": "Suggest colors matching the product category",
  "layout_suggestion": "Describe visual layout for THIS specific product"
}}
"""
    try:
        response = await generate_content_with_ai(prompt)
        response_clean = response.strip().replace("```json", "").replace("```", "").strip()
        poster_data = json.loads(response_clean)
        return PosterDesign(**poster_data)
    except Exception as e:
        logger.error(f"Poster error: {str(e)}")
        return PosterDesign(
            title=f"{category} Special",
            subtitle="Limited Time Offer",
            main_text=f"Experience premium {category} products",
            cta_text="Shop Now",
            color_scheme="Modern and vibrant",
            layout_suggestion="Center-aligned with product focus"
        )

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "CampaignAI API v2.0"}

@api_router.post("/storage/upload")
async def upload_reference_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["user_id"]
        contents = await file.read()
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"{user_id}/{filename}"
        
        response = supabase.storage.from_("reference-images").upload(
            file_path, contents,
            file_options={"content-type": file.content_type or "image/jpeg", "cache-control": "3600"}
        )
        
        public_url = supabase.storage.from_("reference-images").get_public_url(file_path)
        return {"success": True, "filename": filename, "path": file_path, "url": public_url, "size": len(contents)}
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@api_router.post("/campaigns/generate", response_model=CampaignOutput)
async def generate_campaign(campaign: CampaignGenerate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    base_prompt = f"""
IMPORTANT: Generate content SPECIFICALLY for this product/service:

Product Description: {campaign.product_description}
Category: {campaign.category}
Subcategory: {campaign.subcategory}
Tone: {campaign.tone}

Make sure all content is directly relevant and mentions specific details about THIS product.
"""
    
    content = {}
    poster_design = None
    
    if campaign.reference_image_url:
        poster_design = await generate_poster_design(campaign.product_description, campaign.category, campaign.tone)
    
    if campaign.campaign_type == "social_media":
        prompt = base_prompt + """
Generate social media content that promotes THIS SPECIFIC product. Return JSON:
{
  "instagram_caption": "Engaging caption about THIS product with relevant emojis (max 150 chars)",
  "instagram_hashtags": ["10-15 hashtags relevant to THIS specific product"],
  "facebook_post": "Compelling post about THIS product's benefits (max 200 chars)",
  "facebook_hashtags": ["5-7 hashtags for THIS product"],
  "poster_title": "Eye-catching title for THIS product",
  "poster_description": "2-3 lines describing THIS product visually"
}
"""
        response = await generate_content_with_ai(prompt)
        try:
            content = json.loads(response.strip().replace("```json", "").replace("```", "").strip())
        except:
            content = {"raw_response": response}
    
    elif campaign.campaign_type == "email":
        prompt = base_prompt + """
Generate email campaign for THIS SPECIFIC product. Return JSON:
{
  "subject_line": "Compelling subject about THIS product (50-60 chars)",
  "preview_text": "Preview mentioning THIS product's key benefit",
  "email_body": "Engaging email body about THIS product (200-300 words)",
  "cta_text": "Action button text for THIS product",
  "ps_line": "PS line with urgency for THIS product"
}
"""
        response = await generate_content_with_ai(prompt)
        try:
            content = json.loads(response.strip().replace("```json", "").replace("```", "").strip())
        except:
            content = {"raw_response": response}
    
    elif campaign.campaign_type == "meta_ads":
        prompt = base_prompt + """
Generate Meta ad for THIS SPECIFIC product. Return JSON:
{
  "primary_text": "Ad copy about THIS product (125 chars)",
  "headline": "Attention-grabbing headline for THIS product (40 chars)",
  "description": "THIS product's key benefit (30 chars)",
  "cta": "Call-to-action for THIS product",
  "target_audience": "Specific audience interested in THIS product",
  "visual_text": "Text overlay mentioning THIS product"
}
"""
        response = await generate_content_with_ai(prompt)
        try:
            content = json.loads(response.strip().replace("```json", "").replace("```", "").strip())
        except:
            content = {"raw_response": response}
    
    campaign_data = {
        "user_id": user_id,
        "campaign_type": campaign.campaign_type,
        "category": campaign.category,
        "subcategory": campaign.subcategory,
        "product_description": campaign.product_description,
        "tone": campaign.tone,
        "content": content,
        "poster_design": poster_design.model_dump() if poster_design else None,
        "reference_image_url": campaign.reference_image_url
    }
    
    result = supabase.table("campaigns").insert(campaign_data).execute()
    return CampaignOutput(**result.data[0])

@api_router.get("/campaigns", response_model=List[CampaignOutput])
async def get_campaigns(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    result = supabase.table("campaigns").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data

@api_router.get("/campaigns/{campaign_id}", response_model=CampaignOutput)
async def get_campaign(campaign_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    result = supabase.table("campaigns").select("*").eq("id", campaign_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return result.data[0]

@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    result = supabase.table("campaigns").delete().eq("id", campaign_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign deleted"}

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    result = supabase.table("campaigns").select("*").eq("user_id", user_id).execute()
    campaigns = result.data
    
    total = len(campaigns)
    content_usage = [
        {"type": "Social Media", "count": len([c for c in campaigns if c.get('campaign_type') == 'social_media'])},
        {"type": "Email", "count": len([c for c in campaigns if c.get('campaign_type') == 'email'])},
        {"type": "Meta Ads", "count": len([c for c in campaigns if c.get('campaign_type') == 'meta_ads'])}
    ]
    
    growth_data = [
        {"date": "Mon", "count": 5}, {"date": "Tue", "count": 8},
        {"date": "Wed", "count": 12}, {"date": "Thu", "count": 7},
        {"date": "Fri", "count": 15}, {"date": "Sat", "count": 20},
        {"date": "Sun", "count": 18}
    ]
    
    return DashboardStats(
        total_campaigns=total, total_assets=total, active_campaigns=total,
        downloads=total * 2, content_usage=content_usage, growth_data=growth_data
    )

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware, allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"], allow_headers=["*"]
)
