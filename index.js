const express = require('express'); 
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Array para almacenar los nombres de las imágenes subidas
let uploadedImages = [];

// Configuración del almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombrar archivo con la fecha actual
    }
});

// Validación del tipo de archivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif).'));
    }
};

// Limitar tamaño del archivo (2MB)
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: fileFilter
}).single('image');

// Ruta para servir una página HTML para subir la imagen
app.get('/', (req, res) => {
    // Generar el HTML con las imágenes subidas
    let imagesHtml = uploadedImages.map(img => `<img src="/images/${img}" alt="Imagen subida" width="300">`).join('<br>');
    
    // Mostrar mensaje solo si no hay imágenes
    const noImagesMessage = uploadedImages.length === 0 ? 'No se han subido imágenes aún.' : '';

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Subir Imagen</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                form {
                    background-color: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    margin-bottom: 20px;
                }
                input[type="file"] {
                    padding: 10px;
                    margin: 10px 0;
                }
                button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #45a049;
                }
                img {
                    margin-top: 20px;
                    max-width: 100%;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                .images-container {
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <h1>Subir Imagen</h1>
            <form id="upload-form">
                <input type="file" name="image" accept="image/*" required>
                <button type="submit">Subir Imagen</button>
            </form>
            <div class="images-container">
                <h2>Imágenes subidas:</h2>
                <div id="uploaded-images">
                    ${imagesHtml || noImagesMessage}
                </div>
            </div>
            <script>
                const form = document.getElementById('upload-form');
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    try {
                        const response = await fetch('/upload', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await response.text();
                        if (response.ok) {
                            // Actualizar el DOM para mostrar la imagen subida
                            const uploadedImagesDiv = document.getElementById('uploaded-images');
                            uploadedImagesDiv.innerHTML += data; // Añadir la nueva imagen
                            // Si no había imágenes antes, borrar el mensaje
                            if (uploadedImagesDiv.innerHTML.includes('No se han subido imágenes aún.')) {
                                uploadedImagesDiv.innerHTML = uploadedImagesDiv.innerHTML.replace('No se han subido imágenes aún.', '');
                            }
                            form.reset(); // Limpiar el formulario
                        } else {
                            alert('Error: ' + data);
                        }
                    } catch (error) {
                        alert('Error al subir la imagen: ' + error.message);
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Ruta para subir imagen
app.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send(`Error de Multer: ${err.message}`);
        } else if (err) {
            return res.status(400).send(err.message);
        }

        if (!req.file) {
            return res.status(400).send('No se ha subido ninguna imagen.');
        }

        // Agregar el nombre del archivo al array
        uploadedImages.push(req.file.filename);

        // Devolver el HTML para la imagen subida
        res.send(`<img src="/images/${req.file.filename}" alt="Imagen subida" width="300">`);
    });
});

// Ruta para servir las imágenes subidas
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
