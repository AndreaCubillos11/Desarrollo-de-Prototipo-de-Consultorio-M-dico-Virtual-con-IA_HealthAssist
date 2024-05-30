const MODEL_URL = 'static/models/'; // Define la ruta base donde se encuentran los modelos de FaceAPI.

(async () => {
    // Carga de los modelos necesarios para la detección de rostros, landmarks, reconocimiento y expresiones faciales.
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL); // Modelo para la detección de rostros.
    await faceapi.loadFaceLandmarkModel(MODEL_URL); // Modelo para detectar puntos clave en los rostros (landmarks).
    await faceapi.loadFaceRecognitionModel(MODEL_URL); // Modelo para el reconocimiento facial.
    await faceapi.loadFaceExpressionModel(MODEL_URL); // Modelo para detectar expresiones faciales.

    const image = document.getElementById('image'); // Obtiene el elemento de imagen desde el DOM con el ID 'image'.
    const canvas = document.getElementById('canvas'); // Obtiene el elemento de canvas desde el DOM con el ID 'canvas'.

    // Detecta todos los rostros en la imagen, junto con sus landmarks, descriptores y expresiones faciales.
    let fullFaceDescriptions = await faceapi.detectAllFaces(image)
        .withFaceLandmarks() // Detecta puntos clave en los rostros.
        .withFaceDescriptors() // Genera descriptores únicos para cada rostro.
        .withFaceExpressions(); // Detecta expresiones faciales en los rostros.

    // Dibuja las detecciones de rostros en el canvas.
    faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
    // Dibuja los puntos clave (landmarks) en los rostros detectados en el canvas.
    faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions);
    // Dibuja las expresiones faciales detectadas en el canvas, con una escala de 0.05 para los textos.
    faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions, 0.05);

})();
