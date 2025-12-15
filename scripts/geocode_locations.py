import pandas as pd
import requests
import time
import os
from pathlib import Path

# --- CONFIGURATION ---
INPUT_FILE = 'locations.csv'
OUTPUT_FILE = 'locations_geocoded.csv'

# Get API key from environment variable (safer than hardcoding)
API_KEY = os.getenv('GEOCODING_API_KEY')

if not API_KEY:
    raise ValueError("GEOCODING_API_KEY environment variable not set. Please add it to your .env.local file")

# Map your CSV headers to the API parameters here:
# Use None if you don't have that column.
COLUMN_MAPPING = {
    'street': 'Street Address',  # e.g., if your CSV column is named "Street Address"
    'city': 'City',
    'state': 'State',
    'postalcode': 'Zip',
    'country': 'Country'
}
# ---------------------

def get_lat_long_structured(row):
    """
    Geocode a single row using the geocode.maps.co API
    """
    base_url = "https://geocode.maps.co/search"

    # Build the parameters dictionary dynamically
    params = {'api_key': API_KEY}
    for api_param, csv_header in COLUMN_MAPPING.items():
        if csv_header and csv_header in row and pd.notna(row[csv_header]):
            params[api_param] = row[csv_header]

    # If no structured data found, skip
    if len(params) <= 1:  # Only api_key is present
        return None, None

    try:
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data and isinstance(data, list) and len(data) > 0:
                return data[0].get('lat'), data[0].get('lon')
        elif response.status_code == 429:
            print("Rate limit hit! Waiting 5 seconds...")
            time.sleep(5)
            # Retry once
            response = requests.get(base_url, params=params)
            if response.status_code == 200:
                data = response.json()
                if data and isinstance(data, list) and len(data) > 0:
                    return data[0].get('lat'), data[0].get('lon')
        else:
            print(f"API returned status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

    return None, None

def main():
    # Check if input file exists
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found!")
        print("Please place your locations.csv file in the current directory.")
        return

    df = pd.read_csv(INPUT_FILE)

    # Check if required columns exist
    missing_cols = [col for col in COLUMN_MAPPING.values() if col and col not in df.columns]
    if missing_cols:
        print(f"Warning: The following columns are missing from your CSV: {missing_cols}")
        print(f"Available columns: {list(df.columns)}")
        print("\nPlease update COLUMN_MAPPING in the script to match your CSV headers.")
        return

    df['Latitude'] = None
    df['Longitude'] = None

    total_rows = len(df)
    print(f"Starting geocoding for {total_rows} locations...")
    print("This will take approximately {:.1f} minutes (1+ second per location)".format(total_rows * 1.1 / 60))

    successful = 0
    failed = 0

    for index, row in df.iterrows():
        print(f"Processing row {index + 1}/{total_rows}...", end=' ')
        lat, lon = get_lat_long_structured(row)

        df.at[index, 'Latitude'] = lat
        df.at[index, 'Longitude'] = lon

        if lat and lon:
            print(f"✓ ({lat}, {lon})")
            successful += 1
        else:
            print("✗ No results")
            failed += 1

        # REQUIRED: 1+ second delay to respect rate limits
        time.sleep(1.1)

    df.to_csv(OUTPUT_FILE, index=False)
    print("\n" + "="*50)
    print(f"Done! Results saved to {OUTPUT_FILE}")
    print(f"Successful: {successful}/{total_rows}")
    print(f"Failed: {failed}/{total_rows}")
    print("="*50)

if __name__ == "__main__":
    main()
