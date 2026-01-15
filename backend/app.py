"""
EXOSKY API - NASA Space Apps Challenge 2024
Backend FastAPI para la aplicación EXOSKY.
"""

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

# Importar el calculador de exosky
from exosky_calculator import (
    get_exosky_for_planet, 
    EXOPLANET_CATALOG, 
    STAR_CATALOG,
    get_star_color
)

# Inicializa la aplicación FastAPI
app = FastAPI(
    title="EXOSKY API",
    description="API para visualizar el cielo nocturno desde exoplanetas",
    version="2.0.0"
)

origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# ==================== MODELOS ====================

class ExoplanetBasic(BaseModel):
    name: str
    host_star: str
    distance_ly: float
    ra: float
    dec: float

class ExoplanetDetail(BaseModel):
    name: str
    host_star: str
    distance_ly: float
    ra: float
    dec: float
    discovery_year: Optional[int] = None
    spectral_type: Optional[str] = None

class StarInExosky(BaseModel):
    id: int
    name: str
    ra: float
    dec: float
    apparent_mag: float
    distance_ly: float
    spectral_type: str
    color_index: float
    color_hex: str
    is_sun: bool
    size: float  # Tamaño visual basado en magnitud

class ExoskyResponse(BaseModel):
    exoplanet: ExoplanetBasic
    sun_position: Optional[StarInExosky] = None
    total_visible_stars: int
    stars: List[StarInExosky]

# ==================== ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "message": "Bienvenido a la API EXOSKY v2.0",
        "description": "Visualiza el cielo nocturno desde cualquier exoplaneta",
        "endpoints": {
            "/exoplanets": "Lista de todos los exoplanetas",
            "/exoplanet/{name}": "Detalles de un exoplaneta",
            "/exosky/{name}": "Cielo estrellado desde un exoplaneta",
            "/search": "Buscar exoplanetas por nombre"
        }
    }


@app.get("/exoplanets", response_model=List[str])
async def get_exoplanets():
    """
    Obtiene la lista de todos los nombres de exoplanetas disponibles.
    """
    if EXOPLANET_CATALOG is None:
        raise HTTPException(status_code=500, detail="Catálogo de exoplanetas no disponible")
    
    return EXOPLANET_CATALOG['name'].tolist()


@app.get("/exoplanet/{name}", response_model=ExoplanetDetail)
async def get_exoplanet(name: str):
    """
    Obtiene los detalles de un exoplaneta específico.
    """
    if EXOPLANET_CATALOG is None:
        raise HTTPException(status_code=500, detail="Catálogo no disponible")
    
    exoplanet = EXOPLANET_CATALOG[EXOPLANET_CATALOG['name'] == name]
    
    if exoplanet.empty:
        raise HTTPException(status_code=404, detail=f"Exoplaneta '{name}' no encontrado")
    
    exo = exoplanet.iloc[0]
    
    return ExoplanetDetail(
        name=exo['name'],
        host_star=exo['host_star'],
        distance_ly=round(exo['distance_ly'], 2),
        ra=exo['ra'],
        dec=exo['dec'],
        discovery_year=int(exo['discovery_year']) if pd.notna(exo['discovery_year']) else None,
        spectral_type=exo['spectral_type'] if pd.notna(exo['spectral_type']) else None
    )


@app.get("/exosky/{name}")
async def get_exosky(
    name: str, 
    mag_limit: float = Query(6.5, description="Magnitud límite (6.5 = visible a ojo desnudo)"),
    limit: int = Query(500, description="Número máximo de estrellas a devolver (default 500, max 5000)"),
    offset: int = Query(0, description="Offset para paginación")
):
    """
    Calcula y devuelve el cielo nocturno desde la perspectiva de un exoplaneta.
    
    Esta es la función principal que transforma las posiciones de las estrellas
    al sistema de referencia del exoplaneta y recalcula sus brillos aparentes.
    
    Para mejor rendimiento, se limita el número de estrellas devueltas.
    Las estrellas están ordenadas por brillo (las más brillantes primero).
    """
    # Limitar el máximo a 5000 para evitar respuestas muy grandes
    limit = min(limit, 5000)
    
    result = get_exosky_for_planet(name, mag_limit)
    
    if 'error' in result:
        raise HTTPException(status_code=404, detail=result['error'])
    
    # Aplicar paginación a las estrellas (ya están ordenadas por brillo)
    total_stars = len(result['stars'])
    paginated_stars = result['stars'][offset:offset + limit]
    
    # Convertir estrellas al formato de respuesta (optimizado con list comprehension)
    def process_star(star):
        size = max(1, min(10, 10 - (star['apparent_mag'] + 7) * 0.67))
        return {
            'id': star['id'],
            'name': star['name'],
            'ra': star['ra'],
            'dec': star['dec'],
            'mag': star['apparent_mag'],  # Campo más corto
            'color': get_star_color(star['color_index']),
            'size': round(size, 1),
            'is_sun': star['is_sun']
        }
    
    stars_response = [process_star(s) for s in paginated_stars]
    
    # Preparar posición del Sol si existe (formato simplificado)
    sun_data = None
    if result['sun_position']:
        sun = result['sun_position']
        sun_size = max(1, min(10, 10 - (sun['apparent_mag'] + 7) * 0.67))
        sun_data = {
            'name': "Sol (Our Sun)",
            'ra': sun['ra'],
            'dec': sun['dec'],
            'mag': sun['apparent_mag'],
            'color': '#FFF4EA',
            'size': round(sun_size, 1)
        }
    
    return {
        "exoplanet": {
            "name": result['exoplanet']['name'],
            "distance_ly": result['exoplanet']['distance_ly']
        },
        "sun": sun_data,
        "pagination": {
            "total": total_stars,
            "limit": limit,
            "offset": offset,
            "returned": len(stars_response)
        },
        "stars": stars_response
    }


@app.get("/search")
async def search_exoplanets(
    q: str = Query(..., description="Término de búsqueda"),
    limit: int = Query(20, description="Número máximo de resultados")
):
    """
    Busca exoplanetas por nombre (búsqueda parcial).
    """
    if EXOPLANET_CATALOG is None:
        raise HTTPException(status_code=500, detail="Catálogo no disponible")
    
    # Búsqueda case-insensitive
    matches = EXOPLANET_CATALOG[
        EXOPLANET_CATALOG['name'].str.lower().str.contains(q.lower(), na=False)
    ]
    
    results = []
    for _, exo in matches.head(limit).iterrows():
        results.append({
            "name": exo['name'],
            "host_star": exo['host_star'],
            "distance_ly": round(exo['distance_ly'], 2)
        })
    
    return {
        "query": q,
        "total_matches": len(matches),
        "results": results
    }


@app.get("/stats")
async def get_stats():
    """
    Estadísticas del catálogo.
    """
    return {
        "total_exoplanets": len(EXOPLANET_CATALOG) if EXOPLANET_CATALOG is not None else 0,
        "total_stars": len(STAR_CATALOG) if STAR_CATALOG is not None else 0,
        "closest_exoplanet": "Proxima Cen b",
        "closest_distance_ly": 4.24
    }


@app.get("/nearby")
async def get_nearby_exoplanets(limit: int = Query(20, description="Número de exoplanetas")):
    """
    Obtiene los exoplanetas más cercanos a la Tierra.
    """
    if EXOPLANET_CATALOG is None:
        raise HTTPException(status_code=500, detail="Catálogo no disponible")
    
    nearby = EXOPLANET_CATALOG.nsmallest(limit, 'distance_ly')
    
    results = []
    for _, exo in nearby.iterrows():
        results.append({
            "name": exo['name'],
            "host_star": exo['host_star'],
            "distance_ly": round(exo['distance_ly'], 2)
        })
    
    return results


# Ejecuta la API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
