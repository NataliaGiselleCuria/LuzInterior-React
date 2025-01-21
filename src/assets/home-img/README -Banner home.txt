README - Banner Home

--Presentación de productos por categoría--

Este archivo describe cómo administrar las imágenes del banner de la página principal, especialmente en los siguientes casos:

1.Agregar una nueva categoría y su imagen correspondiente al banner.
2.Actualizar las imágenes existentes del banner.


---Requisitos para las imágenes---

-Formato: Las imágenes deben estar en formato PNG.

-Nombre del archivo:
El nombre debe coincidir con el nombre de la categoría en minúsculas.
Las palabras del nombre de la categoría deben separarse con guiones medios (-).

-Diferenciación por dispositivo:
Cada categoría debe tener dos imágenes:
Versión desktop: Agregar '-desktop' al final del nombre del archivo.
Versión mobile: Agregar '-mobile' al final del nombre del archivo.

-Ejemplos de nombres de archivo:

Para una categoría llamada "Ropa Deportiva":

ropa-deportiva-desktop.png (versión desktop).
ropa-deportiva-mobile.png (versión mobile).

-Ubicación de las imágenes:
Las imágenes deben guardarse en la carpeta correspondiente a los recursos del banner:
src/assets/home-img/


---Consideraciones importantes---

Tamaño y optimización:

Las imágenes deben estar optimizadas para la web para garantizar tiempos de carga rápidos.
Asegúrate de que las dimensiones sean adecuadas para desktop y mobile.
Compatibilidad con el código:

El sistema carga las imágenes automáticamente según el nombre de la categoría.
Si el nombre del archivo no cumple con el formato indicado, la imagen no será mostrada en el banner.


---Pasos para agregar o actualizar imágenes---

-Preparar las imágenes:
Crear o editar las imágenes asegurándose de cumplir con los requisitos mencionados.

-Nombrar los archivos:
Seguir el formato: nombre-categoria-desktop.png y nombre-categoria-mobile.png.

-Guardar en la ubicación correcta:
Mover los archivos al directorio src/assets/home-img/.

-Verificar en el sitio:
Asegúrate de que las imágenes se muestren correctamente en el banner al cargar la página.


---Notas adicionales---

Si una categoría no tiene imágenes para desktop o mobile, el banner podría mostrar un espacio vacío o generar un error visual.
Para evitar problemas, verifica siempre que ambas versiones (desktop y mobile) estén disponibles.


.