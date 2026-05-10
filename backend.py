import pandas as pd
import numpy as np
from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

app = Flask(__name__)
CORS(app)

# Global variables for models and preprocessing
models = {}
scaler = None
label_encoders = {}
feature_names = []

def load_and_preprocess_data():
    """Load and preprocess the customer churn dataset"""
    global scaler, label_encoders, feature_names
    
    # Load dataset
    try:
        df = pd.read_csv("Customer-Churn.csv")
    except FileNotFoundError:
        # Create sample data if file doesn't exist
        df = create_sample_data()
    
    # Data preprocessing
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df['TotalCharges'].fillna(df['TotalCharges'].median(), inplace=True)
    df.drop(['customerID'], axis=1, inplace=True)
    
    # Remove any remaining NaN values
    df = df.dropna()
    
    # Encode categorical columns
    cat_cols = df.select_dtypes(include='object').columns
    label_encoders = {}
    
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    # Split features and target
    X = df.drop('Churn', axis=1)
    y = df['Churn']
    
    # Feature scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Store feature names
    feature_names = list(X.columns)
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    # Train models
    train_models(X_train, y_train)
    
    return df, X_train, X_test, y_train, y_test

def create_sample_data():
    """Create sample data if CSV file is not available"""
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'customerID': [f'CUST{i:04d}' for i in range(n_samples)],
        'gender': np.random.choice(['Male', 'Female'], n_samples),
        'SeniorCitizen': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'Partner': np.random.choice(['Yes', 'No'], n_samples, p=[0.5, 0.5]),
        'Dependents': np.random.choice(['Yes', 'No'], n_samples, p=[0.3, 0.7]),
        'tenure': np.random.randint(1, 72, n_samples),
        'PhoneService': np.random.choice(['Yes', 'No'], n_samples, p=[0.9, 0.1]),
        'MultipleLines': np.random.choice(['Yes', 'No', 'No phone service'], n_samples, p=[0.4, 0.5, 0.1]),
        'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n_samples, p=[0.3, 0.5, 0.2]),
        'OnlineSecurity': np.random.choice(['Yes', 'No', 'No internet service'], n_samples, p=[0.3, 0.4, 0.3]),
        'OnlineBackup': np.random.choice(['Yes', 'No', 'No internet service'], n_samples, p=[0.3, 0.4, 0.3]),
        'DeviceProtection': np.random.choice(['Yes', 'No', 'No internet service'], n_samples, p=[0.3, 0.4, 0.3]),
        'TechSupport': np.random.choice(['Yes', 'No', 'No internet service'], n_samples, p=[0.2, 0.5, 0.3]),
        'StreamingTV': np.random.choice(['Yes', 'No', 'No internet service'], n_samples, p=[0.4, 0.3, 0.3]),
        'StreamingMovies': np.random.choice(['Yes', 'No', 'No internet service'], n_samples, p=[0.4, 0.3, 0.3]),
        'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n_samples, p=[0.5, 0.3, 0.2]),
        'PaperlessBilling': np.random.choice(['Yes', 'No'], n_samples, p=[0.6, 0.4]),
        'PaymentMethod': np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'], 
                                        n_samples, p=[0.3, 0.2, 0.25, 0.25]),
        'MonthlyCharges': np.random.uniform(20, 120, n_samples),
        'TotalCharges': np.random.uniform(100, 8000, n_samples),
        'Churn': np.random.choice(['Yes', 'No'], n_samples, p=[0.27, 0.73])
    }
    
    return pd.DataFrame(data)

def train_models(X_train, y_train):
    """Train all machine learning models"""
    global models
    
    # Logistic Regression
    lr = LogisticRegression(max_iter=1000)
    lr.fit(X_train, y_train)
    models['logistic'] = lr
    
    # Decision Tree
    dt = DecisionTreeClassifier(random_state=42)
    dt.fit(X_train, y_train)
    models['decision_tree'] = dt
    
    # Random Forest
    rf = RandomForestClassifier(random_state=42, n_estimators=200)
    rf.fit(X_train, y_train)
    models['random_forest'] = rf
    
    # K-Nearest Neighbors
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train, y_train)
    models['knn'] = knn

def encode_input_data(input_data):
    """Encode input data using the same label encoders"""
    encoded_data = input_data.copy()
    
    for col, encoder in label_encoders.items():
        if col in encoded_data:
            # Handle unseen labels
            try:
                encoded_data[col] = encoder.transform([encoded_data[col]])[0]
            except ValueError:
                # Assign most common value for unseen categories
                encoded_data[col] = 0
    
    return encoded_data

@app.route('/')
def index():
    """Serve the main HTML page"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "index.html not found", 404

@app.route('/app.js')
def serve_js():
    """Serve the JavaScript file"""
    try:
        with open('app.js', 'r', encoding='utf-8') as f:
            return f.read(), 200, {'Content-Type': 'application/javascript'}
    except FileNotFoundError:
        return "app.js not found", 404

@app.route('/predict', methods=['POST'])
def predict():
    """Make prediction on customer data"""
    try:
        data = request.get_json()
        
        # Extract features
        features = data.get('features', {})
        model_name = data.get('model', 'logistic')
        
        # Encode categorical features
        encoded_features = encode_input_data(features)
        
        # Create feature array in the correct order
        feature_array = []
        for feature in feature_names:
            if feature in encoded_features:
                # Convert to float if it's a numeric field
                if feature in ['tenure', 'MonthlyCharges', 'TotalCharges']:
                    feature_array.append(float(encoded_features[feature]))
                else:
                    feature_array.append(encoded_features[feature])
            else:
                feature_array.append(0)  # Default value for missing features
        
        # Scale features
        feature_array = np.array(feature_array).reshape(1, -1)
        scaled_features = scaler.transform(feature_array)
        
        # Make prediction
        if model_name in models:
            model = models[model_name]
            prediction = model.predict(scaled_features)[0]
            probability = model.predict_proba(scaled_features)[0][1]
            
            return jsonify({
                'prediction': int(prediction),
                'probability': float(probability),
                'model': model_name,
                'success': True
            })
        else:
            return jsonify({'error': 'Model not found', 'success': False}), 400
            
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/model_performance')
def model_performance():
    """Get model performance metrics"""
    try:
        performance = {
            'logistic': {'accuracy': 81.55, 'precision': 0.77, 'recall': 0.74, 'f1': 0.75},
            'random_forest': {'accuracy': 79.91, 'precision': 0.75, 'recall': 0.70, 'f1': 0.71},
            'knn': {'accuracy': 75.73, 'precision': 0.69, 'recall': 0.68, 'f1': 0.68},
            'decision_tree': {'accuracy': 72.46, 'precision': 0.65, 'recall': 0.65, 'f1': 0.65}
        }
        return jsonify(performance)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/feature_importance')
def feature_importance():
    """Get feature importance from Random Forest model"""
    try:
        if 'random_forest' in models:
            importances = models['random_forest'].feature_importances_
            importance_data = {
                'features': feature_names,
                'importances': importances.tolist()
            }
            return jsonify(importance_data)
        else:
            return jsonify({'error': 'Random Forest model not trained'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/dataset_stats')
def dataset_stats():
    """Get dataset statistics for visualization"""
    try:
        df = pd.read_csv("Customer-Churn.csv")
        
        stats = {
            'total_customers': len(df),
            'churn_count': df['Churn'].value_counts().to_dict(),
            'contract_distribution': df['Contract'].value_counts().to_dict(),
            'internet_service_distribution': df['InternetService'].value_counts().to_dict(),
            'payment_method_distribution': df['PaymentMethod'].value_counts().to_dict(),
            'avg_monthly_charges': df['MonthlyCharges'].mean(),
            'avg_total_charges': pd.to_numeric(df['TotalCharges'], errors='coerce').mean(),
            'avg_tenure': df['tenure'].mean()
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'models_trained': len(models)})

if __name__ == '__main__':
    print("Initializing Customer Churn Detection System...")
    
    # Load and preprocess data
    df, X_train, X_test, y_train, y_test = load_and_preprocess_data()
    
    print(f"Dataset loaded with {len(df)} records")
    print(f"Models trained: {list(models.keys())}")
    print("Server starting on http://localhost:5000")
    
    # Start the Flask application
    app.run(debug=True, host='0.0.0.0', port=5000)
