import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./App.css";

// ==================== CONSTANTS ====================
// ==================== CONSTANTS ====================
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const PLANET_IMAGES = [
  "planeta1.png", "planeta2.png", "planeta3.png", "planeta4.png",
  "planeta5.png", "planeta8.png", "planeta9.png", "planeta10.png",
];

// ==================== UTILITY FUNCTIONS ====================
const getRandomPlanetImage = (index) => {
  return `/${PLANET_IMAGES[index % PLANET_IMAGES.length]}`;
};

// ==================== LOADING SCREEN ====================
const LoadingScreen = ({ isLoading }) => {
  return (
    <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loading-logo">EXOSKY</div>
      <div className="loading-spinner"></div>
      <div className="loading-text">Exploring the cosmos...</div>
    </div>
  );
};

// ==================== STAR BACKGROUND ====================
const StarField = () => {
  const stars = useMemo(() => {
    const starArray = [];
    for (let i = 0; i < 200; i++) {
      const size = Math.random() < 0.6 ? 'small' : Math.random() < 0.85 ? 'medium' : 'large';
      starArray.push({
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${2 + Math.random() * 4}s`,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
    return starArray;
  }, []);

  return (
    <div className="star-field">
      <div className="nebula-bg"></div>
      <div className="star-layer">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star ${star.size}`}
            style={{
              left: star.left,
              top: star.top,
              '--delay': star.delay,
              '--duration': star.duration,
              '--base-opacity': star.opacity,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== HERO SECTION ====================
const HeroSection = ({ onExplore, stats }) => {
  return (
    <section className="hero-section">
      <h1 className="hero-title">EXOSKY</h1>
      <p className="hero-subtitle">
        Explore the night sky from the perspective of distant exoplanets.
        See how the stars would appear from worlds light-years away.
      </p>

      <div className="hero-stats">
        <div className="stat-item fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="stat-value">{stats.exoplanets?.toLocaleString() || '5,700+'}</span>
          <span className="stat-label">Exoplanets</span>
        </div>
        <div className="stat-item fade-in" style={{ animationDelay: '0.4s' }}>
          <span className="stat-value">{stats.stars?.toLocaleString() || '119,000+'}</span>
          <span className="stat-label">Stars</span>
        </div>
        <div className="stat-item fade-in" style={{ animationDelay: '0.6s' }}>
          <span className="stat-value">4.24</span>
          <span className="stat-label">Light Years (Nearest)</span>
        </div>
      </div>

      <div className="hero-cta fade-in" style={{ animationDelay: '0.8s' }}>
        <button className="btn btn-primary" onClick={onExplore}>
          🚀 Explore Exoplanets
        </button>
        <button className="btn btn-secondary" onClick={() => window.open('https://exoplanetarchive.ipac.caltech.edu/', '_blank')}>
          📚 Learn More
        </button>
      </div>
    </section>
  );
};

// ==================== PLANET CARD ====================
const PlanetCard = ({ planet, index, onClick }) => {
  return (
    <div className="planet-card fade-in" style={{ animationDelay: `${index * 0.1}s` }} onClick={onClick}>
      <img
        src={getRandomPlanetImage(index)}
        alt={planet.name}
        className="planet-card-image"
      />
      <h3 className="planet-card-name">{planet.name}</h3>
      <div className="planet-card-info">
        <span className="planet-card-distance">
          🌌 {planet.distance_ly?.toFixed(1)} ly
        </span>
        <span>⭐ {planet.host_star}</span>
      </div>
    </div>
  );
};

// ==================== EXPLORER SECTION ====================
const ExplorerSection = ({ planets, onSelectPlanet, searchQuery, onSearchChange }) => {
  const filteredPlanets = useMemo(() => {
    if (!searchQuery) return planets.slice(0, 50);
    return planets.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.host_star?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 50);
  }, [planets, searchQuery]);

  return (
    <section className="explorer-section" id="explorer">
      <div className="explorer-header">
        <h2 className="section-title">🪐 Choose Your Destination</h2>
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search exoplanets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="planet-grid">
        {filteredPlanets.map((planet, index) => (
          <PlanetCard
            key={planet.name}
            planet={planet}
            index={index}
            onClick={() => onSelectPlanet(planet)}
          />
        ))}
      </div>
    </section>
  );
};

// ==================== SKY VIEW WITH CONSTELLATION DRAWING ====================
const SkyView = ({ planet, exoskyData, onClose, isLoading }) => {
  const containerRef = useRef(null);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedStar, setSelectedStar] = useState(null);
  const [constellationLines, setConstellationLines] = useState([]);
  const [constellationName, setConstellationName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [savedConstellations, setSavedConstellations] = useState([]);

  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1000 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 60
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Convert RA/Dec to screen coordinates
  const raDecToScreen = useCallback((ra, dec) => {
    const x = (ra / 360) * dimensions.width;
    const y = ((90 - dec) / 180) * dimensions.height;
    return { x, y };
  }, [dimensions]);

  // Get star position by ID
  const getStarPosition = useCallback((starId) => {
    const star = exoskyData?.stars?.find(s => s.id === starId);
    if (!star) return null;
    return raDecToScreen(star.ra, star.dec);
  }, [exoskyData, raDecToScreen]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Handle star click for drawing
  const handleStarClick = (star) => {
    if (!isDrawing) return;

    if (!selectedStar) {
      // First star selected
      setSelectedStar(star);
    } else {
      // Second star selected - create line
      if (selectedStar.id !== star.id) {
        setConstellationLines(prev => [
          ...prev,
          { from: selectedStar.id, to: star.id, fromPos: raDecToScreen(selectedStar.ra, selectedStar.dec), toPos: raDecToScreen(star.ra, star.dec) }
        ]);
      }
      setSelectedStar(star); // Keep last star selected for chaining
    }
  };

  // Reset drawing
  const handleReset = () => {
    setConstellationLines([]);
    setSelectedStar(null);
    setSavedConstellations([]);
    setConstellationName('');
  };

  // Save constellation with name
  const handleSaveConstellation = () => {
    if (constellationLines.length > 0 && constellationName.trim()) {
      setSavedConstellations(prev => [
        ...prev,
        { name: constellationName, lines: [...constellationLines] }
      ]);
      setShowNameModal(false);
      setConstellationName('');
      // Don't clear lines - keep them visible
    }
  };

  // Export as image
  const handleExport = async () => {
    if (!containerRef.current) return;

    try {
      // Use html2canvas if available, otherwise create SVG export
      const element = containerRef.current;

      // Create a canvas
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');

      // Fill background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      exoskyData?.stars?.forEach(star => {
        const pos = raDecToScreen(star.ra, star.dec);
        const size = Math.max(2, star.size * 1.5);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = star.color || '#fff';
        ctx.fill();

        // Add glow
        ctx.shadowColor = star.color || '#fff';
        ctx.shadowBlur = size * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw constellation lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      constellationLines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.fromPos.x, line.fromPos.y);
        ctx.lineTo(line.toPos.x, line.toPos.y);
        ctx.stroke();
      });

      // Draw constellation names
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
      ctx.shadowBlur = 10;
      savedConstellations.forEach(constellation => {
        if (constellation.lines.length > 0) {
          const firstLine = constellation.lines[0];
          ctx.fillText(constellation.name, firstLine.fromPos.x + 10, firstLine.fromPos.y - 15);
        }
      });
      ctx.shadowBlur = 0;

      // Add watermark
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(`EXOSKY - View from ${planet?.name || 'Unknown'}`, 20, dimensions.height - 20);

      // Generate filename
      const planetName = (planet?.name || 'exoplanet').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `exosky-${planetName}-${timestamp}.png`;

      // Download using blob for better compatibility
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Error creating image');
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');

    } catch (error) {
      console.error('Export error:', error);
      alert('Export feature requires the page to be fully loaded.');
    }
  };

  if (isLoading) {
    return (
      <div className="sky-view">
        <div className="sky-header">
          <h2 className="sky-title">Loading sky from {planet?.name}...</h2>
          <button className="btn btn-secondary" onClick={onClose}>← Back</button>
        </div>
        <div className="sky-canvas-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="sky-view">
      <div className="sky-header">
        <h2 className="sky-title">
          ✨ Sky from {planet?.name} • {exoskyData?.pagination?.total?.toLocaleString()} visible stars
        </h2>
        <button className="btn btn-secondary" onClick={onClose}>← Back to Explorer</button>
      </div>

      <div
        className="sky-canvas-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
      >
        {/* SVG for constellation lines */}
        <svg
          className="constellation-svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          {/* Draw saved constellation lines */}
          {constellationLines.map((line, idx) => (
            <line
              key={idx}
              x1={line.fromPos.x}
              y1={line.fromPos.y}
              x2={line.toPos.x}
              y2={line.toPos.y}
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}

          {/* Draw line from selected star to cursor */}
          {isDrawing && selectedStar && (
            <line
              x1={raDecToScreen(selectedStar.ra, selectedStar.dec).x}
              y1={raDecToScreen(selectedStar.ra, selectedStar.dec).y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="rgba(139, 92, 246, 0.5)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          {/* Constellation names */}
          {savedConstellations.map((constellation, idx) => {
            if (constellation.lines.length === 0) return null;
            const firstLine = constellation.lines[0];
            return (
              <text
                key={idx}
                x={firstLine.fromPos.x + 10}
                y={firstLine.fromPos.y - 10}
                fill="rgba(255, 255, 255, 0.9)"
                fontSize="14"
                fontFamily="Inter, sans-serif"
                style={{ textShadow: '0 0 10px rgba(139, 92, 246, 0.8)' }}
              >
                {constellation.name}
              </text>
            );
          })}
        </svg>

        {/* Stars */}
        {exoskyData?.stars?.map((star, index) => {
          const pos = raDecToScreen(star.ra, star.dec);
          const size = Math.max(2, star.size * 1.5);
          const isSelected = selectedStar?.id === star.id;

          return (
            <div
              key={star.id || index}
              className={`sky-star ${star.is_sun ? 'sun-marker' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${size}px`,
                height: `${size}px`,
                background: star.is_sun ? undefined : star.color,
                boxShadow: isSelected
                  ? `0 0 20px var(--accent-glow), 0 0 40px var(--accent-glow)`
                  : star.is_sun ? undefined : `0 0 ${size * 2}px ${star.color}`,
                border: isSelected ? '2px solid var(--accent-glow)' : 'none',
                zIndex: isSelected ? 100 : 1,
              }}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
            />
          );
        })}

        {/* Info Panel */}
        <div className="info-panel">
          <h3 className="info-panel-title">{planet?.name}</h3>
          <div className="info-panel-stats">
            <div className="info-stat">
              <span className="info-stat-label">Distance from Earth</span>
              <span className="info-stat-value">{exoskyData?.exoplanet?.distance_ly} ly</span>
            </div>
            <div className="info-stat">
              <span className="info-stat-label">Visible Stars</span>
              <span className="info-stat-value">{exoskyData?.pagination?.total?.toLocaleString()}</span>
            </div>
            <div className="info-stat">
              <span className="info-stat-label">Constellation Lines</span>
              <span className="info-stat-value">{constellationLines.length}</span>
            </div>
          </div>

          {exoskyData?.sun && (
            <div className="sun-indicator">
              <div className="sun-indicator-title">☀️ Our Sun is visible!</div>
              <div className="sun-indicator-subtitle">
                Magnitude: {exoskyData.sun.mag} • Position: {exoskyData.sun.ra.toFixed(1)}°, {exoskyData.sun.dec.toFixed(1)}°
              </div>
            </div>
          )}

          {isDrawing && (
            <div className="draw-instructions">
              <p>🎨 <strong>Drawing Mode Active</strong></p>
              <p>Click on stars to connect them with lines. Chain multiple stars to create your constellation.</p>
            </div>
          )}
        </div>

        {/* Star tooltip */}
        {hoveredStar && (
          <div
            className="star-tooltip"
            style={{ left: mousePos.x + 15, top: mousePos.y - 10 }}
          >
            <div className="star-tooltip-name">
              {hoveredStar.is_sun ? '☀️ ' : '⭐ '}{hoveredStar.name}
            </div>
            <div className="star-tooltip-mag">Magnitude: {hoveredStar.mag}</div>
            {isDrawing && <div className="star-tooltip-hint">Click to {selectedStar ? 'connect' : 'start'}</div>}
          </div>
        )}

        {/* Drawing tools */}
        <div className="drawing-tools">
          <button
            className={`tool-btn ${isDrawing ? 'active' : ''}`}
            onClick={() => { setIsDrawing(!isDrawing); setSelectedStar(null); }}
          >
            ✏️ {isDrawing ? 'Stop Drawing' : 'Draw'}
          </button>
          <button
            className="tool-btn"
            onClick={() => setShowNameModal(true)}
            disabled={constellationLines.length === 0}
          >
            💫 Name
          </button>
          <button className="tool-btn" onClick={handleReset}>
            🔄 Reset
          </button>
          <button className="tool-btn" onClick={handleExport}>
            💾 Export
          </button>
        </div>
      </div>

      {/* Name Constellation Modal */}
      {showNameModal && (
        <div className="modal-overlay" onClick={() => setShowNameModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Name Your Constellation</h3>
            <p>Give a name to your creation from {planet?.name}'s sky</p>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter constellation name..."
              value={constellationName}
              onChange={(e) => setConstellationName(e.target.value)}
              autoFocus
            />
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowNameModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveConstellation}
                disabled={!constellationName.trim()}
              >
                Save Constellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN APP ====================
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('home'); // 'home', 'explorer', 'sky'
  const [planets, setPlanets] = useState([]);
  const [nearbyPlanets, setNearbyPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [exoskyData, setExoskyData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({});
  const [skyLoading, setSkyLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch nearby planets and stats in parallel
        const [nearbyRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/nearby?limit=50`),
          fetch(`${API_BASE}/stats`)
        ]);

        const nearbyData = await nearbyRes.json();
        const statsData = await statsRes.json();

        setNearbyPlanets(nearbyData);
        setPlanets(nearbyData);
        setStats({
          exoplanets: statsData.total_exoplanets,
          stars: statsData.total_stars
        });

        // Simulate minimum loading time for effect
        setTimeout(() => setIsLoading(false), 1500);
      } catch (error) {
        console.error('Error fetching data:', error);
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    fetchData();
  }, []);

  // Search planets
  useEffect(() => {
    if (!searchQuery) {
      setPlanets(nearbyPlanets);
      return;
    }

    const searchPlanets = async () => {
      try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(searchQuery)}&limit=50`);
        const data = await res.json();
        setPlanets(data.results || []);
      } catch (error) {
        console.error('Error searching:', error);
      }
    };

    const debounce = setTimeout(searchPlanets, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, nearbyPlanets]);

  // Handle planet selection
  const handleSelectPlanet = async (planet) => {
    setSelectedPlanet(planet);
    setView('sky');
    setSkyLoading(true);

    try {
      const res = await fetch(`${API_BASE}/exosky/${encodeURIComponent(planet.name)}?limit=1000`);
      const data = await res.json();
      setExoskyData(data);
    } catch (error) {
      console.error('Error fetching exosky:', error);
    } finally {
      setSkyLoading(false);
    }
  };

  const handleExplore = () => {
    setView('explorer');
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCloseSky = () => {
    setView('explorer');
    setSelectedPlanet(null);
    setExoskyData(null);
  };

  return (
    <div className="app-container">
      <LoadingScreen isLoading={isLoading} />
      <StarField />

      {view !== 'sky' && (
        <>
          <HeroSection onExplore={handleExplore} stats={stats} />
          <ExplorerSection
            planets={planets}
            onSelectPlanet={handleSelectPlanet}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </>
      )}

      {view === 'sky' && (
        <SkyView
          planet={selectedPlanet}
          exoskyData={exoskyData}
          onClose={handleCloseSky}
          isLoading={skyLoading}
        />
      )}
    </div>
  );
}

export default App;
