const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'public/data/ag_data.csv');
const fileContent = fs.readFileSync(csvPath, 'utf-8');
const lines = fileContent.split('\n');

const headers = lines[0].split(',').map(h => h.trim().replace(/^\ufeff/, ''));
const headerMap = new Map();
headers.forEach((h, i) => headerMap.set(h, i));

console.log('Headers found:', headers);
console.log('Index of farms_50_69_acres:', headerMap.get('farms_50_69_acres'));

const columnMapping = {
    farms50to69Acres: 'farms_50_69_acres',
    farms70to99Acres: 'farms_70_99_acres',
    farms100to139Acres: 'farms_100_139_acres',
    farms140to179Acres: 'farms_140_179_acres',
    farms1to9Acres: 'farms_1_9_acres',
    farms10to49Acres: 'farms_10_49_acres',
    farms: 'farms'
};

// Check Alameda (should be line 1 if header is 0)
const line = lines[1];
const values = line.split(',');

const parseNumber = (columnKey) => {
    const csvHeader = columnMapping[columnKey];
    const index = headerMap.get(csvHeader);

    if (index === undefined) {
        console.log(`Column ${csvHeader} not found in header map`);
        return null;
    }

    const value = values[index];
    if (!value) return null;

    const trimmed = value.trim();
    if (trimmed === '') return null;

    const parsed = parseFloat(trimmed);
    return isNaN(parsed) ? null : parsed;
};

const county = {
    farms: parseNumber('farms'),
    farms1to9Acres: parseNumber('farms1to9Acres'),
    farms10to49Acres: parseNumber('farms10to49Acres'),
    farms50to69Acres: parseNumber('farms50to69Acres'),
    farms70to99Acres: parseNumber('farms70to99Acres'),
    farms100to139Acres: parseNumber('farms100to139Acres'),
    farms140to179Acres: parseNumber('farms140to179Acres'),
};

console.log('Parsed County Data (Alameda):', county);

// Calculate Aggregated Farm Sizes
const farms50to179Acres = [
    county.farms50to69Acres,
    county.farms70to99Acres,
    county.farms100to139Acres,
    county.farms140to179Acres
].reduce((sum, val) => (val !== null ? (sum || 0) + val : sum), null);

console.log('Calculated farms50to179Acres:', farms50to179Acres);

let farms180PlusAcres = null;
if (county.farms !== null) {
    const smallAndMedium = (county.farms1to9Acres || 0) +
        (county.farms10to49Acres || 0) +
        (farms50to179Acres || 0);
    farms180PlusAcres = Math.max(0, county.farms - smallAndMedium);
}

console.log('Calculated farms180PlusAcres:', farms180PlusAcres);
