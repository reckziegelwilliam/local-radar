#!/bin/bash
# Supabase Setup Commands for Buzzy
# Run these commands to set up your Supabase backend

echo "🚀 Buzzy - Supabase Setup Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Login to Supabase CLI${NC}"
echo "Run: supabase login"
echo ""
read -p "Press enter when you've logged in..."

echo ""
echo -e "${YELLOW}Step 2: Link to your Supabase project${NC}"
echo "Run: supabase link --project-ref YOUR_PROJECT_REF"
echo "Find your project ref in: Supabase Dashboard → Project Settings → General"
echo ""
read -p "Press enter when you've linked your project..."

echo ""
echo -e "${YELLOW}Step 3: Deploy Edge Functions${NC}"
echo "Deploying create-event function..."
supabase functions deploy create-event

echo "Deploying cleanup-expired-events function..."
supabase functions deploy cleanup-expired-events

echo "Deploying send-nearby-notification function..."
supabase functions deploy send-nearby-notification

echo ""
echo -e "${GREEN}✓ Edge functions deployed!${NC}"
echo ""

echo -e "${YELLOW}Step 4: Run SQL Migrations${NC}"
echo "Please go to your Supabase Dashboard → SQL Editor"
echo "and run these SQL files in order:"
echo ""
echo "1. supabase/schema.sql"
echo "2. supabase/rls.sql"
echo "3. supabase/functions.sql"
echo "4. supabase/spotting-functions.sql"
echo "5. supabase/notifications.sql"
echo "6. supabase/migrations/001_add_event_spotting.sql"
echo "7. supabase/migrations/002_add_beta_feedback.sql"
echo "8. supabase/storage-policies.sql"
echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify your .env file has EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"
echo "2. Run: npm install"
echo "3. Run: npm start"
echo "4. Build with: eas build --platform android --profile preview"

