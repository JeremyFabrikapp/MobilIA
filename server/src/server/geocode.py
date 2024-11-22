import requests


class GeocodingAPI:
    def __init__(self):
        self.base_url = "https://api-adresse.data.gouv.fr"

    async def reverse_geocode(self, lat: float, lon: float) -> str:
        try:
            response = requests.get(
                f"{self.base_url}/reverse/", params={"lon": lon, "lat": lat})
            response.raise_for_status()
            data = response.json()

            if data["features"]:
                address = data["features"][0]["properties"]
                return f"{address.get('housenumber', '')} {address.get('street', '')}, {address.get('postcode', '')} {address.get('city', '')}".strip()
            else:
                raise ValueError("No address found for the given coordinates")
        except requests.RequestException as error:
            print(f"Error in reverse geocoding: {error}")
            raise
    async def geocode(self, address: str) -> dict:
        try:
            postcodes = [
                "75000", "75001", "75002", "75003", "75004", "75005", "75006", "75007", "75008", "75009",
                "75010", "75011", "75012", "75013", "75014", "75015", "75016", "75017", "75018", "75019", "75020",
                "77000", "78000", "91000", "92000", "93000", "94000", "95000"
            ]
            # Calculate the center of Paris
            paris_center_lat = 48.8566
            paris_center_lon = 2.3522

            # # Add a parameter for filtering results by distance from Paris center
            # max_distance_km = 50  # Maximum distance from Paris center in kilometers

            # # Function to calculate distance between two points using Haversine formula
            # def haversine_distance(lat1, lon1, lat2, lon2):
            #     from math import radians, sin, cos, sqrt, atan2
            #     R = 6371  # Earth's radius in kilometers

            #     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
            #     dlat = lat2 - lat1
            #     dlon = lon2 - lon1

            #     a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            #     c = 2 * atan2(sqrt(a), sqrt(1-a))
            #     distance = R * c

            #     return distance
            response = requests.get(f"{self.base_url}/search/", params={
                "q": address,
                "limit": 10,
                # "postcode": postcodes,
                "lat": paris_center_lat,
                "lon": paris_center_lon
            })
            response.raise_for_status()
            data = response.json()
            print(f"Geocoding request for address: {address}")
            print(f"API response: {data}")

            if data["features"]:
                feature = data["features"][0]
                lon, lat = feature["geometry"]["coordinates"]
                return {
                    "lat": lat,
                    "lon": lon,
                    "label": feature["properties"]["label"]
                }
            else:
                raise ValueError("No coordinates found for the given address")
        except requests.RequestException as error:
            print(f"Error in geocoding: {error}")
            raise
