// src/App.tsx
import "./App.css";
import { CountyMap } from "./components/CountyMap";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left: Map */}
      <div style={{ flex: 2 }}>
        <CountyMap />
      </div>

      {/* Right: Sidebar */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          borderLeft: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h1>Ag Dashboard (MVP)</h1>
        <p>Click on the map to explore. Data + search will go here.</p>
      </div>
    </div>
  );
}

export default App;
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
