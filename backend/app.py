import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Inicializa la aplicación FastAPI
app = FastAPI()

# Modelo de datos para Exoplaneta
class Exoplanet(BaseModel):
    name: str
    coordinates: str
    hoststar: str
    pl_bmasse: float
    v_mag: float
    ks_mag: float
    gaia_mag: float
    spectral_type: str
    discovery_year: int
    orbital_period: float

# Modelo de datos para la estrella anfitriona
class HostStar(BaseModel):
    host_name: str
    host_temp: float
    host_rad: float
    host_mass: float

# Carga los datos de los exoplanetas desde el CSV
csv_data = pd.read_csv('psc.csv')

# Crea un diccionario de exoplanetas
exoplanets = {}
# Crea un diccionario de estrellas anfitrionas
hoststars = {}

for index, row in csv_data.iterrows():
    # Maneja valores NaN para 'spectral_type'
    spectral_type = row['st_spectype'] if pd.notna(row['st_spectype']) else "Unknown"
    
    # Añadir exoplaneta
    exoplanets[row['pl_name']] = Exoplanet(
        name=row['pl_name'],
        coordinates=f"{row['ra']}, {row['dec']}",
        hoststar=row['hostname'],
        pl_bmasse=row['pl_bmasse'],
        v_mag=row['sy_vmag'],
        ks_mag=row['sy_kmag'],
        gaia_mag=row['sy_gaiamag'], 
        spectral_type=spectral_type,
        discovery_year=row['disc_year'],
        orbital_period=row['pl_orbper'],
    )

    # Añadir estrella anfitriona, evitando duplicados
    if row['hostname'] not in hoststars:
        hoststars[row['hostname']] = HostStar(
            host_name=row['hostname'],
            host_temp=row['st_teff'],
            host_rad=row['st_rad'], 
            host_mass=row['st_mass'],
        )

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Exoplanetas y Estrellas Anfitrionas!"}

# Ruta para obtener los exoplanetas
@app.get("/exoplanets")
async def get_exoplanets():
    return csv_data['pl_name'].tolist()

# Ruta para obtener la información de un exoplaneta
@app.get("/exoplanet/{name}", response_model=Exoplanet)
async def get_exoplanet(name: str):
    if name in exoplanets:
        return exoplanets[name]
    else:
        raise HTTPException(status_code=404, detail="Exoplanet not found")

# Ruta para obtener la información de una estrella anfitriona
@app.get("/hoststar/{name}", response_model=HostStar)
async def get_hoststar(name: str):
    if name in hoststars:
        return hoststars[name]
    else:
        raise HTTPException(status_code=404, detail="Host star not found")
    
    
# Ruta para obtener las estrellas más cercanas al exóplaneta
@app.get("/exoplanet/{name}/nearest_stars")
async def get_nearest_stars(name: str):
    csv_data = pd.read_csv('estrellas_cercanas.csv')
    nearest_stars = csv_data[csv_data['exoplanet_name'] == name]
    
     # Si no hay resultados, devolver un error 404
    if nearest_stars.empty:
        raise HTTPException(status_code=404, detail=f"El exoplaneta '{name}' no tiene estrellas cercanas.")

    # Seleccionar las columnas de interés (source_id, ra, dec)
    result = nearest_stars[['source_id', 'ra', 'dec']].to_dict(orient="records")
    
    # Devolver el resultado
    return result
     
# Ejecuta la API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
