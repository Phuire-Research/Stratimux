"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guesser = void 0;
var Guesser = /** @class */ (function () {
    function Guesser() {
        this.word = '';
        this.correctGuesses = 0;
    }
    Guesser.prototype.setWord = function (word) {
        this.word = word;
    };
    Guesser.prototype.guessWord = function (word) {
        var correct = word.toLowerCase() === this.word.toLowerCase();
        if (correct)
            this.correctGuesses++;
        return correct;
    };
    Guesser.prototype.getNumberCorrectGuesses = function () {
        return this.correctGuesses;
    };
    return Guesser;
}());
exports.Guesser = Guesser;
