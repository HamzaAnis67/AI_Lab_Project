// Global variables
let models = {};
let scaler = null;
let labelEncoders = {};
let featureNames = [];

// Backend URL configuration
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : (process.env.BACKEND_URL || 'https://ai-lab-project-u0i0.onrender.com');


// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeModels();
    initializeCharts();
    setupEventListeners();
});

// Initialize ML models with mock data (in real app, this would load trained models)
function initializeModels() {
    // Mock model predictions based on patterns from the notebook
    models = {
        logistic: {
            predict: function(features) {
                // Simulate logistic regression prediction
                const score = calculateChurnScore(features);
                return {
                    prediction: score > 0.5 ? 1 : 0,
                    probability: score
                };
            },
            accuracy: 81.55
        },
        random_forest: {
            predict: function(features) {
                // Simulate random forest prediction
                const score = calculateChurnScore(features) * 0.98;
                return {
                    prediction: score > 0.5 ? 1 : 0,
                    probability: score
                };
            },
            accuracy: 79.91
        },
        decision_tree: {
            predict: function(features) {
                // Simulate decision tree prediction
                const score = calculateChurnScore(features) * 0.89;
                return {
                    prediction: score > 0.5 ? 1 : 0,
                    probability: score
                };
            },
            accuracy: 72.46
        },
        knn: {
            predict: function(features) {
                // Simulate KNN prediction
                const score = calculateChurnScore(features) * 0.93;
                return {
                    prediction: score > 0.5 ? 1 : 0,
                    probability: score
                };
            },
            accuracy: 75.73
        }
    };

    // Mock feature names
    featureNames = [
        'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure',
        'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
        'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
        'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod',
        'MonthlyCharges', 'TotalCharges'
    ];
}

// Calculate churn score based on feature patterns
function calculateChurnScore(features) {
    let score = 0.3; // Base probability

    // Tenure impact (lower tenure = higher churn risk)
    const tenure = parseFloat(features.tenure) || 12;
    score += Math.max(0, (24 - tenure) / 100);

    // Monthly charges impact (higher charges = higher churn risk)
    const monthlyCharges = parseFloat(features.MonthlyCharges) || 50;
    score += Math.max(0, (monthlyCharges - 50) / 200);

    // Contract type impact
    if (features.Contract === 'Month-to-month') {
        score += 0.2;
    } else if (features.Contract === 'One year') {
        score += 0.1;
    }

    // Internet service impact
    if (features.InternetService === 'Fiber optic') {
        score += 0.1;
    }

    // Payment method impact
    if (features.PaymentMethod === 'Electronic check') {
        score += 0.08;
    }

    // Services impact
    const services = ['OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport'];
    const hasServices = services.filter(service => features[service] === 'Yes').length;
    score -= hasServices * 0.05;

    // Senior citizen impact
    if (features.SeniorCitizen === '1') {
        score += 0.05;
    }

    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
}

// Global variable to store chart instances
let chartInstances = {};

// Destroy existing charts before creating new ones
function destroyChart(chartId) {
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
        delete chartInstances[chartId];
    }
}

// Initialize charts
function initializeCharts() {
    // Destroy existing charts
    Object.keys(chartInstances).forEach(chartId => destroyChart(chartId));
    
    // Churn Distribution Chart
    const churnCtx = document.getElementById('churnDistribution');
    if (churnCtx) {
        chartInstances['churnDistribution'] = new Chart(churnCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['No Churn', 'Churn'],
                datasets: [{
                    data: [5174, 1869],
                    backgroundColor: ['#6B5B95', '#FF6F61'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Model Comparison Chart
    const modelCtx = document.getElementById('modelComparison');
    if (modelCtx) {
        chartInstances['modelComparison'] = new Chart(modelCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Logistic Regression', 'Random Forest', 'KNN', 'Decision Tree'],
                datasets: [{
                    label: 'Accuracy (%)',
                    data: [81.55, 79.91, 75.73, 72.46],
                    backgroundColor: ['#667eea', '#764ba2', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Monthly Charges vs Churn (replaced boxplot with bar chart)
    const monthlyChargesCtx = document.getElementById('monthlyChargesChart');
    if (monthlyChargesCtx) {
        chartInstances['monthlyChargesChart'] = new Chart(monthlyChargesCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['No Churn', 'Churn'],
                datasets: [{
                    label: 'Average Monthly Charges',
                    data: [61.3, 74.4],
                    backgroundColor: ['#6B5B95', '#FF6F61']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Monthly Charges ($)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Contract Type Chart
    const contractCtx = document.getElementById('contractChart');
    if (contractCtx) {
        chartInstances['contractChart'] = new Chart(contractCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Month-to-month', 'One year', 'Two year'],
                datasets: [
                    {
                        label: 'No Churn',
                        data: [2220, 1307, 1647],
                        backgroundColor: '#6B5B95'
                    },
                    {
                        label: 'Churn',
                        data: [1655, 166, 48],
                        backgroundColor: '#FF6F61'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });
    }

    // Feature Importance Chart
    const featureImportanceCtx = document.getElementById('featureImportanceChart');
    if (featureImportanceCtx) {
        chartInstances['featureImportanceChart'] = new Chart(featureImportanceCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [
                    'TotalCharges', 'MonthlyCharges', 'tenure', 'Contract',
                    'PaymentMethod', 'InternetService', 'OnlineSecurity', 'TechSupport',
                    'Partner', 'Dependents'
                ],
                datasets: [{
                    label: 'Importance',
                    data: [0.95, 0.88, 0.76, 0.65, 0.52, 0.45, 0.38, 0.35, 0.28, 0.25],
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    }

    // Confusion Matrix (replaced heatmap with bar chart)
    const confusionCtx = document.getElementById('confusionMatrix');
    if (confusionCtx) {
        chartInstances['confusionMatrix'] = new Chart(confusionCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['True Negative', 'False Positive', 'False Negative', 'True Positive'],
                datasets: [{
                    label: 'Count',
                    data: [933, 103, 156, 217],
                    backgroundColor: ['#6B5B95', '#FF6F61', '#FF6F61', '#6B5B95']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    const form = document.getElementById('prediction-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.id.replace('-tab', '');
            showTab(tabName);
        });
    });
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const features = {};
    
    // Convert form data to features object
    for (let [key, value] of formData.entries()) {
        features[key] = value;
    }
    
    // Get selected model
    const modelName = features.model;
    delete features.model;
    
    // Show loading state
    showLoadingState();
    
    // Make API call to backend
    fetch(`${BACKEND_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            features: features,
            model: modelName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayPredictionResult(data, modelName, features);
        } else {
            throw new Error(data.error || 'Prediction failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Fallback to local prediction for development
        const model = models[modelName];
        const result = model.predict(features);
        displayPredictionResult(result, modelName, features);
    })
    .finally(() => {
        hideLoadingState();
    });
}

// Show loading state
function showLoadingState() {
    const resultDiv = document.getElementById('prediction-result');
    const resultContent = document.getElementById('result-content');
    
    resultDiv.classList.remove('hidden');
    resultContent.innerHTML = `
        <div class="text-center py-8">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">Analyzing customer data...</p>
        </div>
    `;
}

// Hide loading state
function hideLoadingState() {
    // Loading state will be replaced by results
}

// Display prediction result
function displayPredictionResult(result, modelName, features) {
    const resultContent = document.getElementById('result-content');
    
    const churnRisk = result.prediction === 1 ? 'Likely to churn' : 'Unlikely to churn';
    const riskColor = result.prediction === 1 ? 'text-red-600' : 'text-green-600';
    const riskBg = result.prediction === 1 ? 'bg-red-50' : 'bg-green-50';
    const probability = (result.probability * 100).toFixed(2);
    
    // Determine risk level
    let riskLevel = 'Low Risk';
    let riskLevelColor = 'text-green-600';
    
    if (result.probability > 0.7) {
        riskLevel = 'High Risk';
        riskLevelColor = 'text-red-600';
    } else if (result.probability > 0.4) {
        riskLevel = 'Medium Risk';
        riskLevelColor = 'text-yellow-600';
    }
    
    resultContent.innerHTML = `
        <div class="${riskBg} rounded-lg p-6 mb-4">
            <div class="text-center">
                <div class="text-3xl font-bold ${riskColor} mb-2">${churnRisk}</div>
                <div class="text-lg ${riskLevelColor} font-semibold">${riskLevel}</div>
                <div class="text-4xl font-bold mt-4">${probability}%</div>
                <div class="text-sm text-gray-600">Churn Probability</div>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-600">Model Used</div>
                <div class="font-semibold">${getModelDisplayName(modelName)}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-600">Model Accuracy</div>
                <div class="font-semibold">${models[modelName].accuracy}%</div>
            </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">
                <i class="fas fa-lightbulb mr-2"></i>Recommendations
            </h4>
            <ul class="text-sm text-blue-700 space-y-1">
                ${generateRecommendations(result.probability, features)}
            </ul>
        </div>
        
        <div class="mt-4">
            <h4 class="font-semibold mb-2">Key Factors Influencing This Prediction</h4>
            <div class="space-y-2">
                ${generateKeyFactors(features)}
            </div>
        </div>
    `;
}

// Get model display name
function getModelDisplayName(modelName) {
    const names = {
        'logistic': 'Logistic Regression',
        'random_forest': 'Random Forest',
        'decision_tree': 'Decision Tree',
        'knn': 'K-Nearest Neighbors'
    };
    return names[modelName] || modelName;
}

// Generate recommendations based on churn probability
function generateRecommendations(probability, features) {
    let recommendations = [];
    
    if (probability > 0.7) {
        recommendations.push('<li>• Immediate intervention required - contact customer within 24 hours</li>');
        recommendations.push('<li>• Offer discounted pricing or promotional deals</li>');
        recommendations.push('<li>• Assign dedicated customer success manager</li>');
    } else if (probability > 0.4) {
        recommendations.push('<li>• Proactive outreach within 1 week</li>');
        recommendations.push('<li>• Review current service package and suggest improvements</li>');
        recommendations.push('<li>• Consider loyalty incentives</li>');
    } else {
        recommendations.push('<li>• Continue regular customer engagement</li>');
        recommendations.push('<li>• Monitor account for any changes in usage patterns</li>');
    }
    
    // Specific recommendations based on features
    if (features.Contract === 'Month-to-month') {
        recommendations.push('<li>• Offer long-term contract benefits</li>');
    }
    
    if (features.InternetService === 'Fiber optic' && parseFloat(features.MonthlyCharges) > 80) {
        recommendations.push('<li>• Review pricing for high-speed internet plans</li>');
    }
    
    const services = ['OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport'];
    const hasServices = services.filter(service => features[service] === 'Yes').length;
    if (hasServices < 2) {
        recommendations.push('<li>• Promote value of additional security and support services</li>');
    }
    
    return recommendations.join('');
}

// Generate key factors for this specific prediction
function generateKeyFactors(features) {
    let factors = [];
    
    const tenure = parseFloat(features.tenure) || 12;
    const monthlyCharges = parseFloat(features.MonthlyCharges) || 50;
    
    if (tenure < 12) {
        factors.push('<div class="flex justify-between items-center p-2 bg-yellow-50 rounded"><span>Short tenure (< 1 year)</span><span class="text-yellow-600 font-semibold">High Risk</span></div>');
    }
    
    if (monthlyCharges > 80) {
        factors.push('<div class="flex justify-between items-center p-2 bg-orange-50 rounded"><span>High monthly charges</span><span class="text-orange-600 font-semibold">Medium Risk</span></div>');
    }
    
    if (features.Contract === 'Month-to-month') {
        factors.push('<div class="flex justify-between items-center p-2 bg-red-50 rounded"><span>Month-to-month contract</span><span class="text-red-600 font-semibold">High Risk</span></div>');
    }
    
    if (features.InternetService === 'Fiber optic') {
        factors.push('<div class="flex justify-between items-center p-2 bg-blue-50 rounded"><span>Fiber optic service</span><span class="text-blue-600 font-semibold">Medium Risk</span></div>');
    }
    
    if (features.PaymentMethod === 'Electronic check') {
        factors.push('<div class="flex justify-between items-center p-2 bg-purple-50 rounded"><span>Electronic check payment</span><span class="text-purple-600 font-semibold">Medium Risk</span></div>');
    }
    
    return factors.join('');
}

// Tab switching functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('tab-active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`${tabName}-content`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }
    
    // Add active class to selected tab button
    const selectedButton = document.getElementById(`${tabName}-tab`);
    if (selectedButton) {
        selectedButton.classList.add('tab-active');
    }
    
    // Re-initialize charts if dashboard tab is selected
    if (tabName === 'dashboard') {
        setTimeout(() => {
            initializeCharts();
        }, 100);
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to format percentage
function formatPercentage(value) {
    return `${(value * 100).toFixed(1)}%`;
}
