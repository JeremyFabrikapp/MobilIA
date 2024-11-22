from langchain_core.tools import tool

from langchain_community.tools import TavilySearchResults
from langchain_core.tools import tool
from server.directions import DirectionsAPI
import os
directions_api = DirectionsAPI(api_key=os.getenv(
    'DIRECTIONS_API_KEY', 'XDJujSkUHlvvCOirYONTwk9953G7thie'))


@tool
def add(a: int, b: int):
    """Add two numbers. Please let the user know that you're adding the numbers BEFORE you call the tool"""
    return a + b


@tool
async def check_address(address: str):
    """
    Disambiguate or check an address using the geocoding API.
    Let the user know you're checking the address before calling this tool.

    :param address: The address to disambiguate (e.g., "Eiffel Tower, Paris")
    :return: A dictionary containing the latitude, longitude, and full address label
    """
    try:
        from server.geocode import GeocodingAPI
        geocoding_api = GeocodingAPI()
        result = await geocoding_api.geocode(address)
        return {
            "latitude": result["lat"],
            "longitude": result["lon"],
            "full_address": result["label"]
        }
    except ValueError as e:
        return f"Error: {str(e)}"
    except Exception as e:
        return f"An unexpected error occurred: {str(e)}"


@tool
async def get_journey_info(start: str, destination: str, datetime_str: str = None, wheelchair: bool = False):
    """
    Get journey information between two points.
    Let the user know you're fetching journey information before calling this tool.

    :param start: Starting point (e.g., "Eiffel Tower, Paris") You must be as precise as possible
    :param destination: Destination point (e.g., "Louvre Museum, Paris") Similarly, you must precise the region or city if available.
    :param datetime_str: Optional. Departure or arrival time in ISO 8601 format (e.g., "20230615T143000")
    :param wheelchair: Optional. Set to True for wheelchair-accessible routes
    :return: Parsed journey information
    """
    journey_data = await directions_api.get_journey_from_verbal_points(start, destination, datetime_str, wheelchair)
    if journey_data:
        return directions_api.parse_journey_data(journey_data)
    else:
        return "Unable to fetch journey information. Please check the provided locations and try again."


# tavily_tool = TavilySearchResults(
#     max_results=5,
#     include_answer=True,
#     description=(
#         "This is a search tool for accessing the internet.\n\n"
#         "Let the user know you're asking your friend Tavily for help before you call the tool."
#     ),
# )

TOOLS = [add, get_journey_info, check_address]
