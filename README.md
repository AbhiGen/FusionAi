# 🚀 Multi-AI Chat Platform  
### Built with Next.js, Firebase, Clerk, KravixStudio API, ShadCN UI & Docker

A modern multi-model AI chat platform allowing users to interact with multiple AI models, manage preferences, save conversations, track daily usage, and upgrade to premium features — all inside a clean and beautiful user interface.

---

## 🌟 Inspiration — Why I Built This

I wanted to create a **single AI platform** where users can access multiple AI models in one place — instead of constantly switching between apps, tools, or APIs.

Problems I aimed to solve:

- Most platforms lock users into *one* AI model  
- Switching between different providers breaks workflow  
- New users struggle using different APIs  
- No unified interface to compare outputs  
- Token usage & limits are not managed well  
- Premium upgrades feel complicated in most tools  

So I built a platform that includes:

- Multiple AI models (Free + Premium)  
- Saved chat history  
- Model selection based on user preferences  
- Daily usage limits with automatic reset  
- Smooth subscription flow  
- Clean modern UI  
- Full Docker setup for easy deployment  

This became a full-stack project touching UI/UX, backend APIs, authentication, database, rate-limiting, subscriptions, and hosting.

---

## ✨ Features

### 🔐 **Authentication**
- Clerk Email + Password  
- Google OAuth  
- Store user profile & preferences in Firestore  

### 💬 **Chat System**
- Send messages to multiple AI models  
- Real-time message display  
- Save & fetch chat conversations  
- Context-aware responses  

### 🤖 **AI Models**
- Free & Premium model groups  
- User-configurable selections  
- Uses **KravixStudio Developer API**  

### 🪙 **Usage Limits**
- Daily usage limits via Arcjet  
- Token tracking  
- Free trial system with auto-renewal every 24h  

### 💳 **Subscription**
- Fully integrated Clerk (Stripe) billing  
- Premium upgrade options  
- Pricing table display  

### 🎨 **UI & UX**
- Sidebar with menu + footer  
- Dark / Light mode  
- ShadCN UI components  
- Clean responsive design  

### 🐳 **Docker Support**
- Production-ready Dockerfile  
- Docker Compose support  
- Easy containerized deployment  

### ☁️ **Deployment**
- Fully deployed on **Vercel**

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js 14  
- React  
- TypeScript  
- Tailwind CSS  
- ShadCN UI  

### **Backend**
- Firebase Firestore  
- Next.js API Routes  

### **Authentication & Billing**
- Clerk Authentication  
- Clerk Subscription Billing (Stripe)  

### **AI**
- KravixStudio Developer API  

### **Other Tools**
- Arcjet (Rate Limiting / Daily Limits)  
- Docker  
- Vercel  

---



Folder Structure


```
AiFusion
├─ fusionai
│  ├─ .dockerignore
│  ├─ .env
│  ├─ .next
│  │  ├─ app-build-manifest.json
│  │  ├─ build-manifest.json
│  │  ├─ cache
│  │  │  ├─ .previewinfo
│  │  │  ├─ .rscinfo
│  │  │  ├─ chrome-devtools-workspace-uuid
│  │  │  ├─ images
│  │  │  │  ├─ jdHi0mCl0eH3XsjCpi7tNtssaDviTg--tbrCuS0fB8I
│  │  │  │  │  └─ 60.1763396126897.UCw4sEKAmcfyAP4iZm1vO3-GLzSkXOtVjaptXpUHj7c.Vy8iMTFlNGQtMTlhOGJkMWVlOWMi.webp
│  │  │  │  ├─ jPfMf8QcxIwxjTXemdyfGE2vdokEaW8Vk8EF6zl3FqY
│  │  │  │  │  └─ 60.1763280327797.N44zs0fhZvbPF_pytbCl_93l2RvDPTIm1gXhHhyFfD4.Vy8iMzQ5NS0xOWExYjg5NjdkOCI.webp
│  │  │  │  ├─ j_WQTihrxINlSEdkz4qU1OGNOo6UFdZz8Q5wvDl3sMs
│  │  │  │  │  └─ 60.1763396127016.F6yPq5IJaJypnju6SJxt6ZLMXDg2RHgFfEavk-wFXQo.Vy8iMzhhMzAtMTlhOGJkMWVlYTIi.webp
│  │  │  │  ├─ NRiX1SBsJf3V61GPU1Cd0MUBJPVJrN5c09CttgHTpd4
│  │  │  │  │  └─ 60.1763280327715.AlKQhr3UsRN45suqvJjxUvsPhe9CH2SmfK1EMcIZu4M.Vy8iZGZjMC0xOWExYjg5NjdhYyI.webp
│  │  │  │  ├─ nw-82APkmWiqV1XHficYsmh2RGK0TpV7GeKZ9Y8qQI8
│  │  │  │  │  └─ 60.1763396126967.GwDqdq0RtrvORouZHskE2V7uuF-hon6bsrM5trNGQL0.Vy8iN2NkZS0xOWE4YmQxZWVhMyI.webp
│  │  │  │  ├─ sIk9YDS47QsCkaKUYLYa7S3aj1oClfUhvYGCey_2C_k
│  │  │  │  │  └─ 60.1763396126956.o1uCZcfnsiXVkC4cvzoIJPekCgWwpf3LeQvmSv33Ox4.Vy8iMTEwNjktMTlhOGJkMWVlOTki.webp
│  │  │  │  └─ VpBKFPNMhohU2vZZHsNPGZAgKLaXuH4UoJnOjbvxjEg
│  │  │  │     └─ 60.1763396126961.nvAlm5c2RaNsm0BWSAAPvaeyqa3df5h0raRX1Bmotkk.Vy8iMWQzNi0xOWE4YmQxZWVhNyI.webp
│  │  │  ├─ next-devtools-config.json
│  │  │  └─ webpack
│  │  │     ├─ client-development
│  │  │     │  ├─ 0.pack.gz
│  │  │     │  ├─ 1.pack.gz
│  │  │     │  ├─ 10.pack.gz
│  │  │     │  ├─ 11.pack.gz
│  │  │     │  ├─ 12.pack.gz
│  │  │     │  ├─ 13.pack.gz
│  │  │     │  ├─ 14.pack.gz
│  │  │     │  ├─ 15.pack.gz
│  │  │     │  ├─ 16.pack.gz
│  │  │     │  ├─ 17.pack.gz
│  │  │     │  ├─ 18.pack.gz
│  │  │     │  ├─ 19.pack.gz
│  │  │     │  ├─ 2.pack.gz
│  │  │     │  ├─ 20.pack.gz
│  │  │     │  ├─ 21.pack.gz
│  │  │     │  ├─ 22.pack.gz
│  │  │     │  ├─ 23.pack.gz
│  │  │     │  ├─ 24.pack.gz
│  │  │     │  ├─ 3.pack.gz
│  │  │     │  ├─ 4.pack.gz
│  │  │     │  ├─ 5.pack.gz
│  │  │     │  ├─ 6.pack.gz
│  │  │     │  ├─ 7.pack.gz
│  │  │     │  ├─ 8.pack.gz
│  │  │     │  ├─ 9.pack.gz
│  │  │     │  ├─ index.pack.gz
│  │  │     │  └─ index.pack.gz.old
│  │  │     ├─ client-development-fallback
│  │  │     │  ├─ 0.pack.gz
│  │  │     │  ├─ 1.pack.gz
│  │  │     │  ├─ index.pack.gz
│  │  │     │  └─ index.pack.gz.old
│  │  │     ├─ client-production
│  │  │     │  ├─ 0.pack
│  │  │     │  ├─ 1.pack
│  │  │     │  ├─ 2.pack
│  │  │     │  ├─ index.pack
│  │  │     │  └─ index.pack.old
│  │  │     ├─ edge-server-development
│  │  │     │  ├─ 0.pack.gz
│  │  │     │  ├─ 1.pack.gz
│  │  │     │  ├─ 2.pack.gz
│  │  │     │  ├─ index.pack.gz
│  │  │     │  └─ index.pack.gz.old
│  │  │     ├─ edge-server-production
│  │  │     │  ├─ 0.pack
│  │  │     │  └─ index.pack
│  │  │     ├─ server-development
│  │  │     │  ├─ 0.pack.gz
│  │  │     │  ├─ 1.pack.gz
│  │  │     │  ├─ 10.pack.gz
│  │  │     │  ├─ 11.pack.gz
│  │  │     │  ├─ 12.pack.gz
│  │  │     │  ├─ 13.pack.gz
│  │  │     │  ├─ 14.pack.gz
│  │  │     │  ├─ 15.pack.gz
│  │  │     │  ├─ 16.pack.gz
│  │  │     │  ├─ 17.pack.gz
│  │  │     │  ├─ 18.pack.gz
│  │  │     │  ├─ 19.pack.gz
│  │  │     │  ├─ 2.pack.gz
│  │  │     │  ├─ 20.pack.gz
│  │  │     │  ├─ 21.pack.gz
│  │  │     │  ├─ 22.pack.gz
│  │  │     │  ├─ 23.pack.gz
│  │  │     │  ├─ 24.pack.gz
│  │  │     │  ├─ 25.pack.gz
│  │  │     │  ├─ 26.pack.gz
│  │  │     │  ├─ 27.pack.gz
│  │  │     │  ├─ 28.pack.gz
│  │  │     │  ├─ 29.pack.gz
│  │  │     │  ├─ 3.pack.gz
│  │  │     │  ├─ 4.pack.gz
│  │  │     │  ├─ 5.pack.gz
│  │  │     │  ├─ 6.pack.gz
│  │  │     │  ├─ 7.pack.gz
│  │  │     │  ├─ 8.pack.gz
│  │  │     │  ├─ 9.pack.gz
│  │  │     │  ├─ index.pack.gz
│  │  │     │  └─ index.pack.gz.old
│  │  │     └─ server-production
│  │  │        ├─ 0.pack
│  │  │        ├─ 1.pack
│  │  │        ├─ 2.pack
│  │  │        ├─ 3.pack
│  │  │        ├─ 4.pack
│  │  │        ├─ 5.pack
│  │  │        ├─ index.pack
│  │  │        └─ index.pack.old
│  │  ├─ diagnostics
│  │  │  ├─ build-diagnostics.json
│  │  │  └─ framework.json
│  │  ├─ package.json
│  │  ├─ react-loadable-manifest.json
│  │  ├─ server
│  │  │  ├─ app
│  │  │  │  ├─ api
│  │  │  │  │  ├─ ai-multi-model
│  │  │  │  │  │  ├─ route.js
│  │  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  │  └─ arcjet-test
│  │  │  │  │     ├─ route.js
│  │  │  │  │     ├─ route.js.nft.json
│  │  │  │  │     └─ route_client-reference-manifest.js
│  │  │  │  ├─ favicon.ico
│  │  │  │  │  ├─ route.js
│  │  │  │  │  └─ route.js.nft.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.nft.json
│  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  └─ _not-found
│  │  │  │     ├─ page.js
│  │  │  │     ├─ page.js.nft.json
│  │  │  │     └─ page_client-reference-manifest.js
│  │  │  ├─ app-paths-manifest.json
│  │  │  ├─ chunks
│  │  │  │  ├─ 136.js
│  │  │  │  ├─ 519.js
│  │  │  │  ├─ 522.js
│  │  │  │  ├─ 581.js
│  │  │  │  ├─ 586.js
│  │  │  │  ├─ 611.js
│  │  │  │  ├─ 689.js
│  │  │  │  ├─ 692.js
│  │  │  │  ├─ 70.js
│  │  │  │  ├─ 90.js
│  │  │  │  └─ 960.js
│  │  │  ├─ edge-runtime-webpack.js
│  │  │  ├─ edge-runtime-webpack.js.map
│  │  │  ├─ interception-route-rewrite-manifest.js
│  │  │  ├─ middleware-build-manifest.js
│  │  │  ├─ middleware-manifest.json
│  │  │  ├─ middleware-react-loadable-manifest.js
│  │  │  ├─ middleware.js
│  │  │  ├─ middleware.js.map
│  │  │  ├─ next-font-manifest.js
│  │  │  ├─ next-font-manifest.json
│  │  │  ├─ pages
│  │  │  │  ├─ _app.js
│  │  │  │  ├─ _app.js.nft.json
│  │  │  │  ├─ _document.js
│  │  │  │  ├─ _document.js.nft.json
│  │  │  │  ├─ _error.js
│  │  │  │  └─ _error.js.nft.json
│  │  │  ├─ pages-manifest.json
│  │  │  ├─ server-reference-manifest.js
│  │  │  ├─ server-reference-manifest.json
│  │  │  └─ webpack-runtime.js
│  │  ├─ static
│  │  │  ├─ chunks
│  │  │  │  ├─ 124-e14cd079c3f32f52.js
│  │  │  │  ├─ 139.bd8858afdcc2809f.js
│  │  │  │  ├─ 255-40634877ae3e8e9d.js
│  │  │  │  ├─ 265-15b7c4f73ec632f6.js
│  │  │  │  ├─ 4bd1b696-c023c6e3521b1417.js
│  │  │  │  ├─ 646.f342b7cffc01feb0.js
│  │  │  │  ├─ 768.c08372796fd41f19.js
│  │  │  │  ├─ 769-83dfc98d19d14fd2.js
│  │  │  │  ├─ app
│  │  │  │  │  ├─ api
│  │  │  │  │  │  ├─ ai-multi-model
│  │  │  │  │  │  │  └─ route-4fec6f9c8c5cb2e4.js
│  │  │  │  │  │  └─ arcjet-test
│  │  │  │  │  │     └─ route-4fec6f9c8c5cb2e4.js
│  │  │  │  │  ├─ layout-392d43ae5f8427da.js
│  │  │  │  │  ├─ page-e1ee384543fb6c13.js
│  │  │  │  │  └─ _not-found
│  │  │  │  │     └─ page-2e5a3ec696c1b41f.js
│  │  │  │  ├─ bc9e92e6-93887eac1f5c8ce8.js
│  │  │  │  ├─ framework-acd67e14855de5a2.js
│  │  │  │  ├─ main-app-a7be60dc775dda72.js
│  │  │  │  ├─ main-ba26d03893112efa.js
│  │  │  │  ├─ pages
│  │  │  │  │  ├─ _app-b373a96de40adba0.js
│  │  │  │  │  └─ _error-013f4188946cdd04.js
│  │  │  │  ├─ polyfills-42372ed130431b0a.js
│  │  │  │  └─ webpack-1be7ccd8c166da88.js
│  │  │  ├─ css
│  │  │  │  └─ c9d0aff8f61ca1eb.css
│  │  │  ├─ F2gid6tyCsIX47HSxvXKm
│  │  │  │  ├─ _buildManifest.js
│  │  │  │  └─ _ssgManifest.js
│  │  │  └─ media
│  │  │     ├─ 4cf2300e9c8272f7-s.p.woff2
│  │  │     ├─ 747892c23ea88013-s.woff2
│  │  │     ├─ 8d697b304b401681-s.woff2
│  │  │     ├─ 93f479601ee12b01-s.p.woff2
│  │  │     ├─ 9610d9e46709d722-s.woff2
│  │  │     └─ ba015fad6dcf6784-s.woff2
│  │  └─ types
│  │     ├─ app
│  │     │  ├─ api
│  │     │  │  ├─ ai-multi-model
│  │     │  │  │  └─ route.ts
│  │     │  │  └─ arcjet-test
│  │     │  │     └─ route.ts
│  │     │  └─ page.ts
│  │     ├─ cache-life.d.ts
│  │     ├─ package.json
│  │     ├─ routes.d.ts
│  │     └─ validator.ts
│  ├─ amplify.yml
│  ├─ app
│  │  ├─ api
│  │  │  ├─ ai-multi-model
│  │  │  │  └─ route.js
│  │  │  └─ arcjet-test
│  │  │     └─ route.js
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  ├─ page.js
│  │  ├─ provider.js
│  │  └─ _components
│  │     ├─ AiMultiModel.jsx
│  │     ├─ AppHeader.jsx
│  │     ├─ AppSidebar.jsx
│  │     ├─ ChatInputBox.jsx
│  │     └─ UsageCreditProgress.jsx
│  ├─ components
│  │  └─ ui
│  │     ├─ button.jsx
│  │     ├─ dropdown-menu.jsx
│  │     ├─ input.jsx
│  │     ├─ progress.jsx
│  │     ├─ select.jsx
│  │     ├─ separator.jsx
│  │     ├─ sheet.jsx
│  │     ├─ sidebar.jsx
│  │     ├─ skeleton.jsx
│  │     ├─ switch.jsx
│  │     └─ tooltip.jsx
│  ├─ components.json
│  ├─ config
│  │  ├─ ArcJet.js
│  │  └─ FirebaseConfig.js
│  ├─ context
│  │  └─ AiSelectedModels.jsx
│  ├─ Dockerfile
│  ├─ fusionai
│  │  ├─ .next
│  │  │  └─ types
│  │  │     ├─ routes.d.ts
│  │  │     └─ validator.ts
│  │  ├─ app
│  │  │  ├─ favicon.ico
│  │  │  ├─ globals.css
│  │  │  ├─ layout.js
│  │  │  └─ page.js
│  │  ├─ jsconfig.json
│  │  ├─ next.config.mjs
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ postcss.config.mjs
│  │  ├─ public
│  │  │  ├─ file.svg
│  │  │  ├─ globe.svg
│  │  │  ├─ next.svg
│  │  │  ├─ vercel.svg
│  │  │  └─ window.svg
│  │  └─ README.md
│  ├─ hooks
│  │  └─ use-mobile.js
│  ├─ jsconfig.json
│  ├─ lib
│  │  └─ utils.js
│  ├─ middleware.ts
│  ├─ next.config.mjs
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ public
│  │  ├─ cohere.png
│  │  ├─ deepseek.png
│  │  ├─ file.svg
│  │  ├─ gemini.png
│  │  ├─ globe.svg
│  │  ├─ gpt.png
│  │  ├─ grok.png
│  │  ├─ llama.png
│  │  ├─ logo.svg
│  │  ├─ mistral.png
│  │  ├─ next.svg
│  │  ├─ vercel.svg
│  │  └─ window.svg
│  ├─ README.md
│  └─ shared
│     ├─ AiModel.jsx
│     └─ AiModelDef.jsx
└─ README.md

```

## 🚀 Getting Started (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
