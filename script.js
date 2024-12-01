    const canvas = document.getElementById('canvas');
    const fontSelect = document.getElementById('font');
    const fontSizeInput = document.getElementById('fontSize');
    const styleIcons = document.querySelectorAll('#style i');
    const addTextButton = document.getElementById('addText');
    const undoButton = document.getElementById('undo');
    const redoButton = document.getElementById('redo');

    let history = [];
    let redoStack = [];
    let selectedTextBox = null;

    function saveState() {
        const state = canvas.innerHTML;
        history.push(state);
        redoStack = [];
    }

    function createTextBox() {
        const textBox = document.createElement('div');
        textBox.className = 'text-box';
        textBox.contentEditable = true;
        textBox.style.fontFamily = fontSelect.value;
        textBox.style.fontSize = `${fontSizeInput.value}px`;
        textBox.textContent = 'Editable Text';
        textBox.style.left = '50px';
        textBox.style.top = '50px';

        textBox.addEventListener('click', () => {
            selectedTextBox = textBox;
        });

        let isDragging = false;
        let offsetX, offsetY;

        textBox.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - textBox.offsetLeft;
            offsetY = e.clientY - textBox.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                textBox.style.left = `${e.clientX - offsetX}px`;
                textBox.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                saveState();
            }
        });

        return textBox;
    }

    addTextButton.addEventListener('click', () => {
        const textBox = createTextBox();
        canvas.appendChild(textBox);
        saveState();
    });

    fontSelect.addEventListener('change', () => {
        if (selectedTextBox) {
            selectedTextBox.style.fontFamily = fontSelect.value;
            saveState();
        }
    });

    fontSizeInput.addEventListener('input', () => {
        if (selectedTextBox) {
            selectedTextBox.style.fontSize = `${fontSizeInput.value}px`;
            saveState();
        }
    });

    styleIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            if (selectedTextBox) {
                const style = icon.getAttribute('data-style');
                if (style === 'bold') {
                    selectedTextBox.style.fontWeight = selectedTextBox.style.fontWeight === 'bold' ? 'normal' : 'bold';
                } else if (style === 'italic') {
                    selectedTextBox.style.fontStyle = selectedTextBox.style.fontStyle === 'italic' ? 'normal' : 'italic';
                } else if (style === 'underline') {
                    selectedTextBox.style.textDecoration = selectedTextBox.style.textDecoration === 'underline' ? 'none' : 'underline';
                }
                saveState();
            } else {
                alert('Please select a text box to apply styles.');
            }
        });
    });

    undoButton.addEventListener('click', () => {
        if (history.length > 0) {
            redoStack.push(canvas.innerHTML);
            const previousState = history.pop();
            canvas.innerHTML = previousState;
            selectedTextBox = null;
        }
    });

    redoButton.addEventListener('click', () => {
        if (redoStack.length > 0) {
            history.push(canvas.innerHTML);
            const nextState = redoStack.pop();
            canvas.innerHTML = nextState;
            selectedTextBox = null;
        }
    });