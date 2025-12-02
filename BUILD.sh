#!/bin/bash
# Build Script for Buzzy App
# Creates downloadable builds for Android and iOS

echo "🚀 Buzzy - Build Script"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will help you create builds of your Buzzy app.${NC}"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null
then
    echo -e "${RED}EAS CLI not found!${NC}"
    echo "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check if logged in
echo -e "${YELLOW}Checking EAS authentication...${NC}"
if ! eas whoami &> /dev/null
then
    echo "You need to login to EAS first."
    eas login
fi

echo ""
echo "Choose build type:"
echo "1) Android Preview Build (APK - easiest for testing)"
echo "2) Android Development Build (for iterative testing)"
echo "3) Android Production Build"
echo "4) iOS Preview Build (requires Apple Developer account)"
echo "5) iOS Development Build (requires Apple Developer account)"
echo "6) iOS Production Build (requires Apple Developer account)"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo -e "${GREEN}Building Android Preview (APK)...${NC}"
        echo "This will take 10-15 minutes."
        echo ""
        eas build --platform android --profile preview
        ;;
    2)
        echo -e "${GREEN}Building Android Development Build...${NC}"
        echo "This will take 10-15 minutes."
        echo ""
        eas build --platform android --profile development
        ;;
    3)
        echo -e "${GREEN}Building Android Production...${NC}"
        echo "This will take 10-15 minutes."
        echo ""
        eas build --platform android --profile production
        ;;
    4)
        echo -e "${GREEN}Building iOS Preview...${NC}"
        echo "This will take 15-20 minutes."
        echo "Note: You need an Apple Developer account ($99/year)"
        echo ""
        eas build --platform ios --profile preview
        ;;
    5)
        echo -e "${GREEN}Building iOS Development Build...${NC}"
        echo "This will take 15-20 minutes."
        echo "Note: You need an Apple Developer account ($99/year)"
        echo ""
        eas build --platform ios --profile development
        ;;
    6)
        echo -e "${GREEN}Building iOS Production...${NC}"
        echo "This will take 15-20 minutes."
        echo "Note: You need an Apple Developer account ($99/year)"
        echo ""
        eas build --platform ios --profile production
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✓ Build command submitted!${NC}"
echo ""
echo "Next steps:"
echo "1. Monitor build progress at: https://expo.dev/accounts/$(eas whoami)/projects/buzzy/builds"
echo "2. Download the build when complete"
echo "3. Install on your device:"
echo "   - Android APK: Transfer to phone and install"
echo "   - iOS: Install via TestFlight or direct install"
echo ""
echo "For Android APK installation:"
echo "- Enable 'Install from unknown sources' in Settings"
echo "- Open the APK file on your device"
echo "- Follow installation prompts"
echo ""
echo "Happy testing! 🎉"

