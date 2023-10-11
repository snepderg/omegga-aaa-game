export default class TextGame {
    current_phrase: string;

    constructor() {
        // Mutable variables
        this.current_phrase = "A";
    }

    /**
     * Gets the next phrase by incrementing the current phrase by one character.
     * If the current phrase ends with "Z", it rolls over to "A" and increments the previous character.
     */
    increment_phrase(): string {
        let chars = this.current_phrase.split("");
        this.increment(chars, chars.length - 1);
        this.current_phrase = chars.join("");
        return this.current_phrase;
    }

    /**
     * Increments a character array by one.
     * @param {string[]} chars - The character array to increment.
     * @param {number} index - The index of the character to increment.
     * If index is less than 0, a new character "A" is added to the beginning of the array.
     */
    increment(chars: string[], index: number): void {
        if (index < 0) {
            chars.unshift("A");
            return;
        }
        let charCode = chars[index].charCodeAt(0);
        if (charCode === 90) {
            chars[index] = "A";
            this.increment(chars, index - 1);
        } else {
            chars[index] = String.fromCharCode(charCode + 1);
        }
    }

    /**
     * Checks if the user's answer is correct.
     * @param {string} answer - The user's answer.
     * @returns {boolean} True if the answer is correct, false otherwise.
     */
    check_answer(answer: string): boolean {
        if (answer.toUpperCase() === this.current_phrase) {
            return true;
        }
        else {
            return false;
        }
    }
}
