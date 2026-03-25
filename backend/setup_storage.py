from dotenv import load_dotenv
from pathlib import Path
import os
from supabase import create_client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')
supabase = create_client(supabase_url, supabase_key)

def setup_storage():
    """Create storage bucket for reference images"""
    try:
        # Create reference-images bucket
        response = supabase.storage.create_bucket(
            "reference-images",
            options={
                "public": True,  # Making it public for easy access
                "allowed_mime_types": ["image/jpeg", "image/png", "image/webp", "image/gif"],
                "file_size_limit": 5242880,  # 5MB
            }
        )
        print("✓ reference-images bucket created successfully")
    except Exception as e:
        if "already exists" in str(e).lower():
            print("✓ reference-images bucket already exists")
        else:
            print(f"✗ Error creating bucket: {e}")

if __name__ == "__main__":
    print("Setting up Supabase Storage...")
    setup_storage()
    print("\nSetup complete!")
    print("\nNext steps:")
    print("1. Go to Supabase Dashboard > Storage")
    print("2. Click on 'reference-images' bucket")
    print("3. Go to 'Policies' tab")
    print("4. Enable RLS if needed and add appropriate policies")
