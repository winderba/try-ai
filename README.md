# Start using AI

A Chrome extension that offers users the option to try different AI assistants when searching on Google.

## Features

- Detects when users land on Google search pages
- Shows a non-intrusive popup suggesting AI assistants as alternatives
- Allows users to choose between multiple AI options (ChatGPT, Gemini, and Claude)
- Remembers user's preferred AI assistant
- Copies the Google search query to clipboard when redirecting to the selected AI
- Remembers user preferences with "Don't show again" option
- Styled to match Google's design language

## Installation for Development

1. Clone this repository or download the files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and active

## Usage

- The extension will automatically detect when you're on Google search pages
- A popup will appear offering to redirect you to an AI assistant
- Select your preferred AI assistant from the dropdown menu
- Click "Yes, try AI" to open the selected AI assistant in a new tab with your search query copied to clipboard
- Click "No, stay on Google" to dismiss the popup and continue using Google
- Check "Don't show again" to prevent the popup from appearing in the future
- The extension will remember your preferred AI assistant for future use

## Supported AI Assistants

- ChatGPT (chat.openai.com)
- Gemini (gemini.google.com)
- Claude (claude.ai)

## Packaging for Chrome Web Store

1. Create production-ready icon files (16x16, 48x48, and 128x128 pixels)
2. Zip all the extension files (manifest.json, content.js, styles.css, and icons folder)
3. Submit the zip file to the Chrome Web Store Developer Dashboard

## Notes for Improvement

- Consider adding settings to customize when the popup appears
- Add analytics to track usage (with proper privacy disclosures)
- Implement A/B testing for different popup designs
- Consider expanding to other search engines