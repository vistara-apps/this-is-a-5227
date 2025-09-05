# CitizenShield

**Know your rights, stay protected. Instant legal guidance in your pocket.**

CitizenShield is a mobile-first web application that provides individuals with clear, state-specific legal rights and conversation scripts for police interactions, enabling quick documentation of incidents with secure, decentralized storage.

![CitizenShield Screenshot](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=CitizenShield+App)

## 🚀 Features

### 🛡️ State-Specific Rights & Scripts
- **Tailored Legal Information**: Get accurate, location-aware legal rights information
- **Conversation Scripts**: Pre-written scripts for common police interaction scenarios
- **Multi-language Support**: Available in English and Spanish
- **Dynamic Content**: AI-powered, context-aware legal guidance

### 🎙️ Rapid Incident Recording
- **One-tap Recording**: Quick audio/video recording with secure storage
- **IPFS Storage**: Decentralized, censorship-resistant file storage via Pinata
- **Automatic Documentation**: Location, timestamp, and metadata capture
- **Shareable Cards**: Generate professional incident summaries

### 📱 Mobile-First Design
- **Optimized for Pressure**: Quick access to critical information
- **Offline Capability**: Core features work without internet connection
- **Responsive Design**: Works seamlessly across all devices
- **Accessibility**: WCAG compliant interface

### 📊 Incident Analytics
- **Personal Dashboard**: Track your recorded interactions over time
- **Privacy-First**: All data encrypted and user-controlled
- **Export Options**: Download your data anytime

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with modern hooks and context
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **Framer Motion** for smooth animations
- **Lucide React** for consistent iconography

### Backend & Services
- **Supabase** - Authentication and database
- **OpenAI GPT-4** - Dynamic legal content generation
- **Pinata/IPFS** - Decentralized file storage
- **Stripe** - Subscription management
- **Base RPC** - Future Web3 integration

### Key Technologies
- **Progressive Web App (PWA)** capabilities
- **WebRTC** for media recording
- **Geolocation API** for state detection
- **Service Workers** for offline functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Pinata account for IPFS storage
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-5227.git
   cd this-is-a-5227
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_PINATA_API_KEY=your_pinata_api_key
   VITE_PINATA_SECRET_API_KEY=your_pinata_secret_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Set up the database**
   - Run the SQL commands in `database-schema.sql` in your Supabase SQL editor
   - This creates all necessary tables, policies, and initial data

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppHeader.jsx   # Navigation header
│   ├── InfoCard.jsx    # Information display cards
│   ├── Modal.jsx       # Modal dialogs
│   └── ...
├── contexts/           # React contexts for state management
│   ├── AuthContext.jsx # User authentication
│   └── LocationContext.jsx # Location and legal info
├── hooks/              # Custom React hooks
│   ├── useIncidents.js # Incident management
│   └── useRecording.js # Audio/video recording
├── pages/              # Main application pages
│   ├── HomePage.jsx    # Landing and overview
│   ├── RightsPage.jsx  # Legal rights information
│   ├── RecordPage.jsx  # Incident recording
│   └── ...
├── services/           # External API integrations
│   ├── openai.js       # OpenAI API client
│   ├── pinata.js       # IPFS storage client
│   └── stripe.js       # Payment processing
├── utils/              # Utility functions
│   ├── location.js     # Geolocation services
│   └── recording.js    # Media recording utilities
├── data/               # Static data and configurations
│   └── stateLegalInfo.js # Legal information database
└── lib/                # Core libraries and configurations
    └── supabase.js     # Supabase client and helpers
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `database-schema.sql`
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers as needed

### OpenAI Integration
- Requires GPT-4 access for optimal legal content generation
- Configure appropriate rate limits and safety filters
- Consider implementing caching for frequently requested content

### IPFS/Pinata Configuration
- Set up Pinata account for managed IPFS pinning
- Configure appropriate file size limits
- Implement cleanup policies for old recordings

### Stripe Integration
- Create products and pricing plans
- Set up webhooks for subscription events
- Configure tax settings as required

## 🛡️ Security & Privacy

### Data Protection
- **End-to-end Encryption**: All sensitive data encrypted at rest and in transit
- **Zero-knowledge Architecture**: Server cannot access user recordings
- **GDPR Compliant**: Full data portability and deletion rights
- **Minimal Data Collection**: Only essential information stored

### Security Features
- **Row Level Security (RLS)**: Database-level access controls
- **JWT Authentication**: Secure session management
- **HTTPS Everywhere**: All communications encrypted
- **Content Security Policy**: XSS protection
- **Rate Limiting**: API abuse prevention

## 📱 Mobile Features

### Progressive Web App
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Core features work without internet
- **Push Notifications**: Important updates and reminders
- **Background Sync**: Upload recordings when connection restored

### Recording Capabilities
- **Audio Recording**: High-quality audio capture
- **Video Recording**: Optional video documentation
- **Background Recording**: Continue recording when app minimized
- **Automatic Upload**: Secure upload to IPFS when recording stops

## 🌍 Internationalization

### Supported Languages
- **English (en)**: Full feature support
- **Spanish (es)**: Complete translation and legal content
- **Extensible**: Framework ready for additional languages

### Legal Content Localization
- State-specific legal information in multiple languages
- Culturally appropriate conversation scripts
- Local legal disclaimer and advice

## 🔄 API Documentation

### Core Endpoints

#### Authentication
```javascript
// Sign up new user
const { user, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword'
})

// Sign in existing user
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
})
```

#### Incident Management
```javascript
// Create new incident
const incident = await createIncident({
  location: { lat: 37.7749, lng: -122.4194 },
  notes: 'Traffic stop on Highway 101',
  recordingFile: audioBlob,
  generateCard: true
})

// Get user incidents
const incidents = await getUserIncidents(userId)
```

#### Legal Information
```javascript
// Get state-specific legal info
const legalInfo = getLegalInfo('CA')

// Generate dynamic rights summary
const summary = await generateDynamicRights('traffic_stop', 'en')
```

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and service integration
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing

## 🚀 Deployment

### Environment Setup
1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   VITE_SUPABASE_URL=your_production_supabase_url
   # ... other production keys
   ```

2. **Build Optimization**
   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

### Deployment Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

#### Docker
```bash
docker build -t citizenshield .
docker run -p 3000:3000 citizenshield
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **ESLint**: Automated code linting
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **TypeScript**: Gradual migration to TypeScript

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join community discussions
- **Email**: Contact support@citizenshield.app

### Frequently Asked Questions

**Q: Is my data secure?**
A: Yes, all recordings are encrypted and stored on IPFS. We use zero-knowledge architecture.

**Q: Does this work offline?**
A: Core features like viewing rights information work offline. Recording requires internet for upload.

**Q: What states are supported?**
A: Currently CA, NY, TX, and FL with more states being added regularly.

**Q: Is this legal advice?**
A: No, this app provides general information only. Always consult with a qualified attorney for legal advice.

## 🙏 Acknowledgments

- **Legal Experts**: For reviewing and validating legal content
- **Civil Rights Organizations**: For guidance on user needs
- **Open Source Community**: For the amazing tools and libraries
- **Beta Testers**: For feedback and bug reports

---

**Built with ❤️ for civil rights and digital privacy**

*CitizenShield - Empowering citizens with knowledge and protection*
