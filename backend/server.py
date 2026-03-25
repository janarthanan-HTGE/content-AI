from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage
import base64
import json
from supabase import create_client, Client
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Supabase connection
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')
supabase_jwt_secret = os.environ.get('SUPABASE_JWT_SECRET')
supabase: Client = create_client(supabase_url, supabase_key)

# AI Integration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== AUTH DEPENDENCY ====================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Validate Supabase JWT token and return user info"""
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {"user_id": user_id, "email": email}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.exceptions.PyJWTError as e:
        logger.error(f"JWT validation error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ==================== MODELS ====================

class CampaignGenerate(BaseModel):
    product_description: str
    category: str
    subcategory: str
    campaign_type: str  # "social_media", "email", "meta_ads"
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
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    campaign_type: str
    category: str
    subcategory: str
    product_description: str
    tone: str
    content: Dict[str, Any]
    poster_design: Optional[PosterDesign] = None
    reference_image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DashboardStats(BaseModel):
    total_campaigns: int
    total_assets: int
    active_campaigns: int
    downloads: int
    content_usage: List[Dict[str, Any]]
    growth_data: List[Dict[str, Any]]

# ==================== HELPER FUNCTIONS ====================

async def generate_content_with_ai(prompt: str) -> str:
    """Generate content using Gemini AI"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message="You are a professional marketing content creator. Generate engaging, creative, and conversion-focused marketing content."
        ).with_model("gemini", "gemini-3-flash-preview")
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        return response
    except Exception as e:
        logger.error(f"AI generation error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI content generation failed")

async def generate_poster_design(product_desc: str, category: str, tone: str) -> PosterDesign:
    """Generate poster design elements using AI"""
    prompt = f"""
Based on this product: {product_desc}
Category: {category}
Tone: {tone}

Generate a poster design with these elements in JSON format:
{{
  "title": "Main headline for the poster (max 6 words)",
  "subtitle": "Supporting tagline (max 10 words)",
  "main_text": "Key product benefit or feature (15-20 words)",
  "cta_text": "Call to action button text (2-4 words)",
  "color_scheme": "Suggested color palette (e.g., 'Bold red and black', 'Elegant gold and white')",
  "layout_suggestion": "Layout description (e.g., 'Center-aligned with large product image')"
}}
"""
    
    try:
        response = await generate_content_with_ai(prompt)
        response_clean = response.strip()
        if response_clean.startswith("```json"):
            response_clean = response_clean[7:]
        if response_clean.endswith("```"):
            response_clean = response_clean[:-3]
        
        poster_data = json.loads(response_clean.strip())
        return PosterDesign(**poster_data)
    except Exception as e:
        logger.error(f"Poster design generation error: {str(e)}")
        # Return default design
        return PosterDesign(
            title="Limited Time Offer",
            subtitle="Don't Miss Out",
            main_text=f"Experience the best {category} products",
            cta_text="Shop Now",
            color_scheme="Professional blue and white",
            layout_suggestion="Center-aligned with bold typography"
        )

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "CampaignAI API is running"}

# Storage Routes
@api_router.post("/storage/upload")
async def upload_reference_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload reference image to Supabase Storage"""
    try:
        user_id = current_user["user_id"]
        contents = await file.read()
        
        # Create unique filename
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = f"{user_id}/{filename}"
        
        # Upload to Supabase Storage
        response = supabase.storage.from_("reference-images").upload(
            file_path,
            contents,
            file_options={
                "content-type": file.content_type or "image/jpeg",
                "cache-control": "3600",
            }
        )
        
        # Get public URL
        public_url = supabase.storage.from_("reference-images").get_public_url(file_path)
        
        return {
            "success": True,
            "filename": filename,
            "path": file_path,
            "url": public_url,
            "size": len(contents)
        }
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# Campaign Generation Routes
@api_router.post("/campaigns/generate", response_model=CampaignOutput)
async def generate_campaign(
    campaign: CampaignGenerate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    
    # Build AI prompt based on campaign type
    base_prompt = f"""
Product: {campaign.product_description}
Category: {campaign.category}
Subcategory: {campaign.subcategory}
Tone: {campaign.tone}
"""
    
    if campaign.reference_image_url:
        base_prompt += f"\nReference Image Available: Yes (use for visual inspiration)\n"
    
    content = {}
    poster_design = None
    
    # Generate poster design if reference image provided
    if campaign.reference_image_url:
        poster_design = await generate_poster_design(
            campaign.product_description,
            campaign.category,
            campaign.tone
        )
    
    if campaign.campaign_type == "social_media":
        prompt = base_prompt + """
Generate social media content with the following in JSON format:
{
  "instagram_caption": "Engaging caption with emojis (max 150 characters)",
  "instagram_hashtags": ["hashtag1", "hashtag2", ...] (10-15 relevant hashtags),
  "facebook_post": "Slightly longer engaging post (max 200 characters)",
  "facebook_hashtags": ["hashtag1", "hashtag2", ...] (5-7 hashtags),
  "poster_title": "Short catchy title for poster",
  "poster_description": "2-3 lines for visual design"
}
"""
        
        response = await generate_content_with_ai(prompt)
        try:
            response_clean = response.strip()
            if response_clean.startswith("```json"):
                response_clean = response_clean[7:]
            if response_clean.endswith("```"):
                response_clean = response_clean[:-3]
            content = json.loads(response_clean.strip())
        except json.JSONDecodeError:
            content = {"raw_response": response}
    
    elif campaign.campaign_type == "email":
        prompt = base_prompt + """
Generate email campaign content in JSON format:
{
  "subject_line": "Compelling subject (50-60 characters)",
  "preview_text": "Preview text shown before opening",
  "email_body": "HTML-friendly email body (200-300 words, engaging)",
  "cta_text": "Call-to-action button text",
  "ps_line": "Optional PS line"
}
"""
        
        response = await generate_content_with_ai(prompt)
        try:
            response_clean = response.strip()
            if response_clean.startswith("```json"):
                response_clean = response_clean[7:]
            if response_clean.endswith("```"):
                response_clean = response_clean[:-3]
            content = json.loads(response_clean.strip())
        except json.JSONDecodeError:
            content = {"raw_response": response}
    
    elif campaign.campaign_type == "meta_ads":
        prompt = base_prompt + """
Generate Meta (Facebook/Instagram) ad content in JSON format:
{
  "primary_text": "Ad description (125 characters)",
  "headline": "Attention-grabbing headline (40 characters)",
  "description": "Additional context (30 characters)",
  "cta": "Call-to-action (e.g., 'Shop Now', 'Learn More')",
  "target_audience": "Demographics and interests suggestion",
  "visual_text": "Text overlay for image"
}
"""
        
        response = await generate_content_with_ai(prompt)
        try:
            response_clean = response.strip()
            if response_clean.startswith("```json"):
                response_clean = response_clean[7:]
            if response_clean.endswith("```"):
                response_clean = response_clean[:-3]
            content = json.loads(response_clean.strip())
        except json.JSONDecodeError:
            content = {"raw_response": response}
    
    # Save campaign
    campaign_output = CampaignOutput(
        user_id=user_id,
        campaign_type=campaign.campaign_type,
        category=campaign.category,
        subcategory=campaign.subcategory,
        product_description=campaign.product_description,
        tone=campaign.tone,
        content=content,
        poster_design=poster_design.model_dump() if poster_design else None,
        reference_image_url=campaign.reference_image_url
    )
    
    campaign_dict = campaign_output.model_dump()
    campaign_dict['created_at'] = campaign_dict['created_at'].isoformat()
    
    await db.campaigns.insert_one(campaign_dict)
    
    return campaign_output

# Campaign Library Routes
@api_router.get("/campaigns", response_model=List[CampaignOutput])
async def get_campaigns(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    campaigns = await db.campaigns.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for campaign in campaigns:
        if isinstance(campaign['created_at'], str):
            campaign['created_at'] = datetime.fromisoformat(campaign['created_at'])
    
    return campaigns

@api_router.get("/campaigns/{campaign_id}", response_model=CampaignOutput)
async def get_campaign(campaign_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    campaign = await db.campaigns.find_one({"id": campaign_id, "user_id": user_id}, {"_id": 0})
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if isinstance(campaign['created_at'], str):
        campaign['created_at'] = datetime.fromisoformat(campaign['created_at'])
    
    return CampaignOutput(**campaign)

@api_router.delete("/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    result = await db.campaigns.delete_one({"id": campaign_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign deleted successfully"}

# Dashboard Stats Route
@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    campaigns = await db.campaigns.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
    total_campaigns = len(campaigns)
    total_assets = total_campaigns
    active_campaigns = total_campaigns
    downloads = total_campaigns * 2
    
    content_usage = [
        {"type": "Social Media", "count": len([c for c in campaigns if c.get('campaign_type') == 'social_media'])},
        {"type": "Email", "count": len([c for c in campaigns if c.get('campaign_type') == 'email'])},
        {"type": "Meta Ads", "count": len([c for c in campaigns if c.get('campaign_type') == 'meta_ads'])}
    ]
    
    growth_data = [
        {"date": "Mon", "count": 5},
        {"date": "Tue", "count": 8},
        {"date": "Wed", "count": 12},
        {"date": "Thu", "count": 7},
        {"date": "Fri", "count": 15},
        {"date": "Sat", "count": 20},
        {"date": "Sun", "count": 18}
    ]
    
    return DashboardStats(
        total_campaigns=total_campaigns,
        total_assets=total_assets,
        active_campaigns=active_campaigns,
        downloads=downloads,
        content_usage=content_usage,
        growth_data=growth_data
    )

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
