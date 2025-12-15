# Geocoding Script

This script converts addresses from a CSV file to latitude/longitude coordinates using the Geocoding API.

## Setup

1. **Install dependencies** (if not already installed):
   ```bash
   pip install pandas requests
   ```

2. **Prepare your CSV file**:
   - Name it `locations.csv` and place it in the project root (or update `INPUT_FILE` in the script)
   - Make sure it has the following columns (you can customize the column names in `COLUMN_MAPPING`):
     - `Street Address`
     - `City`
     - `State`
     - `Zip`
     - `Country`

3. **API Key is already configured** in `.env.local` ✓

## Usage

Run the script from the project root:

```bash
python3 scripts/geocode_locations.py
```

Or if you need to load environment variables:

```bash
export $(cat .env.local | xargs) && python3 scripts/geocode_locations.py
```

## Output

The script will create `locations_geocoded.csv` with two new columns:
- `Latitude`
- `Longitude`

## Customization

### Different CSV Column Names?

Edit the `COLUMN_MAPPING` in the script:

```python
COLUMN_MAPPING = {
    'street': 'Your Street Column Name',
    'city': 'Your City Column Name',
    'state': 'Your State Column Name',
    'postalcode': 'Your Zip Column Name',
    'country': 'Your Country Column Name'
}
```

### Different Input/Output Files?

Change these variables at the top of the script:

```python
INPUT_FILE = 'your_input_file.csv'
OUTPUT_FILE = 'your_output_file.csv'
```

## Rate Limits

- The script respects rate limits by waiting 1.1 seconds between requests
- If you hit a rate limit (429 error), the script will wait 5 seconds and retry
- For 100 locations, expect ~2 minutes of processing time

## API Information

- Provider: geocode.maps.co
- Free tier: 1 request per second
- Your API key is stored securely in `.env.local` (not committed to git)
