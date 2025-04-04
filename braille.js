// Mapping for English characters to Braille
const brailleMap = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲',
    '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
    '0': '⠴', ' ': '⠀', ',': '⠂', ';': '⠆', ':': '⠒',
    '.': '⠲', '!': '⠮', '(': '⠐⠣', ')': '⠐⠜', '?': '⠦',
    '"': '⠐⠂', '-': '⠤', "'": '⠄'
};

// Convert text to Braille
function textToBraille(text) {
    return text
    .toLowerCase()
    .split('')
    .map(char => brailleMap[char] || char)
    .join('');
}

// Get the dot matrix for a Braille character
function getBrailleDotMatrix(brailleChar) {
    // Default empty 3x2 matrix (Braille cell has 6 dots in 3 rows and 2 columns)
    const emptyMatrix = [
    [false, false],
    [false, false],
    [false, false]
    ];

    if (!brailleChar || brailleChar === '⠀') return emptyMatrix;

    // Unicode Braille characters start at U+2800
    const charCode = brailleChar.charCodeAt(0) - 0x2800;
    
    return [
    [(charCode & 0x1) !== 0, (charCode & 0x8) !== 0],
    [(charCode & 0x2) !== 0, (charCode & 0x10) !== 0],
    [(charCode & 0x4) !== 0, (charCode & 0x20) !== 0]
    ];
}

// Create Braille cell elements
function createBrailleCell(matrix) {
    const cell = document.createElement('div');
    cell.className = 'braille-cell';
    
    matrix.flat().forEach(filled => {
    const dot = document.createElement('div');
    dot.className = filled ? 'braille-dot filled' : 'braille-dot';
    cell.appendChild(dot);
    });
    
    return cell;
}

// Update the Braille display
function updateBrailleDisplay(brailleText) {
    const brailleDisplay = document.getElementById('braille-display');
    brailleDisplay.innerHTML = '';
    
    brailleText.split('').forEach(char => {
    const matrix = getBrailleDotMatrix(char);
    const cell = createBrailleCell(matrix);
    brailleDisplay.appendChild(cell);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const translateBtn = document.getElementById('translate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const unicodeOutput = document.getElementById('braille-unicode-output');
    
    // Translate button click handler
    translateBtn.addEventListener('click', () => {
    const inputText = textInput.value.trim();
    if (!inputText) {
        unicodeOutput.textContent = 'Please enter some text to translate';
        document.getElementById('braille-display').innerHTML = '';
        return;
    }
    
    const brailleText = textToBraille(inputText);
    unicodeOutput.textContent = brailleText;
    updateBrailleDisplay(brailleText);
    });
    
    // Copy button click handler
    copyBtn.addEventListener('click', () => {
    const brailleText = unicodeOutput.textContent;
    if (brailleText && brailleText !== 'Please enter some text to translate') {
        navigator.clipboard.writeText(brailleText)
        .then(() => {
            // Show temporary copied notification
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span style="color: #10B981;">Copied!</span>';
            setTimeout(() => {
            copyBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please try again.');
        });
    }
    });
    
    // Enable translating on Enter key press
    textInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        translateBtn.click();
    }
    });
    
    // Update braille display as user types (optional real-time translation)
    textInput.addEventListener('input', () => {
    const inputText = textInput.value.trim();
    if (inputText) {
        const brailleText = textToBraille(inputText);
        unicodeOutput.textContent = brailleText;
        updateBrailleDisplay(brailleText);
    } else {
        unicodeOutput.textContent = '';
        document.getElementById('braille-display').innerHTML = '';
    }
    });
});