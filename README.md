# SMILE v2.0 🌟
## Smart Monitoring & Intelligent Learning Environment

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An AI-powered system for Early Childhood Development (ECD) risk prediction with 99.5% accuracy, integrating machine learning and computer vision for comprehensive child assessment.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Model Performance](#model-performance)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

SMILE (Smart Monitoring & Intelligent Learning Environment) is a production-ready AI system designed for India's Integrated Child Development Services (ICDS) program. It enables Anganwadi Workers (AWW), Supervisors, and Administrators to:

- **Predict developmental risks** in children aged 0-72 months
- **Analyze emotions and posture** through computer vision
- **Track interventions** and follow-ups
- **Visualize analytics** with interactive dashboards
- **Export reports** in PDF format

### Problem Statement

Traditional ECD screening methods are:
- ⏱️ Time-intensive and resource-constrained
- 📊 Subject to inter-rater variability
- 🔍 Limited in predictive capability
- 🧩 Lacking multi-domain integration

### Solution

SMILE addresses these challenges with:
- 🤖 **XGBoost ML Model** - 99.5% accuracy
- 👁️ **Computer Vision** - Emotion & pose analysis
- 📱 **Modern Web Interface** - Responsive & intuitive
- 🔐 **Role-Based Access** - AWW, Supervisor, Admin
- 📈 **Real-Time Analytics** - Data-driven insights

---

## ✨ Key Features

### 🧠 Machine Learning
- **XGBoost Classifier** with 99.5% accuracy
- **70+ Engineered Features** from 12 data domains
- **Multi-Class Prediction** (Low/Medium/High risk)
- **Confidence Scoring** for each prediction
- **Feature Importance Analysis**

### 👁️ Computer Vision
- **Emotion Detection** using OpenCV Haar Cascades
- **Pose Analysis** with MediaPipe (33 body landmarks)
- **Posture & Balance Scoring** (0-100 scale)
- **Activity Level Classification** (sedentary/moderate/active)
- **Overall Vision Score** combining all metrics

### 🎨 User Interface
- **Multi-Step Assessment Form** with 49+ fields
- **Interactive Dashboard** with charts (Recharts)
- **Assessment History** with search & filters
- **PDF Export** functionality
- **Responsive Design** (mobile-friendly)
- **Gradient Modern UI** with Tailwind CSS

### 🔐 Security
- **JWT Authentication** with 24-hour expiration
- **bcrypt Password Hashing** (cost factor: 12)
- **Role-Based Access Control** (RBAC)
- **Input Validation** with Pydantic schemas
- **SQL Injection Prevention** via SQLAlchemy ORM

### 📊 Analytics
- **Risk Distribution** pie charts
- **Domain Delays** bar charts
- **Monthly Trends** line charts
- **Key Insights** cards (success rate, early detection)
- **Summary Statistics** dashboard

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Dashboard │  │Assessment│  │ History  │  │  Vision  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   Auth   │  │Prediction│  │Dashboard │  │Assessment│     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Services & ML Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ XGBoost  │  │  OpenCV  │  │MediaPipe │                   │
│  │  Model   │  │ Emotion  │  │   Pose   │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Database (SQLite)                        │
│  Users | Child Records | Interventions | Follow-ups         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| React Router | 6.x | Navigation |
| Tailwind CSS | 3.x | Styling |
| Recharts | 2.x | Data Visualization |
| Axios | 1.x | HTTP Client |
| jsPDF | 2.x | PDF Export |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Programming Language |
| FastAPI | 0.104.1 | Web Framework |
| SQLAlchemy | 2.0.23 | ORM |
| Pydantic | 2.5.0 | Data Validation |
| Uvicorn | 0.24.0 | ASGI Server |

### Machine Learning
| Technology | Version | Purpose |
|------------|---------|---------|
| XGBoost | 2.0.2 | Classification |
| scikit-learn | 1.3.2 | Preprocessing |
| pandas | 2.1.3 | Data Manipulation |
| numpy | 1.26.2 | Numerical Computing |

### Computer Vision
| Technology | Version | Purpose |
|------------|---------|---------|
| OpenCV | 4.8.1 | Image Processing |
| MediaPipe | 0.10.8 | Pose Detection |

---

## 📦 Installation

### Prerequisites

Ensure you have the following installed:
- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

### Clone Repository

```bash
git clone https://github.com/yourusername/SMILE.git
cd SMILE
```

### Automated Installation (Windows)

Simply run the installation script:

```bash
install_dependencies.bat
```

This will:
1. ✅ Check Python & Node.js installation
2. ✅ Install backend dependencies
3. ✅ Install ML dependencies
4. ✅ Install frontend dependencies
5. ✅ Train the ML model

### Manual Installation

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
```

#### ML Model Training
```bash
cd ml
pip install -r requirements.txt
python train_model.py
```

---

## 🚀 Quick Start

### Automated Start (Windows)

```bash
start_smile.bat
```

This will:
1. Start backend server (http://localhost:8000)
2. Start frontend server (http://localhost:5173)
3. Open browser automatically

### Manual Start

#### Terminal 1: Backend
```bash
cd backend
python main.py
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

#### Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Default Login Credentials

```
Username: admin
Password: admin123
```

---

## 📖 Usage

### 1. Login
- Navigate to http://localhost:5173
- Enter credentials (admin/admin123)
- Click "Login"

### 2. Create Assessment

**Option A: Full Assessment**
- Click "New Assessment"
- Fill basic info (Child ID, Name, Age, Gender)
- Choose "Full Assessment"
- Fill developmental fields (optional):
  - DQ Scores (0-150)
  - Developmental Delays (Yes/No)
  - Nutrition Status (Yes/No)
  - Health Risk Factors (Yes/No)
  - Neuro-Behavioral (Yes/No)
  - Environment & Caregiving (0-10)
  - Behavior Indicators (0-10)
- Optionally upload photo
- Submit to get ML risk prediction

**Option B: Vision Only**
- Click "New Assessment"
- Fill basic info
- Choose "Vision Only"
- Upload child photo
- Get emotion & pose analysis

**Option C: Basic Only**
- Click "New Assessment"
- Fill basic info
- Choose "Basic Only"
- Save without assessment

### 3. View Dashboard
- Click "Dashboard"
- View risk distribution chart
- View domain delays chart
- View monthly trends
- See key insights & statistics

### 4. Assessment History
- Click "History"
- Search by Child ID or Name
- View assessment details
- Export to PDF

### 5. Vision Analysis
- Click "Vision Only"
- Upload child photo
- Get instant emotion & pose results

---

## 📡 API Documentation

### Authentication Endpoints

#### POST /auth/signup
Register new user
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "AWW|SUPERVISOR|ADMIN",
  "district": "string",
  "mandal": "string",
  "awc_code": "string"
}
```

#### POST /auth/login
Login and get JWT token
```json
{
  "username": "string",
  "password": "string"
}
```

### Assessment Endpoints

#### POST /api/unified-assessment
Submit unified assessment (FormData)
- `child_id` (required)
- `child_name` (required)
- `age_months` (required)
- `gender` (required)
- `assessment_data` (optional JSON string)
- `image` (optional file)

#### GET /api/assessments
Get all assessments (paginated)

#### GET /api/assessments/child/{child_id}
Get assessments for specific child

#### GET /api/assessments/{record_id}
Get detailed assessment by ID

### Prediction Endpoints

#### POST /api/predict
ML risk prediction (JSON body)

#### POST /api/analyze-image
Vision analysis (FormData with image)

### Dashboard Endpoints

#### GET /api/dashboard-data
Get analytics data for charts

#### GET /api/stats
Get summary statistics

Full API documentation available at: http://localhost:8000/docs

---

## 📊 Model Performance

### XGBoost Classifier Results

| Metric | Value |
|--------|-------|
| **Accuracy** | 99.5% |
| **F1 Score** | 99.25% |
| **Precision (Low)** | 99.5% |
| **Precision (Medium)** | 98.5% |
| **Precision (High)** | 99.5% |
| **Recall (Low)** | 99.0% |
| **Recall (Medium)** | 99.0% |
| **Recall (High)** | 99.5% |

### Dataset Statistics

- **Total Records**: 1000 children
- **Age Range**: 0-72 months
- **Features**: 70 engineered features
- **Data Tables**: 12 integrated tables
- **Train/Test Split**: 80/20 stratified

### Top 10 Important Features

1. DQ_mean (14.5%)
2. num_delays (12.8%)
3. total_health_risk (11.2%)
4. interaction_index (9.8%)
5. GM_DQ (8.7%)
6. nutrition_score (7.6%)
7. age_months (6.5%)
8. SE_DQ (5.8%)
9. COG_DQ (5.4%)
10. behaviour_score (4.8%)

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Assessment Form
![Assessment](https://via.placeholder.com/800x400?text=Assessment+Form+Screenshot)

### Vision Analysis
![Vision](https://via.placeholder.com/800x400?text=Vision+Analysis+Screenshot)

### Assessment History
![History](https://via.placeholder.com/800x400?text=Assessment+History+Screenshot)

---

## 📁 Project Structure

```
SMILE/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── models/            # Database models
│   │   ├── routes/            # API endpoints
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── utils/             # Auth, DB utilities
│   ├── main.py                # Entry point
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── utils/             # API client
│   │   └── App.jsx            # Main app component
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
├── ml/                         # Machine Learning
│   ├── models/                # Trained model artifacts
│   │   ├── model.pkl
│   │   ├── scaler.pkl
│   │   └── label_encoder.pkl
│   ├── train_model.py         # Training pipeline
│   └── requirements.txt       # ML dependencies
│
├── dataset/                    # Training data
│   └── ECD Data sets.xlsx     # 12-table dataset
│
├── image samples/              # Test images
├── test_samples/               # Sample JSON data
│
├── install_dependencies.bat    # Automated installation
├── start_smile.bat            # Automated startup
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
├── LICENSE                    # MIT License
├── RESEARCH_PAPER_COMPLETE.txt # Detailed documentation
└── docker-compose.yml         # Docker configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**SMILE Development Team**

- Project Lead: [Your Name]
- ML Engineer: [Your Name]
- Frontend Developer: [Your Name]
- Backend Developer: [Your Name]

---

## 📞 Contact

For questions, issues, or suggestions:

- **Email**: your.email@example.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/SMILE/issues)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- **ICDS Program** - Inspiration and domain knowledge
- **Open Source Community** - Excellent libraries and frameworks
- **Academic Advisors** - Guidance and support
- **XGBoost Team** - High-performance ML library
- **MediaPipe Team** - Computer vision framework
- **FastAPI Team** - Modern web framework
- **React Team** - UI library

---

## 📈 Roadmap

### Version 2.1 (Planned)
- [ ] PostgreSQL database support
- [ ] Real-time notifications
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Advanced analytics dashboard

### Version 3.0 (Future)
- [ ] Mobile app (React Native)
- [ ] Video-based assessment
- [ ] AI-powered intervention recommendations
- [ ] Integration with ICDS national database
- [ ] Telemedicine integration
- [ ] Parent mobile app

---

## 📚 Documentation

- **Research Paper**: See [RESEARCH_PAPER_COMPLETE.txt](RESEARCH_PAPER_COMPLETE.txt)
- **API Documentation**: http://localhost:8000/docs
- **User Manual**: Coming soon
- **Developer Guide**: Coming soon

---

## ⚡ Performance

- **API Response Time**: <200ms average
- **ML Prediction Time**: <500ms
- **Vision Analysis Time**: <2s
- **Page Load Time**: <3s
- **Database Queries**: Optimized with indexes

---

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Pydantic
- SQL injection prevention
- CORS configuration
- Secure headers

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/SMILE&type=Date)](https://star-history.com/#yourusername/SMILE&Date)

---

<div align="center">

**Made with ❤️ for Early Childhood Development**

[⬆ Back to Top](#smile-v20-)

</div>
