document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/images');
        const images = await response.json();

        const adminGallery = document.getElementById('admin-gallery');
        adminGallery.innerHTML = '';

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = `/uploads/${image.filename}`;
            imgElement.alt = image.filename;
            imgElement.classList.add('admin-image');

            const approveBtn = document.createElement('button');
            approveBtn.textContent = 'Aprobar';
            approveBtn.onclick = async () => {
                await fetch(`/approve/${image.id}`, { method: 'POST' });
                location.reload();
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.onclick = async () => {
                await fetch(`/delete/${image.id}`, { method: 'POST' });
                location.reload();
            };

            const container = document.createElement('div');
            container.classList.add('admin-image-container');
            container.appendChild(imgElement);
            container.appendChild(approveBtn);
            container.appendChild(deleteBtn);

            adminGallery.appendChild(container);
        });
    } catch (error) {
        console.error('Error al obtener las imágenes:', error);
    }
});
