export function typewriterEffect(element, text, delay = 36) {
    element.textContent = '';
    let i = 0;

    function nextChar() {
        if (i < text.length) {
            element.textContent += text[i++];
            setTimeout(nextChar, delay);
        }
    }
    nextChar();
}
