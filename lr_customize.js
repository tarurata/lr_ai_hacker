function addCustomDiv() {
    const targetElement = document.querySelector('div.lln-dict-section-full');
    // Return early if target element doesn't exist
    if (!targetElement) return false;
    
    // Check if the custom div already exists
    if (document.querySelector('.custom-div')) return true;

    try {
        // Create main container
        const container = document.createElement('div');
        container.className = 'custom-div';
        container.style.cssText = 'display: flex; align-items: center; justify-content: center;';

        // Create and setup image
        // const img = document.createElement('img');
        // img.src = 'https://www.languagereactor.com/images/lexa.png';
        // img.alt = '';
        // img.style.cssText = 'width: 23px; margin: 2px 4px 4px 12px; cursor: pointer; opacity: 1; transition: opacity .3s; user-select: none;';
        // img.title = 'Lexa can answer questions about words and sentences in the material you are studying.\n\nYou can edit the prompts (questions) in Language Reactor settings.\n\nPro mode uses a more intelligent model that may give better responses.';
        // img.className = 'lln-lexa-toggle-collapsed';

        // Create tabs container
        const tabsContainer = document.createElement('div');
        tabsContainer.style.cssText = 'overflow-x: auto; flex-grow: 1; white-space: nowrap;';
        tabsContainer.className = 'lln-styled-scrollbar lln-styled-scrollbar-horiz';

        // Create tabs
        const tabs = ['Explain', 'Examples', 'Grammar', 'Test'];
        tabs.forEach((tabText, index) => {
            const tab = document.createElement('span');
            tab.style.cssText = 'display: inline-block; padding: 4px 8px; font-size: 14px; cursor: pointer;';
            tab.className = `lln-lexa-tab${index === 0 ? ' active' : ''}`;
            tab.setAttribute('data-tab', tabText);
            tab.textContent = tabText;
            tabsContainer.appendChild(tab);
        });

        // Create collapse button container
        const collapseContainer = document.createElement('div');
        collapseContainer.style.cssText = 'margin: -5px 0; opacity: 0.5; cursor: pointer; padding: 5px 10px 0;';
        collapseContainer.className = 'lln-lexa-toggle-collapsed';

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.style.width = '20px';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'm12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z');
        path.setAttribute('fill', '#fff');
        svg.appendChild(path);

        // Append all elements
        collapseContainer.appendChild(svg);
        //container.appendChild(img);
        container.appendChild(tabsContainer);
        container.appendChild(collapseContainer);

        // Insert after target element
        targetElement.after(container);
        return true;
    } catch (error) {
        console.log('Error adding custom div:', error);
        return false;
    }
}

const checkAndInitialize = () => {
    try {
        const success = addCustomDiv();
        
        if (success) {
            // Continue checking every 3 seconds in case the div gets removed
            setInterval(() => {
                addCustomDiv();
            }, 3000);
            
            return true;
        }
    } catch (error) {
        console.log('Error in initialization:', error);
    }
    return false;
};

// Initial attempt
if (!checkAndInitialize()) {
    // If target not found, retry every second until success
    const initializationInterval = setInterval(() => {
        if (checkAndInitialize()) {
            clearInterval(initializationInterval);
        }
    }, 3000);
}