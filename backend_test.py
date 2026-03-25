import requests
import sys
import json
from datetime import datetime

class CampaignAITester:
    def __init__(self, base_url="https://campaign-craft-14.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"test_user_{datetime.now().strftime('%H%M%S')}@example.com"
        self.test_user_name = "Test User"
        self.test_password = "TestPass123!"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_signup(self):
        """Test user signup"""
        success, response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            data={
                "name": self.test_user_name,
                "email": self.test_user_email,
                "password": self.test_password
            }
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_login(self):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": self.test_user_email,
                "password": self.test_password
            }
        )
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_get_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success and 'id' in response

    def test_dashboard_stats(self):
        """Test dashboard stats endpoint"""
        success, response = self.run_test(
            "Dashboard Stats",
            "GET",
            "dashboard/stats",
            200
        )
        return success and 'total_campaigns' in response

    def test_generate_social_media_campaign(self):
        """Test social media campaign generation"""
        success, response = self.run_test(
            "Generate Social Media Campaign",
            "POST",
            "campaigns/generate",
            200,
            data={
                "product_description": "Premium wireless headphones with noise cancellation",
                "category": "electronics",
                "subcategory": "Accessories",
                "campaign_type": "social_media",
                "tone": "professional"
            }
        )
        if success and 'content' in response:
            self.social_media_campaign_id = response.get('id')
            return True
        return False

    def test_generate_email_campaign(self):
        """Test email campaign generation"""
        success, response = self.run_test(
            "Generate Email Campaign",
            "POST",
            "campaigns/generate",
            200,
            data={
                "product_description": "Organic skincare products for sensitive skin",
                "category": "beauty",
                "subcategory": "Skincare",
                "campaign_type": "email",
                "tone": "casual"
            }
        )
        if success and 'content' in response:
            self.email_campaign_id = response.get('id')
            return True
        return False

    def test_generate_meta_ads_campaign(self):
        """Test Meta ads campaign generation"""
        success, response = self.run_test(
            "Generate Meta Ads Campaign",
            "POST",
            "campaigns/generate",
            200,
            data={
                "product_description": "Fitness coaching services for busy professionals",
                "category": "services",
                "subcategory": "Training",
                "campaign_type": "meta_ads",
                "tone": "sales_focused"
            }
        )
        if success and 'content' in response:
            self.meta_ads_campaign_id = response.get('id')
            return True
        return False

    def test_get_campaigns(self):
        """Test get all campaigns"""
        success, response = self.run_test(
            "Get All Campaigns",
            "GET",
            "campaigns",
            200
        )
        return success and isinstance(response, list)

    def test_get_single_campaign(self):
        """Test get single campaign"""
        if hasattr(self, 'social_media_campaign_id') and self.social_media_campaign_id:
            success, response = self.run_test(
                "Get Single Campaign",
                "GET",
                f"campaigns/{self.social_media_campaign_id}",
                200
            )
            return success and 'id' in response
        else:
            print("⚠️  Skipping single campaign test - no campaign ID available")
            return True

    def test_delete_campaign(self):
        """Test delete campaign"""
        if hasattr(self, 'email_campaign_id') and self.email_campaign_id:
            success, response = self.run_test(
                "Delete Campaign",
                "DELETE",
                f"campaigns/{self.email_campaign_id}",
                200
            )
            return success
        else:
            print("⚠️  Skipping delete campaign test - no campaign ID available")
            return True

def main():
    print("🚀 Starting CampaignAI Backend API Tests")
    print("=" * 50)
    
    tester = CampaignAITester()
    
    # Test sequence
    tests = [
        ("Root API", tester.test_root_endpoint),
        ("User Signup", tester.test_signup),
        ("User Login", tester.test_login),
        ("Get Current User", tester.test_get_me),
        ("Dashboard Stats", tester.test_dashboard_stats),
        ("Generate Social Media Campaign", tester.test_generate_social_media_campaign),
        ("Generate Email Campaign", tester.test_generate_email_campaign),
        ("Generate Meta Ads Campaign", tester.test_generate_meta_ads_campaign),
        ("Get All Campaigns", tester.test_get_campaigns),
        ("Get Single Campaign", tester.test_get_single_campaign),
        ("Delete Campaign", tester.test_delete_campaign),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print results
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS")
    print("=" * 50)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {len(failed_tests)}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if failed_tests:
        print(f"\n❌ Failed tests: {', '.join(failed_tests)}")
        return 1
    else:
        print("\n✅ All tests passed!")
        return 0

if __name__ == "__main__":
    sys.exit(main())