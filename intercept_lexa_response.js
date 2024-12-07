// Save reference to original XMLHttpRequest
const originalXHR = window.XMLHttpRequest;

if (window.trustedTypes && window.trustedTypes.createPolicy) {
    window.trustedTypes.createPolicy('lexaPolicy', {
        createHTML: string => string
    });
}

function startInterception() {
    // Create new constructor that wraps the original XMLHttpRequest
    window.XMLHttpRequest = function () {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        // Override the open method
        xhr.open = function () {
            originalOpen.apply(xhr, arguments);
        };

        // Override the send method
        xhr.send = function () {
            // Add response listener
            xhr.addEventListener('load', function () {
                try {
                    if (xhr.responseURL && xhr.responseURL.includes('base_lexa_generate')) {
                        console.log('Lexa response intercepted at:', new Date().toLocaleTimeString());

                        // Parse the JSON response
                        const jsonResponse = JSON.parse(xhr.responseText);

                        // Extract the "generation" value
                        const generationValue = jsonResponse.data.generation;

                        // Log the generation value
                        console.log('Generation:', generationValue);

                        // Create or update the display element
                        let displayElement = document.getElementById('lexa-response-display');
                        if (!displayElement) {
                            displayElement = document.createElement('div');
                            displayElement.id = 'lexa-response-display';
                            displayElement.style.position = 'fixed';
                            displayElement.style.top = '20px';
                            displayElement.style.right = '20px';
                            displayElement.style.zIndex = '9999';
                            displayElement.style.maxWidth = '300px';
                            displayElement.style.padding = '10px';
                            displayElement.style.backgroundColor = '#f0f0f0';
                            // displayElement.style.margin = '10px';
                            displayElement.style.borderRadius = '5px';
                            displayElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                            displayElement.style.cursor = 'move';

                            // Make element draggable
                            makeDraggable(displayElement);

                            const body = document.body;
                            body.insertBefore(displayElement, body.firstChild);
                        }

                        // Clear previous content
                        while (displayElement.firstChild) {
                            displayElement.removeChild(displayElement.firstChild);
                        }

                        const policy = window.trustedTypes.createPolicy('lexaPolicy', {
                            createHTML: string => string
                        });
                        displayElement.innerHTML = policy.createHTML(generationValue);
                    }
                } catch (error) {
                    console.error('Error intercepting response:', error);
                }
            });

            // Call original send
            originalSend.apply(xhr, arguments);
        };

        return xhr;
    };
}

// Start the interception
startInterception();

function makeDraggable(element) {
    let startX, startY;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        // Get the initial mouse position
        startX = e.clientX;
        startY = e.clientY;
        console.log("startX: ", startX);
        console.log("startY: ", startY);
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        // Calculate the distance moved
        let deltaX = e.clientX - startX;
        let deltaY = e.clientY - startY;
        console.log("deltaX: ", deltaX);
        console.log("deltaY: ", deltaY);

        // Update element position using offsetTop/offsetLeft
        console.log("element.offsetTop: ", element.offsetTop);
        console.log("element.offsetLeft: ", element.offsetLeft);
        element.style.top = (element.offsetTop + deltaY) + "px";
        console.log("element.style.top: ", element.style.top);
        element.style.left = (element.offsetLeft + deltaX) + "px";
        console.log("element.style.left: ", element.style.left);
        element.style.right = 'auto';

        // Update the start position for next move
        startX = e.clientX;
        startY = e.clientY;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}