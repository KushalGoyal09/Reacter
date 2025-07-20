# **Reacter AI \- Intelligent React Code Generator**

Reacter AI is a sophisticated web-based development environment that helps you write better React code using AI assistance. It provides an interactive coding experience with real-time preview and AI-powered code generation.

## **Live Demo**

[Reacter](https://www.reacter.codes)

## **Features**

-   **AI-Powered Code Generation**: Get complete React components based on your prompts using Gemini 2.5 Flash.
-   **Real-Time Preview**: See your changes instantly with an integrated preview window.
-   **Interactive Development Environment**:
    -   Monaco Editor with TypeScript support
    -   Integrated terminal
    -   File explorer
    -   Live preview
-   **IP-Based Rate Limiting**: Fair usage policy enforced with rate limiting by IP address using Upstash Redis.
-   **Modern Tech Stack**: Built with React, TypeScript, and Tailwind CSS.
-   **WebContainer Integration**: Run Node.js directly in the browser.
-   **Beautiful UI**: Modern, responsive interface using shadcn/ui components.

## **Technology Stack**

-   **Frontend Framework**: Next.js
-   **Styling**:
    -   Tailwind CSS
    -   shadcn/ui components
    -   Lucide React icons
-   **Development Environment**:
    -   WebContainer API
    -   Monaco Editor
    -   xterm.js for terminal emulation
-   **AI Integration**: Google's Gemini 2.5 Flash API
-   **Rate Limiting**: Upstash Redis

## **Key Features in Detail**

### **AI Code Generation**

The AI assistant, powered by **Google's Gemini 2.5 Flash model**, helps you generate React components and features through natural language descriptions. It understands React best practices and modern web development patterns.

### **Development Environment**

-   Full-featured code editor with TypeScript support
-   Integrated terminal for running commands
-   File explorer for managing project files
-   Live preview window showing real-time changes

### **Rate Limiting**

To ensure service stability and prevent abuse, Reacter AI implements IP-based rate limiting using **Upstash Redis**. This allows for a fair usage policy, giving all users a chance to experience the AI code generation features.

### **Modern UI**

-   Responsive layout with resizable panels
-   Clean and professional design using shadcn/ui components
-   Smooth animations and transitions

# **Getting Started**

Follow these steps to set up and run the project:

## **1. Clone the repository**

```bash
git clone https://github.com/KushalGoyal09/Reacter.git
cd Reacter
```

## **2. Install dependencies**

```bash
npm install
```

## **3. Set up environment variables**

Create a `.env.local` file in the root directory and add the following (replace with your actual keys):

```bash
GEMINI_API_KEY=your_google_gemini_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

## **4. Start the development server**

```bash
npm run dev
```
