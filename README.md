# Domain Checker

A simple React application that allows users to check WHOIS information for a domain using the APILayer WHOIS API.

## Features

- Enter a domain name and submit to retrieve detailed WHOIS information
- Clean UI built with React and Tailwind CSS
- API key stored securely in environment variables

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your API key:
   ```
   VITE_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Enter a domain name (like "example.com") in the input field
2. Click the "Check Domain" button
3. View the WHOIS information for the domain

## Technologies Used

- React
- Vite
- Tailwind CSS
- APILayer WHOIS API
