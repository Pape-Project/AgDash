#!/usr/bin/env python3
"""
Fetch Farm Size Data Only
Fetches specific farm size metrics and merges them into the existing ag_data.csv
to avoid re-fetching the entire dataset.
"""

import requests
import pandas as pd
from functools import reduce
import time
import os
import json
import logging
from datetime import datetime
from typing import Dict, Optional, List, Tuple
from collections import defaultdict

# --- Setup Logging -----------------------------------------------------------

LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "logs")
os.makedirs(LOG_DIR, exist_ok=True)

log_filename = os.path.join(LOG_DIR, f"fetch_farm_sizes_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_filename),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# --- Constants ---------------------------------------------------------------

API_KEY = "E8A03C0D-5253-3598-B95D-C8B0D7F6F8B2"
BASE_URL = "https://quickstats.nass.usda.gov/api/api_GET/"

COMMON_PARAMS = {
    "key": API_KEY,
    "source_desc": "CENSUS",
    "year": "2022",
    "agg_level_desc": "COUNTY",
    "format": "JSON",
}

TARGET_STATES = ["OR", "WA", "CA", "NV", "ID", "MT"]
MAX_RETRIES = 3
RETRY_DELAY = 5
API_DELAY = 1

# --- Metrics to Fetch --------------------------------------------------------

METRICS = {
    "farms_1_9_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (1.0 TO 9.9 ACRES)"}),
    "farms_10_49_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (10.0 TO 49.9 ACRES)"}),
    "farms_50_69_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (50.0 TO 69.9 ACRES)"}),
    "farms_70_99_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (70.0 TO 99.9 ACRES)"}),
    "farms_100_139_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (100 TO 139 ACRES)"}),
    "farms_140_179_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (140 TO 179 ACRES)"}),
    "farms_180_499_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (180 TO 499 ACRES)"}),
    "farms_500_999_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (500 TO 999 ACRES)"}),
    "farms_1000_1999_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (1,000 TO 1,999 ACRES)"}),
    "farms_2000_plus_acres": ("FARM OPERATIONS - NUMBER OF OPERATIONS", {"domain_desc": "AREA OPERATED", "domaincat_desc": "AREA OPERATED: (2,000 OR MORE ACRES)"}),
}

# --- Helper Functions --------------------------------------------------------

def fetch_with_retry(url: str, params: dict, max_retries: int = MAX_RETRIES) -> Optional[dict]:
    for attempt in range(max_retries):
        try:
            r = requests.get(url, params=params, timeout=30)
            if r.status_code == 200:
                return r.json()
            elif r.status_code == 429:
                time.sleep(RETRY_DELAY * 2)
            else:
                logger.warning(f"HTTP {r.status_code}: {r.text[:200]}")
        except Exception as e:
            logger.warning(f"Request error: {e}")
        
        if attempt < max_retries - 1:
            time.sleep(RETRY_DELAY)
    return None

def fetch_metric_multistate(short_desc: str, metric_name: str, extra_params: dict = None) -> pd.DataFrame:
    all_counties_data = []
    
    for state in TARGET_STATES:
        params = COMMON_PARAMS.copy()
        params["short_desc"] = short_desc
        params["state_alpha"] = state
        if extra_params:
            params.update(extra_params)

        logger.info(f"Fetching {metric_name} for {state}...")
        data = fetch_with_retry(BASE_URL, params)

        if data and "data" in data:
            records = data["data"]
            logger.info(f"  Retrieved {len(records)} records")
            
            for record in records:
                try:
                    val_str = str(record.get("Value", "")).replace(",", "").strip()
                    if val_str and val_str != "(D)":
                        val = float(val_str)
                        all_counties_data.append({
                            "state_name": state,
                            "county_name": record.get("county_name"),
                            "year": 2022,
                            metric_name: val
                        })
                except:
                    pass
        
        time.sleep(API_DELAY)

    if not all_counties_data:
        return pd.DataFrame()

    return pd.DataFrame(all_counties_data)

# --- Main --------------------------------------------------------------------

def main():
    logger.info("Starting Farm Size Data Fetch...")
    
    # 1. Load existing data
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_file = os.path.join(script_dir, "..", "public", "data", "ag_data.csv")
    
    if not os.path.exists(data_file):
        logger.error("Existing ag_data.csv not found!")
        return

    logger.info(f"Loading existing data from {data_file}")
    existing_df = pd.read_csv(data_file)
    logger.info(f"Loaded {len(existing_df)} rows")

    # 2. Fetch new metrics
    frames = [existing_df]
    
    for col_name, (desc, extras) in METRICS.items():
        logger.info(f"\nFetching {col_name}...")
        df = fetch_metric_multistate(desc, col_name, extra_params=extras)
        
        if not df.empty:
            # Drop state_name from merge to avoid duplicates if names differ slightly (e.g. casing)
            # Actually, let's keep it for safety but ensure we match on it
            frames.append(df)
            logger.info(f"✓ Got {len(df)} rows for {col_name}")
        else:
            logger.warning(f"✗ No data for {col_name}")

    # 3. Merge
    logger.info("\nMerging data...")
    
    # Helper to merge
    def merge_dfs(left, right):
        # If column already exists in left (e.g. from previous run), drop it first to update
        cols_to_use = [c for c in right.columns if c not in ["state_name", "county_name", "year"]]
        for col in cols_to_use:
            if col in left.columns:
                left = left.drop(columns=[col])
                
        return pd.merge(left, right, on=["state_name", "county_name", "year"], how="left")

    merged = reduce(merge_dfs, frames)
    
    # 4. Save
    merged.to_csv(data_file, index=False)
    logger.info(f"\n✓ Updated {data_file}")
    logger.info(f"Total Columns: {len(merged.columns)}")
    logger.info(f"New columns should be: {list(METRICS.keys())}")

if __name__ == "__main__":
    main()
