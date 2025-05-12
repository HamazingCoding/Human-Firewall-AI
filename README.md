# Human Firewall AI 🛡️

A multi-modal AI security application that detects social engineering threats across voice calls, video content, and phishing attempts.

## Overview

Human Firewall AI addresses the challenge of social engineering attacks by introducing a multi-modal artificial intelligence system designed to detect and mitigate threats in real time. The application provides three main detection capabilities:

1. **AI Voice Detection** - Analyze audio files to determine if they contain authentic or AI-generated voices
2. **Deepfake Video Detection** - Examine video content for signs of manipulation or synthetic generation
3. **Phishing Detection** - Identify potential phishing attempts in URLs, emails, and messages

## Features

- Real-time AI analysis of multiple threat vectors
- Detailed threat analysis with confidence scores
- Visual indicators for detection factors
- Support for multiple file formats
- Enterprise-ready architecture

## Prerequisites

Before running the application, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 20 or later)
- npm (comes with Node.js)
- An OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/))

## Installation and Setup

1. **Clone the Repository (if applicable) or extract the ZIP file**

2. **Navigate to the Project Directory**
   ```bash
   cd human-firewall-ai
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Create Environment Variables**
   
   Create a `.env` file in the root directory of the project and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Voice Detection
1. Navigate to the Voice Detection tab
2. Upload an audio file in MP3, WAV, or M4A format
3. Click "Analyze Voice" to process the file
4. View the results, including authenticity score and detection factors

### Deepfake Detection
1. Navigate to the Deepfake Detection tab
2. Upload a video file in MP4, MOV, or AVI format
3. Click "Analyze Video" to process the file
4. View the results, including visual analysis and detection factors

### Phishing Detection
1. Navigate to the Phishing Detection tab
2. Select the type of content you want to analyze (URL, Email, or Message)
3. Enter or paste the suspicious content
4. Click "Analyze Content" to process the text
5. View the results, including threat level and detected indicators

## API Rate Limits

This application uses the OpenAI API for content analysis. Please be aware of OpenAI's rate limits:
- Free tier accounts have limited usage per month
- If you encounter rate limit errors, wait before making additional requests or upgrade your OpenAI plan
- To ensure consistent service, consider an OpenAI paid plan for production use

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your OpenAI API key is correctly set in the `.env` file
   
2. **File Upload Issues**: Check that your file format is supported and under the size limit
   
3. **Analysis Failure**: If analysis fails, check the console for error messages and verify your API key has sufficient quota

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React, Express, and the OpenAI API
- Uses shadcn/ui components for the user interface
- Implements best practices for secure file handling and processing