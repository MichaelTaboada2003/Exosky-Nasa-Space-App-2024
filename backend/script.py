from astropy import units as u
from astroquery.gaia import Gaia
import matplotlib.pyplot as plt
import numpy as np
import ssl 
import pandas as pd
from astropy.coordinates import SkyCoord

ssl._create_default_https_context = ssl._create_unverified_context
Gaia.login(user='lquinter', password='Angelinda#0')

#URL del servicio TAP del NASA Exoplanet Archive
#tap_service = TAPService("https://exoplanetarchive.ipac.caltech.edu/TAP")

# Leer los datos del CSV (asegúrate de que la ruta del archivo CSV sea correcta)
csv_data = pd.read_csv('psc.csv')

# Lista para almacenar las coordenadas de las estrellas cercanas
close_star_data = []

# Iterar sobre las filas del CSV para tomar los datos de RA y Dec de cada exoplaneta
for index, row in csv_data.iterrows():
    ra_exoplanet = row['ra']  # Asegúrate de que los nombres de las columnas son correctos
    dec_exoplanet = row['dec']
    
    # Definir las coordenadas del exoplaneta
    coords = SkyCoord(ra=ra_exoplanet, dec=dec_exoplanet, unit=(u.deg, u.deg), frame='icrs')
    
    # Definir el radio de búsqueda (en grados)
    search_radius = 0.1 * u.deg  # Radio de 0.1 grados, ajusta según lo necesario
    
    # Realizar la consulta a la base de datos de Gaia buscando estrellas cercanas
    query = f"""
    SELECT source_id, ra, dec
    FROM gaiadr3.gaia_source
    WHERE CONTAINS(POINT('ICRS', ra, dec), CIRCLE('ICRS', {coords.ra.degree}, {coords.dec.degree}, {search_radius.to(u.deg).value})) = 1
    AND parallax > 0
    """
    
    # Ejecutar la consulta de manera asíncrona
    job = Gaia.launch_job_async(query)
    results = job.get_results()
    
    # Imprimir las columnas disponibles en los resultados
    print(f"Resultados para exoplaneta {row['pl_name']} en RA: {ra_exoplanet}, Dec: {dec_exoplanet}")
    print("Columnas disponibles en los resultados:", results.colnames)  # Imprimir nombres de las columnas
    
    if len(results) > 0:
        for result in results:
            result_dict = {col: result[col] for col in result.colnames}  # Convertir a diccionario
            close_star_data.append({
                'exoplanet_name': row['pl_name'],
                'source_id': result_dict.get('SOURCE_ID', None),  # Usar get para evitar KeyError
                'ra': result_dict.get('ra', None),
                'dec': result_dict.get('dec', None)
            })
        print(f"Estrellas cercanas encontradas para el exoplaneta {row['pl_name']}.")
    else:
        print("No se encontraron estrellas cercanas.")

# Convertir la lista de datos de estrellas cercanas a un DataFrame
close_star_df = pd.DataFrame(close_star_data)

# Guardar el DataFrame en un archivo CSV
close_star_df.to_csv('estrellas_cercanas.csv', index=False)

print("Los datos de las estrellas cercanas han sido guardados en 'estrellas_cercanas.csv'.")