from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

app = Flask(__name__)
CORS(app)

# Define fuzzy variables
CurrAgeGroup = ctrl.Antecedent(np.arange(0, 50, 1), 'CurrAgeGroup')
Place_of_Residence = ctrl.Antecedent(np.arange(1, 3, 1), 'Place_of_Residence')
Education_level = ctrl.Antecedent(np.arange(0, 4, 1), 'Education_level')
Wealth_index = ctrl.Antecedent(np.arange(1, 6, 1), 'Wealth_index')
marital_status = ctrl.Antecedent(np.arange(0, 6, 1), 'marital_status')
Distance_to_health = ctrl.Antecedent(np.arange(1, 4, 1), 'Distance_to_health')
Frequency_media_use = ctrl.Antecedent(np.arange(0, 4, 1), 'Frequency_media_use')
Frequency_of_using_internet = ctrl.Antecedent(np.arange(0, 4, 1), 'Frequency_of_using_internet')
Antenatal_visits = ctrl.Antecedent(np.arange(0, 15, 1), 'Antenatal_visits')
Postnatal_visits = ctrl.Antecedent(np.arange(0, 15, 1), 'Postnatal_visits')

# Define the 'risk' fuzzy variable
risk = ctrl.Consequent(np.arange(0, 11, 1), 'Risk')

# Age fuzzy sets
CurrAgeGroup['Young'] = fuzz.trimf(CurrAgeGroup.universe, [0, 0, 25])
CurrAgeGroup['Middle-aged'] = fuzz.trimf(CurrAgeGroup.universe, [20, 30, 40])
CurrAgeGroup['Old'] = fuzz.trimf(CurrAgeGroup.universe, [30, 50, 50])

# Place of Residence fuzzy sets
Place_of_Residence['Urban'] = fuzz.trimf(Place_of_Residence.universe, [1, 1, 2])
Place_of_Residence['Rural'] = fuzz.trimf(Place_of_Residence.universe, [1, 2, 2])

# Education level fuzzy sets
Education_level['Low'] = fuzz.trimf(Education_level.universe, [0, 0, 1])
Education_level['Medium'] = fuzz.trimf(Education_level.universe, [1, 2, 2])
Education_level['High'] = fuzz.trimf(Education_level.universe, [2, 3, 3])

# Wealth index fuzzy sets
Wealth_index['Poor'] = fuzz.trimf(Wealth_index.universe, [1, 1, 3])
Wealth_index['Middle'] = fuzz.trimf(Wealth_index.universe, [2, 3, 4])
Wealth_index['Rich'] = fuzz.trimf(Wealth_index.universe, [3, 5, 5])

# Marital status fuzzy sets
marital_status['Single'] = fuzz.trimf(marital_status.universe, [0, 0, 1])
marital_status['Married'] = fuzz.trimf(marital_status.universe, [1, 1, 2])
marital_status['Living with partner'] = fuzz.trimf(marital_status.universe, [1, 2, 2])
marital_status['Divorced'] = fuzz.trimf(marital_status.universe, [3, 4, 5])
marital_status['Widowed'] = fuzz.trimf(marital_status.universe, [4, 5, 5])

# Distance to health fuzzy sets
Distance_to_health['Very Far'] = fuzz.trimf(Distance_to_health.universe, [1, 2, 3])
Distance_to_health['Far'] = fuzz.trimf(Distance_to_health.universe, [1, 1, 2])
Distance_to_health['Close'] = fuzz.trimf(Distance_to_health.universe, [2, 2, 3])

# Frequency of media use fuzzy sets
Frequency_media_use['Low'] = fuzz.trimf(Frequency_media_use.universe, [0, 0, 1])
Frequency_media_use['Medium'] = fuzz.trimf(Frequency_media_use.universe, [1, 2, 2])
Frequency_media_use['High'] = fuzz.trimf(Frequency_media_use.universe, [2, 3, 3])

# Frequency of using internet fuzzy sets
Frequency_of_using_internet['Never'] = fuzz.trimf(Frequency_of_using_internet.universe, [0, 0, 1])
Frequency_of_using_internet['Occasional'] = fuzz.trimf(Frequency_of_using_internet.universe, [1, 2, 2])
Frequency_of_using_internet['Regular'] = fuzz.trimf(Frequency_of_using_internet.universe, [2, 3, 3])

# Antenatal visits fuzzy sets
Antenatal_visits['Low'] = fuzz.trimf(Antenatal_visits.universe, [0, 0, 5])
Antenatal_visits['Medium'] = fuzz.trimf(Antenatal_visits.universe, [5, 6, 8])
Antenatal_visits['High'] = fuzz.trimf(Antenatal_visits.universe, [8, 12, 12])

# Postnatal visits fuzzy sets
Postnatal_visits['Low'] = fuzz.trimf(Postnatal_visits.universe, [0, 0, 3])
Postnatal_visits['Medium'] = fuzz.trimf(Postnatal_visits.universe, [3, 4, 6])
Postnatal_visits['High'] = fuzz.trimf(Postnatal_visits.universe, [6, 8, 10])

# Risk fuzzy sets
risk['Low'] = fuzz.trimf(risk.universe, [0, 0, 5])
risk['High'] = fuzz.trimf(risk.universe, [5, 10, 10])

# Define rules
# Age & Education Rules
rule1 = ctrl.Rule(CurrAgeGroup['Young'] & Education_level['Low'], risk['High'])
rule2 = ctrl.Rule(CurrAgeGroup['Young'] & Education_level['Medium'], risk['High'])
rule3 = ctrl.Rule(CurrAgeGroup['Young'] & Education_level['High'], risk['Low'])
rule4 = ctrl.Rule(CurrAgeGroup['Middle-aged'] & Education_level['Low'], risk['High'])
rule5 = ctrl.Rule(CurrAgeGroup['Middle-aged'] & Education_level['Medium'], risk['High'])
rule6 = ctrl.Rule(CurrAgeGroup['Middle-aged'] & Education_level['High'], risk['Low'])
rule7 = ctrl.Rule(CurrAgeGroup['Old'] & Education_level['Low'], risk['High'])
rule8 = ctrl.Rule(CurrAgeGroup['Old'] & Education_level['Medium'], risk['High'])
rule9 = ctrl.Rule(CurrAgeGroup['Old'] & Education_level['High'], risk['Low'])

# Wealth & Distance to Health Rules
rule10 = ctrl.Rule(Wealth_index['Poor'] & Distance_to_health['Very Far'], risk['High'])
rule11 = ctrl.Rule(Wealth_index['Poor'] & Distance_to_health['Far'], risk['High'])
rule12 = ctrl.Rule(Wealth_index['Poor'] & Distance_to_health['Close'], risk['High'])
rule13 = ctrl.Rule(Wealth_index['Middle'] & Distance_to_health['Very Far'], risk['High'])
rule14 = ctrl.Rule(Wealth_index['Middle'] & Distance_to_health['Far'], risk['High'])
rule15 = ctrl.Rule(Wealth_index['Middle'] & Distance_to_health['Close'], risk['Low'])
rule16 = ctrl.Rule(Wealth_index['Rich'] & Distance_to_health['Very Far'], risk['High'])
rule17 = ctrl.Rule(Wealth_index['Rich'] & Distance_to_health['Far'], risk['Low'])
rule18 = ctrl.Rule(Wealth_index['Rich'] & Distance_to_health['Close'], risk['Low'])

# Marital Status & Education Rules
rule19 = ctrl.Rule(marital_status['Single'] & Education_level['Low'], risk['High'])
rule20 = ctrl.Rule(marital_status['Single'] & Education_level['Medium'], risk['High'])
rule21 = ctrl.Rule(marital_status['Single'] & Education_level['High'], risk['Low'])
rule22 = ctrl.Rule(marital_status['Married'] & Education_level['Low'], risk['High'])
rule23 = ctrl.Rule(marital_status['Married'] & Education_level['Medium'], risk['High'])
rule24 = ctrl.Rule(marital_status['Married'] & Education_level['High'], risk['Low'])
rule25 = ctrl.Rule(marital_status['Divorced'] & Education_level['Low'], risk['High'])
rule26 = ctrl.Rule(marital_status['Divorced'] & Education_level['Medium'], risk['High'])
rule27 = ctrl.Rule(marital_status['Divorced'] & Education_level['High'], risk['Low'])
rule28 = ctrl.Rule(marital_status['Widowed'] & Education_level['Low'], risk['High'])
rule29 = ctrl.Rule(marital_status['Widowed'] & Education_level['Medium'], risk['High'])
rule30 = ctrl.Rule(marital_status['Widowed'] & Education_level['High'], risk['Low'])

# Antenatal & Postnatal Visits Rules
rule31 = ctrl.Rule(Antenatal_visits['Low'], risk['High'])
rule32 = ctrl.Rule(Antenatal_visits['Medium'], risk['High'])
rule33 = ctrl.Rule(Antenatal_visits['High'], risk['Low'])
rule34 = ctrl.Rule(Postnatal_visits['Low'], risk['High'])
rule35 = ctrl.Rule(Postnatal_visits['Medium'], risk['High'])
rule36 = ctrl.Rule(Postnatal_visits['High'], risk['Low'])

# Media Use & Wealth Rules
rule37 = ctrl.Rule(Frequency_media_use['Low'] & Wealth_index['Poor'], risk['High'])
rule38 = ctrl.Rule(Frequency_media_use['Low'] & Wealth_index['Middle'], risk['High'])
rule39 = ctrl.Rule(Frequency_media_use['Low'] & Wealth_index['Rich'], risk['Low'])
rule40 = ctrl.Rule(Frequency_media_use['Medium'] & Wealth_index['Poor'], risk['High'])
rule41 = ctrl.Rule(Frequency_media_use['Medium'] & Wealth_index['Middle'], risk['High'])
rule42 = ctrl.Rule(Frequency_media_use['Medium'] & Wealth_index['Rich'], risk['Low'])
rule43 = ctrl.Rule(Frequency_media_use['High'] & Wealth_index['Poor'], risk['High'])
rule44 = ctrl.Rule(Frequency_media_use['High'] & Wealth_index['Middle'], risk['Low'])
rule45 = ctrl.Rule(Frequency_media_use['High'] & Wealth_index['Rich'], risk['Low'])

# Internet Use & Distance to Health Rules
rule46 = ctrl.Rule(Frequency_of_using_internet['Never'] & Distance_to_health['Very Far'], risk['High'])
rule47 = ctrl.Rule(Frequency_of_using_internet['Never'] & Distance_to_health['Far'], risk['High'])
rule48 = ctrl.Rule(Frequency_of_using_internet['Never'] & Distance_to_health['Close'], risk['High'])
rule49 = ctrl.Rule(Frequency_of_using_internet['Occasional'] & Distance_to_health['Very Far'], risk['High'])
rule50 = ctrl.Rule(Frequency_of_using_internet['Occasional'] & Distance_to_health['Far'], risk['High'])
rule51 = ctrl.Rule(Frequency_of_using_internet['Occasional'] & Distance_to_health['Close'], risk['High'])
rule52 = ctrl.Rule(Frequency_of_using_internet['Regular'] & Distance_to_health['Very Far'], risk['High'])
rule53 = ctrl.Rule(Frequency_of_using_internet['Regular'] & Distance_to_health['Far'], risk['Low'])
rule54 = ctrl.Rule(Frequency_of_using_internet['Regular'] & Distance_to_health['Close'], risk['Low'])

# Place of Residence & Education Rules
rule55 = ctrl.Rule(Place_of_Residence['Urban'] & Education_level['Low'], risk['High'])
rule56 = ctrl.Rule(Place_of_Residence['Urban'] & Education_level['Medium'], risk['High'])
rule57 = ctrl.Rule(Place_of_Residence['Urban'] & Education_level['High'], risk['Low'])
rule58 = ctrl.Rule(Place_of_Residence['Rural'] & Education_level['Low'], risk['High'])
rule59 = ctrl.Rule(Place_of_Residence['Rural'] & Education_level['Medium'], risk['High'])
rule60 = ctrl.Rule(Place_of_Residence['Rural'] & Education_level['High'], risk['Low'])

# Create control system
risk_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9, rule10, rule11, rule12, rule13,
                               rule14, rule15, rule16, rule17, rule18, rule19, rule20, rule21, rule22, rule23, rule24, 
                               rule25, rule26, rule27, rule28, rule29, rule30, rule31, rule32, rule33, rule34, rule35, 
                               rule36, rule37, rule38, rule39, rule40, rule41, rule42, rule43, rule44, rule45, rule46, 
                               rule47, rule48, rule49, rule50, rule51, rule52, rule53, rule54, rule55, rule56, rule57, 
                               rule58, rule59, rule60])

risk_prediction = ctrl.ControlSystemSimulation(risk_ctrl)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "MomCare ML API is running",
        "status": "healthy",
        "version": "1.0"
    })

@app.route('/api', methods=['GET'])
def api_home():
    return home()

@app.route('/api/predict', methods=['POST'])
def api_predict():
    return predict()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        required_fields = [
            'CurrAgeGroup', 'Place_of_Residence', 'Education_level',
            'Wealth_index', 'marital_status', 'Distance_to_health',
            'Frequency_media_use', 'Frequency_of_using_internet',
            'Antenatal_visits', 'Postnatal_visits'
        ]
        
        # Check if all required fields are present
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400

        # Reset the system for new prediction
        risk_prediction.reset()
        
        # Set input values
        for field in required_fields:
            risk_prediction.input[field] = float(data[field])

        # Compute risk
        try:
            risk_prediction.compute()
        except Exception as e:
            return jsonify({"error": f"Computation error: {str(e)}"}), 500

        if 'Risk' in risk_prediction.output:
            risk_value = float(risk_prediction.output['Risk'])
            risk_category = 'Low' if risk_value <= 5 else 'High'

            return jsonify({
                "status": "success",
                "predicted_risk": risk_category,
                "risk_value": risk_value,
                "input_data": data
            })

        return jsonify({"error": "Risk computation failed"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500 