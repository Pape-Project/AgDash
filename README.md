# 🌾 Agricultural Dashboard - Pacific Northwest Region

A minimal, interactive agricultural data visualization dashboard for county-level USDA metrics across Oregon, Washington, California, Idaho, and Nevada.

## 🎯 Features

### Core Functionality
- **Interactive Map**: Leaflet-based map showing the Pacific Northwest region
- **County Data Visualization**: Display detailed agricultural metrics for 150+ counties
- **Natural Language Query**: Simple text-based queries like "highest cropland in Oregon"
- **Advanced Filtering**: Filter by state, cropland acres, and number of farms
- **Flexible Sorting**: Sort counties by various metrics (cropland, farms, irrigation, etc.)
- **County Comparison**: Side-by-side comparison of up to 3 counties with insights
- **Responsive Design**: Works on desktop and mobile devices

### Data Metrics
- Total Farms
- Cropland Acres
- Harvested Cropland
- Irrigated Acres
- Land in Farms
- Land Owned/Rented
- Cropland Percentage
- Irrigation Percentage

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
AgDash/
├── public/
│   └── data/
│       └── ag_data.csv          # USDA county-level agricultural data
├── src/
│   ├── components/              # React components
│   │   ├── ComparisonView.tsx   # Side-by-side county comparison
│   │   ├── CountyDetails.tsx    # Detailed county information
│   │   ├── CountyList.tsx       # Scrollable county list
│   │   ├── CountyMap.tsx        # Interactive Leaflet map
│   │   ├── FilterPanel.tsx      # Filter and sort controls
│   │   └── QueryInput.tsx       # Natural language query input
│   ├── hooks/
│   │   └── useAgData.ts         # CSV data loading and parsing hook
│   ├── types/
│   │   └── ag.ts                # TypeScript type definitions
│   ├── utils/
│   │   ├── dataUtils.ts         # Data filtering, sorting, formatting
│   │   └── queryParser.ts       # Natural language query parser
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Application styles
│   └── main.tsx                 # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔍 How to Use

### 1. Browse Counties
- Use the **Browse** tab to view all counties
- Apply filters by state, cropland acres, or number of farms
- Sort by different metrics (farms, cropland, irrigation, etc.)
- Click on a county in the list to view detailed information

### 2. Natural Language Queries
Enter simple queries in the search box:
- "highest cropland in Oregon"
- "lowest farms in Washington"
- "most irrigated acres in California"
- "counties with over 500000 cropland acres"

### 3. Compare Counties
- Click "Add to Compare" on any county detail view
- Switch to the **Compare** tab to see side-by-side metrics
- View automatic insights (most farms, most cropland, etc.)
- Remove counties from comparison as needed

### 4. Filters & Sorting
- **States**: Select one or more states to filter
- **Cropland Acres**: Set min/max range
- **Number of Farms**: Set min/max range
- **Sort By**: Choose metric and direction (ascending/descending)

## 🛠️ Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **React-Leaflet** - React bindings for Leaflet
- **CSS3** - Styling (no external CSS frameworks)

## 📊 Data Source

The dashboard uses county-level agricultural data from USDA (2022):
- **Location**: `/public/data/ag_data.csv`
- **Format**: CSV with 151 rows (150 counties + header)
- **Columns**: state_name, county_name, year, farms, land_owned_acres, land_rented_acres, cropland_acres, harvested_croplnd_acres, irrigated_acres, land_in_farms_acres

## 🎨 Design Decisions

### No Backend Required
- All data is loaded client-side from CSV
- No external API calls
- Runs entirely in the browser

### Simple Query Parser
- Uses rule-based JavaScript parsing (no AI/ML)
- Supports common query patterns
- Easily extendable with new rules

### Clean & Minimal
- No UI framework dependencies (Bootstrap, Material-UI, etc.)
- Custom CSS with clean, professional design
- Focus on data visualization and usability

## 🔮 Future Enhancements

To extend this dashboard, consider:

1. **Add County GeoJSON**: Display clickable county boundaries on the map
   - Download county shapes from US Census Bureau
   - Color counties based on metrics
   - Enable map-based county selection

2. **More Query Types**: Expand natural language parsing
   - Range queries: "counties between 1000 and 5000 farms"
   - Multiple criteria: "Oregon counties with high irrigation"
   - Aggregate queries: "average cropland by state"

3. **Data Visualizations**: Add charts and graphs
   - Bar charts for comparisons
   - Trend lines over time (if multi-year data available)
   - State-level aggregations

4. **Export Features**: Allow data export
   - CSV export of filtered results
   - PDF reports
   - Share comparison views

5. **Real-time Data**: Connect to live USDA APIs
   - Fetch latest data on demand
   - Historical comparisons
   - Automated updates

## 📝 Code Quality

- **Fully Typed**: Complete TypeScript coverage
- **Well Commented**: All functions and components documented
- **Modular Design**: Reusable components and utilities
- **Clean Code**: Following React best practices
- **Performance**: Memoization for expensive computations

## 🐛 Known Limitations

1. **No County Polygons**: Map shows base layer only
   - Solution: Add county GeoJSON file to `/public/geo/`

2. **Query Parser is Basic**: Limited natural language understanding
   - Solution: Expand parser rules in `utils/queryParser.ts`

3. **Limited to 50 Counties in List**: Performance optimization
   - Solution: Implement virtual scrolling or pagination

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Built with ❤️ for agricultural data visualization**