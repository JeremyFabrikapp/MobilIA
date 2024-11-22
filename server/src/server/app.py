import os
from directions import DirectionsAPI
import uvicorn
from starlette.applications import Starlette
from starlette.responses import HTMLResponse
from starlette.routing import Route, WebSocketRoute
from starlette.staticfiles import StaticFiles
from starlette.websockets import WebSocket

from langchain_openai_voice import OpenAIVoiceReactAgent


from server.utils import websocket_stream
from server.prompt import INSTRUCTIONS
from server.tools import TOOLS
from dotenv import load_dotenv

load_dotenv()

async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    browser_receive_stream = websocket_stream(websocket)

    agent = OpenAIVoiceReactAgent(
        model="gpt-4o-realtime-preview",
        tools=TOOLS,
        instructions=INSTRUCTIONS,
    )

    await agent.aconnect(browser_receive_stream, websocket.send_text)


async def homepage(request):
    with open("src/server/static/index.html") as f:
        html = f.read()
        return HTMLResponse(html)


# catchall route to load files from src/server/static


routes = [Route("/", homepage), WebSocketRoute("/ws", websocket_endpoint)]

app = Starlette(debug=True, routes=routes)

app.mount("/", StaticFiles(directory="src/server/static"), name="static")

# app = Flask(__name__)

# # Configuration
# app.config['DEBUG'] = True  # Enable debug mode for development
# app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_secret_key')

# Initialize DirectionsAPI with API key from environment variable
directions = DirectionsAPI(api_key=os.getenv('DIRECTIONS_API_KEY', ''))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
