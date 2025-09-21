# 🎵 KabuTune

A modern, responsive music streaming application built with Next.js that allows you to discover and stream music from YouTube with a beautiful, professional interface.

![KabuTune](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🎵 **Music Streaming**: Stream music directly from YouTube
- 🔍 **Smart Search**: Search for songs, artists, and albums
- ❤️ **Favorites**: Save your favorite tracks
- 📱 **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- 🌙 **Dark/Light Mode**: Automatic system preference detection
- 🎶 **Auto Queue**: Intelligent queue generation for continuous playback
- 🎛️ **Music Controls**: Play, pause, skip, shuffle, repeat
- 📊 **Queue Management**: View and manage your music queue
- 🎨 **Modern UI**: Beautiful glassmorphism design with blue gradients

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- YouTube Data API v3 key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kabutor69/kabutune.git
   cd kabutune
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   YT_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   **Example:**
   ```env
   YT_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Get YouTube API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable YouTube Data API v3
   - Create credentials (API Key)
   - Copy the API key to your `.env.local` file
   
   **Note:** Replace `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual API key

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Audio Streaming**: @distube/ytdl-core
- **API**: YouTube Data API v3
- **Icons**: Lucide React
- **State Management**: React Context API

## 📱 Responsive Design

KabuTune is fully responsive and optimized for all devices:

- **Mobile**: Compact layout with touch-friendly controls
- **Tablet**: Balanced layout with medium-sized elements
- **Desktop**: Full-featured layout with all controls visible

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effects
- **Blue Gradient Theme**: Professional blue-to-indigo color scheme
- **Smooth Animations**: Fluid transitions and hover effects
- **System Theme**: Automatic dark/light mode based on system preference
- **Professional UI**: Clean, modern interface inspired by music streaming apps

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 📁 Project Structure

```
kabutune/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── explore/        # Explore page
│   │   ├── favorites/      # Favorites page
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── MusicPlayer.tsx # Music player component
│   │   ├── SearchBar.tsx   # Search input component
│   │   ├── TrackCard.tsx   # Track display component
│   │   └── QueueList.tsx   # Queue management component
│   ├── contexts/           # React Context providers
│   │   ├── MusicPlayerContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   └── ThemeContext.tsx
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## 🎵 How It Works

1. **Search**: Users can search for music using the search bar
2. **Stream**: Music is streamed directly from YouTube using ytdl-core
3. **Queue**: Intelligent queue system automatically generates related tracks
4. **Favorites**: Users can save tracks to their favorites collection
5. **Controls**: Full music player controls with play, pause, skip, shuffle, repeat

## 🔒 Privacy & Security

- No user data is stored on external servers
- Favorites are stored locally in browser
- YouTube API is used only for search and metadata
- Audio streaming is handled client-side

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- YouTube for providing the Data API
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

<div align="center">

**Made with ❤️ by [Kabutor](https://github.com/kabutor69)**

[⭐ Star this repo](https://github.com/kabutor69/kabutune) • [🐛 Report Bug](https://github.com/kabutor69/kabutune/issues) • [💡 Request Feature](https://github.com/kabutor69/kabutune/issues)

</div>