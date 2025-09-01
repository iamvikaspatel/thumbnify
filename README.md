# Thumbnify 🎨

An AI-powered YouTube thumbnail generator that helps content creators design stunning, click-worthy thumbnails in seconds. Built with Next.js 15, React 19, and powered by Google's Gemini 2.5 Flash Image Preview model.

## ✨ Features

- **🤖 AI-Powered Generation**: Uses Google's Gemini 2.5 Flash Image Preview model for high-quality thumbnail generation
- **🔐 User Authentication**: Secure authentication system powered by Clerk
- **📸 Image Upload & Processing**: ImageKit integration for image optimization and CDN delivery
- **🎨 Customizable Options**: Multiple video types, styles, moods, and orientations
- **📱 Responsive Design**: Modern, mobile-first UI built with Tailwind CSS
- **💬 Interactive Chat Interface**: Real-time AI chat for thumbnail generation
- **📋 Multi-step Form**: Guided form workflow for detailed customization
- **⚡ Real-time Processing**: Live progress tracking and instant results

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PNPM (recommended) or npm
- MongoDB database
- Clerk account for authentication
- ImageKit account for image processing
- Google AI API key for Gemini model

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/thumbnify.git
cd thumbnify
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React** - Beautiful icon library

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **Clerk** - Authentication and user management

### AI & Machine Learning
- **Google Gemini 2.5 Flash** - Advanced multimodal AI for image generation
- **Vercel AI SDK** - Unified interface for AI model integration
- **AI SDK React** - React hooks for AI-powered interfaces

### Image Processing
- **ImageKit** - Image optimization, transformation, and CDN
- **Next.js Image** - Optimized image component

## 📁 Project Structure

```
thumbnify/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── generate/          # Thumbnail generation page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── generate/         # Generation-specific components
├── lib/                  # Utility functions and configurations
└── public/              # Static assets
```

## 🎯 Usage

1. **Sign Up/Sign In**: Create an account or sign in using Clerk authentication
2. **Upload Image**: Upload a photo you want to include in your thumbnail
3. **Add Description**: Provide text describing your video content
4. **Choose Mode**:
   - **Form Mode**: Use the guided multi-step form for detailed customization
   - **Chat Mode**: Interact with AI through natural conversation
5. **Customize**: Select video type, style, mood, photo placement, and orientation
6. **Generate**: Let AI create your professional thumbnail
7. **Download**: Save your generated thumbnail in high quality

## 🔧 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code quality

## 🌐 Deployment

The easiest way to deploy Thumbnify is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

For other deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework for production
- [Google AI](https://ai.google.dev) - Gemini AI model for image generation
- [Clerk](https://clerk.com) - Authentication and user management
- [ImageKit](https://imagekit.io) - Image optimization and CDN
- [Vercel](https://vercel.com) - Deployment platform
