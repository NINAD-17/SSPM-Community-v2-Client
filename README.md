# SSPM Community v2 - Client

A modern React-based community platform for managing events, discussions, and user interactions. Built with React 18, Vite, and TailwindCSS.

## 🚀 Features

- **User Features**
  - User authentication and authorization
  - Profile management
  - Role-based access control (Admin, User)
  - Network connections (follwers, connections)
  - Creating posts

- **Content Management**
  - Rich text editor for posts
  - Media upload support
  - Infinite scroll feed
  - Real-time notifications (under development)

- **Direct Messaging** 
  - Message to connected users
  - Real time messaging (under development)

- **Opportunities**
  - List of all latest opportunities (jobs, internships, competition ... etc)
  - Users can add new opportunity information

- **Event Management** (under development)
  - Create and manage events
  - Event registration and ticketing
  - QR code-based ticket verification
  - Event statistics and analytics
  - Rich event details with media support

## 🛠️ Tech Stack

- **Frontend Framework**
  - React 18
  - Vite 6
  - React Router DOM 7
  - Redux Toolkit for state management

- **UI/UX**
  - TailwindCSS 4
  - Headless UI
  - Radix UI
  - React Icons
  - React Toastify for notifications

- **Development Tools**
  - ESLint
  - Prettier

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add necessary environment variables:
```env
VITE_API_URL=your_api_url
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/          # API service functions
├── assets/       # Static assets (images, fonts)
├── components/   # Reusable UI components
├── config/       # Configuration files
├── features/     # Feature-based modules
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── store/        # Redux store configuration
└── utils/        # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Issues
1. Auth
    - Add functionality for forgot password & reset password
    - Improve UI of authentication pages (color and component shape.... etc)
    - Improve protected routes and public routes ( It should not show the route content while fetching the token details - refresh user with token)

