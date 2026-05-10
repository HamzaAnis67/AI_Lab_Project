# Customer Churn Detection System

A comprehensive web-based machine learning application for predicting telecom customer churn using multiple ML algorithms.

## 🎯 Project Overview

This system helps telecom companies identify customers who are likely to leave their service (churn) by analyzing various customer attributes and usage patterns. The application provides real-time predictions, detailed analytics, and actionable insights for customer retention strategies.

## 🚀 Features

### 📊 Prediction Interface
- **Comprehensive Customer Form**: Input all customer demographics, services, and account details
- **Multiple ML Models**: Choose from Logistic Regression, Random Forest, Decision Tree, and KNN
- **Real-time Predictions**: Get instant churn probability and risk assessment
- **Personalized Recommendations**: Receive tailored retention strategies based on prediction results

### 📈 Analytics Dashboard
- **Model Performance Comparison**: Compare accuracy across all trained models
- **Churn Distribution**: Visualize overall churn patterns
- **Feature Analysis**: Understand key factors driving customer decisions
- **Interactive Charts**: Dynamic visualizations for better insights

### 🔍 Advanced Analytics
- **Feature Importance**: Identify the most influential factors in churn prediction
- **Confusion Matrix**: Evaluate model performance with detailed metrics
- **Classification Reports**: Comprehensive precision, recall, and F1-score analysis

## 🛠️ Technology Stack

### Frontend
- **HTML5 & CSS3**: Modern responsive design
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript**: Interactive client-side functionality
- **Chart.js**: Data visualization and analytics charts
- **Font Awesome**: Professional icons and UI elements

### Backend
- **Python**: Core programming language
- **Flask**: Lightweight web framework
- **Scikit-learn**: Machine learning library
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **Joblib**: Model serialization

## 📊 Machine Learning Models

### 1. Logistic Regression (Best Performance: 81.55%)
- Linear classification model with probability outputs
- Highly interpretable results
- Best overall accuracy on the dataset

### 2. Random Forest (79.91%)
- Ensemble method with multiple decision trees
- Robust to overfitting
- Provides feature importance metrics

### 3. K-Nearest Neighbors (75.73%)
- Instance-based learning algorithm
- Simple and effective for pattern recognition
- Non-parametric approach

### 4. Decision Tree (72.46%)
- Tree-based classification model
- Easy to interpret decision rules
- Visual representation of decisions

## 📁 Dataset Information

- **Source**: Telco Customer Churn Dataset
- **Records**: 7,043 customers
- **Features**: 20 predictive attributes
- **Target Variable**: Churn (Yes/No)

### Feature Categories:
- **Demographics**: Gender, Senior Citizen, Partner, Dependents
- **Services**: Phone, Internet, Streaming, Security services
- **Account**: Contract type, Billing method, Payment method
- **Financial**: Tenure, Monthly charges, Total charges

## 🚀 Installation and Setup

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Modern web browser

### Step 1: Navigate to Project Directory
```bash
cd "d:\university_work\Artificial Intelligence Lab\lab_project\Data-Analysis-Lab\Customer Churn Detection"
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Prepare Dataset
Ensure the `Customer-Churn.csv` file is in the project directory. If not available, the system will generate sample data automatically.

### Step 4: Run the Application
```bash
python backend.py
```

### Step 5: Access the Application
Open your web browser and navigate to:
```
http://localhost:5000
```

## 🎮 How to Use

### Making Predictions
1. **Navigate to "Predict Churn" tab**
2. **Fill in Customer Information**:
   - Demographics (gender, senior citizen status, etc.)
   - Services (phone, internet, security features)
   - Account details (contract type, payment method)
   - Financial information (tenure, charges)
3. **Select Model**: Choose your preferred ML algorithm
4. **Click "Predict Churn Risk"**: Get instant results and recommendations

### Viewing Analytics
1. **Dashboard Tab**: View model performance and data distributions
2. **Analysis Tab**: Explore feature importance and detailed metrics
3. **About Tab**: Learn more about the project and methodology

## 📊 Key Insights from the Model

### Top Churn Risk Factors:
1. **Total Charges** (95% importance)
2. **Monthly Charges** (88% importance)
3. **Tenure Duration** (76% importance)
4. **Contract Type** (65% importance)
5. **Payment Method** (52% importance)

### Risk Patterns:
- **Month-to-month contracts** have significantly higher churn rates
- **Higher monthly charges** correlate with increased churn probability
- **Shorter tenure** customers are more likely to leave
- **Electronic check payments** show higher churn tendency

## 🎯 Business Applications

### Customer Retention Strategies
- **Proactive Outreach**: Contact high-risk customers before they decide to leave
- **Personalized Offers**: Tailor discounts and promotions based on risk factors
- **Service Optimization**: Improve service packages for at-risk segments
- **Loyalty Programs**: Implement retention initiatives for long-term customers

### Operational Benefits
- **Reduced Customer Acquisition Costs**: Focus on retaining existing customers
- **Improved Customer Lifetime Value**: Extend customer relationships
- **Data-Driven Decisions**: Make informed retention strategies
- **Resource Optimization**: Allocate retention efforts effectively

## 🔧 API Endpoints

### Prediction API
- **POST /predict**: Make churn predictions
- **GET /model_performance**: Get model accuracy metrics
- **GET /feature_importance**: Retrieve feature importance data
- **GET /dataset_stats**: Get dataset statistics
- **GET /health**: System health check

## 📈 Model Performance Metrics

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| Logistic Regression | 81.55% | 0.77 | 0.74 | 0.75 |
| Random Forest | 79.91% | 0.75 | 0.70 | 0.71 |
| K-Nearest Neighbors | 75.73% | 0.69 | 0.68 | 0.68 |
| Decision Tree | 72.46% | 0.65 | 0.65 | 0.65 |

## 🎨 UI Features

### Modern Design Elements
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Charts**: Dynamic data visualization
- **Smooth Animations**: Professional transitions and hover effects
- **Color-Coded Results**: Visual indicators for risk levels
- **Loading States**: User-friendly feedback during processing

### User Experience
- **Intuitive Navigation**: Tab-based interface for easy access
- **Real-time Validation**: Input validation and error handling
- **Comprehensive Feedback**: Detailed explanations and recommendations
- **Professional Styling**: Modern gradient designs and card layouts

## 📝 Project Structure

```
Customer Churn Detection/
├── index.html              # Main frontend application
├── app.js                  # Frontend JavaScript functionality
├── backend.py              # Flask backend server
├── requirements.txt        # Python dependencies
├── README.md              # Project documentation
└── Customer-Churn.csv     # Dataset file (if available)
```

## 🎓 Academic Context

**PITP Certified Data Scientist Program**  
*Final Project by Muhammad Shayan Haider*

This project demonstrates practical application of machine learning concepts in a real-world business scenario, showcasing skills in:
- Data preprocessing and feature engineering
- Multiple ML algorithm implementation
- Model evaluation and comparison
- Full-stack web development
- Data visualization and analytics

## 🔮 Future Enhancements

### Planned Features
- **Real-time Data Integration**: Connect to live customer databases
- **Advanced ML Models**: Implement gradient boosting and neural networks
- **Customer Segmentation**: Add clustering for customer grouping
- **Predictive Analytics**: Forecast future churn trends
- **A/B Testing**: Test retention strategies effectiveness

### Technical Improvements
- **Model Optimization**: Hyperparameter tuning and cross-validation
- **Scalability**: Handle larger datasets and concurrent users
- **Security**: Add authentication and data encryption
- **Monitoring**: Implement logging and performance tracking

---

**© 2024 Customer Churn Detection System**  
*PITP Certified Data Scientist Program*
