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
    img.src = 'https://i.ibb.co/mDKQv2m/map-outline.png';
    //img.src = 'map outline.png';
    img.onload = function() {
        console.log('Image loaded successfully');
        resizeCanvas();
        drawImage();
    };
    img.onerror = function() {
        console.error('Failed to load image');
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`); // Debugging line
    }

    function drawImage() {
        const aspectRatio = img.width / img.height;
        let drawWidth = canvas.width * .9; // Scale down to 50% of canvas width
        let drawHeight = canvas.height * .9; // Scale down to 50% of canvas height

        if (canvas.width / canvas.height > aspectRatio) {
            drawWidth = drawHeight * aspectRatio;
        } else {
            drawHeight = drawWidth / aspectRatio;
        }

        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (canvas.height - drawHeight) / 2;

        console.log(`Drawing image at: ${offsetX}, ${offsetY}, ${drawWidth}x${drawHeight}`); // Debugging line

       // ctx.clearRect(0, 0, canvas.width, canvas.height);
       ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    window.addEventListener('resize', function() {
        resizeCanvas();
        drawImage();
    });

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;

        infoBox.style.left = `${event.clientX + 10}px`; // Offset to avoid cursor overlap
        infoBox.style.top = `${event.clientY + 10}px`; // Offset to avoid cursor overlap
        //infoBox.style.bottom = `${event.clientY + 30}px`;
        /*
        if (stateColors[color]) {
            infoBox.textContent = stateColors[color];
            infoBox.style.display = 'block';
        } else {
            infoBox.style.display = 'none';
        }
            */
        infoBox.style.display = 'block';
        infoBox.textContent = color;

        console.log(`Color: ${color}`);
        
    });


});