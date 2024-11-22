# Mobil-IA Server

This is the server component of the Mobil-IA project, an AI-powered assistant for facilitating travel and transportation.

## Setup

To set up the Mobil-IA server, follow these steps:

1. Create and activate a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```
   This creates an isolated Python environment for the project.

2. Install uv (a fast Python package installer and runner):
   ```
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```
   uv is used to manage dependencies and run the server.

3. Install the project in editable mode:
   ```
   python -m pip install -e .
   ```
   This installs the project and its dependencies.

4. Set your OpenAI API key:
   ```
   export OPENAI_API_KEY=your_api_key_here
   ```
   Replace 'your_api_key_here' with your actual OpenAI API key.

5. Start the server:
   ```
   uv run src/server/app.py --reload
   ```
   This command starts the server with auto-reload enabled for development.

Each step is crucial for setting up the environment, installing dependencies, configuring the API key, and running the server. Make sure to follow them in order.

## Requirements

- Python 3.10+
- uv (Python package installer and runner)
- OpenAI API key

For more details, refer to the main project documentation.