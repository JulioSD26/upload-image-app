# Image Uploader

![image](https://github.com/user-attachments/assets/cee128c7-0329-4ddc-a026-9296fd981e4c)


## Descripción

Una aplicación web simple para subir imágenes. Los usuarios pueden seleccionar imágenes de su dispositivo y verlas directamente en la página después de la carga. Esta aplicación utiliza **Node.js**, **Express** y **Multer** para gestionar la subida y almacenamiento de imágenes.

## Características

- Subida de imágenes en formatos: JPEG, JPG, PNG, GIF.
- Validación de tipos de archivos y límites de tamaño (hasta 2MB).
- Visualización de todas las imágenes subidas en la misma página.
- Interfaz de usuario simple y fácil de usar.

## Tecnologías Utilizadas

- Node.js
- Express
- Multer
- HTML
- CSS

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/image-uploader.git
2. Navega al directorio del proyecto:
   cd image-uploader
3. Instala las dependencias:
   npm install
4. Crea una carpeta llamada uploads en la raíz del proyecto para almacenar las imágenes subidas:
   mkdir uploads
5. Inicia el servidor:
   node index.js
6. Abre tu navegador y visita http://localhost:3000.
