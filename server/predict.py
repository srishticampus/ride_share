import joblib
import pandas as pd
import sys
import json

try:
    print("Starting predict.py")
    # Load the model and label encoders
    print("Loading ride_price.pkl and encoders")
    model = joblib.load('ride_price.pkl')
    le_time = joblib.load('le_time.pkl')
    le_week = joblib.load('le_week.pkl')
    le_demand = joblib.load('le_demand.pkl')

    # Read input data from command line
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No input data provided'}))
        sys.exit(1)

    print("Raw input args:", sys.argv[1])
    try:
        input_data = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        print(json.dumps({'error': f'Invalid JSON input: {str(e)}'}))
        sys.exit(1)
    print("Parsed input:", input_data)

    # Validate required fields
    required_fields = ['distance_km', 'trip_duration_min', 'time_of_day', 'day_of_week', 'demand_level']
    missing_fields = [field for field in required_fields if field not in input_data]
    if missing_fields:
        print(json.dumps({'error': f'Missing fields: {", ".join(missing_fields)}'}))
        sys.exit(1)

    # Validate numeric inputs
    try:
        distance_km = float(input_data['distance_km'])
        trip_duration_min = float(input_data['trip_duration_min'])
        if distance_km < 0 or trip_duration_min < 0:
            raise ValueError("Distance and duration must be non-negative")
    except ValueError as e:
        print(json.dumps({'error': f'Invalid numeric input: {str(e)}'}))
        sys.exit(1)

    # Validate categorical inputs
    valid_time = le_time.classes_.tolist()
    valid_week = le_week.classes_.tolist()
    valid_demand = le_demand.classes_.tolist()
    if input_data['time_of_day'] not in valid_time:
        print(json.dumps({'error': f'Invalid time_of_day: must be one of {valid_time}'}))
        sys.exit(1)
    if input_data['day_of_week'] not in valid_week:
        print(json.dumps({'error': f'Invalid day_of_week: must be one of {valid_week}'}))
        sys.exit(1)
    if input_data['demand_level'] not in valid_demand:
        print(json.dumps({'error': f'Invalid demand_level: must be one of {valid_demand}'}))
        sys.exit(1)

    # Prepare input for the model
    print("Preparing DataFrame")
    data = pd.DataFrame({
        'distance_km': [distance_km],
        'trip_duration_min': [trip_duration_min],
        'time_of_day': [le_time.transform([input_data['time_of_day']])[0]],
        'day_of_week': [le_week.transform([input_data['day_of_week']])[0]],
        'demand_level': [le_demand.transform([input_data['demand_level']])[0]]
    })

    expected_columns = ['distance_km', 'trip_duration_min', 'time_of_day', 'day_of_week', 'demand_level']
    for col in expected_columns:
        if col not in data.columns:
            data[col] = 0
    data = data[expected_columns]
    print("DataFrame prepared:", data.to_dict())

    # Make prediction
    print("Making prediction")
    predicted_fare = model.predict(data)[0]
    print("Prediction complete:", predicted_fare)

    # Output result
    print(json.dumps({'fare': float(predicted_fare)}))

except Exception as e:
    print(json.dumps({'error': str(e)}))
    sys.exit(1)