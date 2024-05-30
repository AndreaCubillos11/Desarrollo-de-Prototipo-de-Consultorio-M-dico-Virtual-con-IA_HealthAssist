from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from starlette.templating import Jinja2Templates

app = FastAPI()

# Usar Path para manejar rutas de manera más robusta
base_path = Path(__file__).resolve().parent
templates_path = base_path / "static" / "templates"
static_path = base_path / "static"

templates = Jinja2Templates(directory=str(templates_path))
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# Definir la ruta raíz para servir el archivo webcam.html
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("webcam.html", {"request": request})

# Definir una nueva ruta para servir el archivo HealthAssist 
@app.get("/HealthAssist.html", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("HealthAssist.html ", {"request": request})
