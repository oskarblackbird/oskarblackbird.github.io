document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const infoBox = document.getElementById('info-box');

    const stateColors = {
        '#ffffff': 'Information about State1',
        '#00ff00': 'Information about State2',
        // Add more colors and corresponding state information
    };

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = 'home1.jpg';
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;

        if (stateColors[color]) {
            infoBox.textContent = stateColors[color];
            infoBox.style.display = 'block';
        } else {
            infoBox.style.display = 'none';
        }

        console.log(`Color: ${color}`); // Debugging line

        infoBox.textContent = 'mouse has moved';
    });
    
});