Rutee — Self-Discovery Platform

Rutee is a self-discovery platform that helps users explore themselves, share articles, chat with others, and take personality tests. It also supports real-time notifications.

📂 File Structure
src/
├─ Components/  
│ ├─ ArticleComponents/  
│ ├─ ButtonComponents/  
│ ├─ ChatComponents/  
│ ├─ ProfileComponents/  
│ ├─ QuizComponents/  
│ ├─ FeatureButton.jsx
│ ├─ Footer.jsx
│ ├─ GoogleLoginButton.jsx
│ ├─ Navbar.jsx
│ ├─ NavigationButton.jsx
│ └─ PersonalityCarousel.jsx
├─ Config/  
│ └─ Api.js
├─ Context/  
│ ├─ AuthContext.jsx
│ └─ NotificationContext.jsx
├─ InfoWeb/  
├─ Pages/  
├─ Router/  
├─ Theme/  
├─ App.jsx  
├─ .env  
└─ main.jsx

Notes:
1. Components → All UI components, organized by feature.
2. Config → API endpoint configuration (not included for public).
3. Context → Context API for authentication and notifications.
4. InfoWeb → Website info pages (About, Privacy, Terms).
5. Pages → Main pages of the platform.
6. Router → React routing.
8. Theme → MUI theme and styling.

⚙️ Installation & Setup

1. Clone the repository:
   git clone https://github.com/gabfalse/rutee.id.git
   cd rutee

2. Install dependencies:
   pnpm install

3. Create .env file (for base URL & JWT, etc.):
   VITE_GOOGLE_CLIENT_ID=Your_Google_CLient_Id
   VITE_API_URL=Your_Vite_URL

4. Run development server:
   npm run dev
   Open in browser: http://localhost:5173

📌 Usage Notes

1. All API requests require Authorization Bearer token (not shared publicly).
2. Components folder is structured by functionality (Article, Chat, Profile, Quiz, etc.).
3. Context handles authentication (AuthContext) and Notification Context (NotificationContext) to handles real-time notifications.
   MUI theme is in Theme/theme.js.
   All main pages are in the Pages folder.

🔧 Tools & Libraries
1. Frontend Framework & UI
2. React 19
3. Material-UI (MUI) — @mui/material, @mui/icons-material, @mui/x-date-pickers
4. Emotion — @emotion/react, @emotion/styled
5. Framer Motion — animations
6. React Slick + Slick Carousel — carousels/sliders
7. Editors & Text Tools
8. Data Handling & Utilities
9. Axios — HTTP requests
10. JWT Decode — jwt-decode
11. Browser Image Compression — browser-image-compression
12. Date & Time — date-fns, dayjs
13. PDF & Screenshot — jspdf, html2canvas
14. Routing & Navigation
15. React Router DOM v7
16. Development & Linting Tools
17. Vite — dev server and build
18. ESLint — with eslint-plugin-react-hooks, eslint-plugin-react-refresh

📌 Closing
Thank you for visiting the Rutee frontend repository. This project is actively maintained and open for collaboration.
If you encounter any issues, have suggestions, or want to contribute, feel free to open an issue or a pull request.
Happy coding!
