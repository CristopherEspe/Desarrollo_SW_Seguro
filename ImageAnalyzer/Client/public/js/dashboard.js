document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/images');
        const images = await response.json();

        const gallery = document.getElementById('image-gallery');
        gallery.innerHTML = '';

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = `/uploads/${image.filename}`;
            imgElement.alt = image.filename;
            imgElement.classList.add('gallery-image');

            const caption = document.createElement('p');
            caption.textContent = `Estado: ${image.status}`;

            const container = document.createElement('div');
            container.classList.add('image-container');
            container.appendChild(imgElement);
            container.appendChild(caption);

            gallery.appendChild(container);
        });
    } catch (error) {
        console.error('Error al obtener las imágenes:', error);
    }
});
