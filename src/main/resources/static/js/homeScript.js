document.addEventListener('DOMContentLoaded', () => {
    // Initialize lightbox functionality
    const preloader = document.getElementById('galleryPreloader');
    const images = document.querySelectorAll('#gallery img');
    let loadedCount = 0;

    if(images.length === 0){
        preloader.style.display = 'none';
    } else {
        images.forEach(img => {
            if(img.complete) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        preloader.style.display = 'none';
                    }
                });
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        preloader.style.display = 'none';
                    }
                });
            }
        });

        if(loadedCount === images.length){
            preloader.style.display = 'none';
        }
    }
});