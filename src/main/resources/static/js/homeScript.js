document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('myButton');
    if (button) {
        button.addEventListener('click', function() {
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.color = heading.style.color === 'red' ? 'black' : 'red';
            }
        });
    }
});