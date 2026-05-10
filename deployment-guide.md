# 🚀 Complete Deployment Guide

## 📁 Repository Structure

Yes, you need to publish ALL files in the same repository:

```
customer-churn-detection/
├── index.html              # Frontend application
├── app.js                  # Frontend JavaScript
├── backend.py              # Flask backend server
├── requirements.txt         # Python dependencies
├── Procfile               # Heroku process config
├── render.yaml            # Render deployment config
├── vercel.json            # Vercel deployment config
├── .gitignore             # Git ignore file
├── Customer-Churn.csv     # Dataset (optional)
└── README.md              # Project documentation
```

## 🎯 Render Deployment Steps

### **Step 1: Create GitHub Repository**
```bash
git init
git add .
git commit -m "Initial commit: Customer Churn Detection System"
git branch -M main
git remote add origin https://github.com/yourusername/customer-churn-detection.git
git push -u origin main
```

### **Step 2: Deploy to Render**
1. **Go to [render.com](https://render.com)
2. **Sign up/Login** with GitHub
3. **"New Web Service"** → **"Connect GitHub"**
4. **Select your repository**
5. **Render will auto-detect `render.yaml`**
6. **Name your service**: `customer-churn-api`
7. **Click "Create Web Service"**

### **Step 3: Render Start Command**
Render automatically uses the start command from `render.yaml`:

```yaml
startCommand: gunicorn --bind 0.0.0.0:$PORT backend:app
```

**No manual start command needed!** Render handles this automatically.

## 🔧 What Render Does Automatically

### **Build Process:**
```bash
1. Clones your repository
2. Runs: pip install -r requirements.txt
3. Starts: gunicorn --bind 0.0.0.0:$PORT backend:app
4. Assigns URL: https://your-app-name.onrender.com
```

### **Environment Variables:**
Render automatically sets:
- `PORT` (usually 10000)
- `PYTHONPATH`
- `HOME`

### **SSL Certificate:**
✅ Automatic HTTPS provided

## 🌐 Your Live URLs

After deployment:
- **Backend API**: `https://your-app-name.onrender.com`
- **Health Check**: `https://your-app-name.onrender.com/health`
- **API Endpoints**:
  - POST `/predict` - Make predictions
  - GET `/model_performance` - Model metrics
  - GET `/feature_importance` - Feature data

## 📋 Verification Checklist

### **✅ Before Pushing:**
- [ ] All files committed to Git
- [ ] `requirements.txt` includes gunicorn
- [ ] `render.yaml` configured correctly
- [ ] `backend.py` has CORS enabled
- [ ] `.gitignore` created

### **✅ After Deployment:**
- [ ] Backend responds at health endpoint
- [ ] API predictions work
- [ ] No CORS errors in browser console
- [ ] Models load correctly

## 🔄 Vercel Frontend (Separate)

For the frontend, you'll deploy separately to Vercel:

### **Vercel Deployment:**
1. Create new project in Vercel
2. Connect same GitHub repository
3. Vercel detects `vercel.json`
4. Deploy automatically
5. Update `app.js` with your Render URL

## 🎯 Final Architecture

```
┌─────────────────┐    ┌──────────────────┐
│   Vercel       │    │    Render        │
│  (Frontend)    │◄──►│   (Backend)     │
│                │    │                 │
│ Static Files    │    │  ML Models      │
│ Global CDN      │    │  API Server     │
└─────────────────┘    └──────────────────┘
```

## 🚀 Quick Start Commands

```bash
# 1. Initialize Git
git init
git add .
git commit -m "Customer Churn Detection System"
git remote add origin https://github.com/yourusername/customer-churn-detection.git

# 2. Push to GitHub
git push -u origin main

# 3. Deploy to Render
# Go to render.com → Connect GitHub → Deploy
```

## 📞 Support

**Render automatically:**
- Installs dependencies
- Starts your application
- Provides HTTPS
- Handles scaling
- Monitors health

**You don't need any start commands** - Render handles everything through `render.yaml`!

Your backend will be live at: `https://your-app-name.onrender.com` 🚀
