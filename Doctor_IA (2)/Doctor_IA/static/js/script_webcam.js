const video = document.getElementById('inputVideo'); // Obtiene el elemento de video desde el DOM con el ID 'inputVideo'.
const canvas = document.getElementById('overlay'); // Obtiene el elemento de canvas desde el DOM con el ID 'overlay'.

(async () => {
    // Solicita acceso a la cámara del usuario y obtiene el stream de video.
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    // Asigna el stream de video al elemento de video.
    video.srcObject = stream;
    // Una vez que el video esté listo, llama a la función onPlay para comenzar la detección.
    video.onplay = onPlay;
})();

async function onPlay() {
    const MODEL_URL = 'static/models/'; // Define la ruta base donde se encuentran los modelos de FaceAPI.

    // Carga de los modelos necesarios para la detección de rostros, landmarks, reconocimiento y expresiones faciales.
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL); // Modelo para la detección de rostros.
    await faceapi.loadFaceLandmarkModel(MODEL_URL); // Modelo para detectar puntos clave en los rostros (landmarks).
    await faceapi.loadFaceRecognitionModel(MODEL_URL); // Modelo para el reconocimiento facial.
    await faceapi.loadFaceExpressionModel(MODEL_URL); // Modelo para detectar expresiones faciales.

    // Función para procesar el video frame por frame.
    async function processFrame() {
        // Detecta todos los rostros en el video, junto con sus landmarks, descriptores y expresiones faciales.
        let fullFaceDescriptions = await faceapi.detectAllFaces(video)
            .withFaceLandmarks() // Detecta puntos clave en los rostros.
            .withFaceDescriptors() // Genera descriptores únicos para cada rostro.
            .withFaceExpressions(); // Detecta expresiones faciales en los rostros.

        // Ajusta las dimensiones del canvas para que coincidan con las del video.
        const dims = faceapi.matchDimensions(canvas, video, true);
        // Redimensiona los resultados de detección facial para que coincidan con las dimensiones del canvas.
        const resizedResults = faceapi.resizeResults(fullFaceDescriptions, dims);

        // Dibuja las detecciones de rostros en el canvas.
        faceapi.draw.drawDetections(canvas, resizedResults);
        // Dibuja los puntos clave (landmarks) en los rostros detectados en el canvas.
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
        // Dibuja las expresiones faciales detectadas en el canvas, con una escala de 0.05 para los textos.
        faceapi.draw.drawFaceExpressions(canvas, resizedResults, 0.05);

        // Verifica si se ha detectado al menos un rostro.
        if (fullFaceDescriptions.length > 0) {
            // Redirige a otra ventana o ejecuta otra funcionalidad.
            window.location.href = '../HealthAssist.html'; // Cambia esto por la URL de tu nueva página.
            // O ejecuta otra función en lugar de redirigir:
            // otraFuncionalidad();
            return; // Detiene el procesamiento de frames adicionales.
        }

        // Llama a la función processFrame cada 100 milisegundos para actualizar las detecciones.
        setTimeout(() => processFrame(), 100);
    }

    // Comienza el procesamiento de frames.
    processFrame();
}
