"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validations = void 0;
var Validations = /** @class */ (function () {
    function Validations() {
    }
    Validations.prototype.keyPressOnlyLetters = function (event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^[a-zA-Z\s]*$/.test(inp)) {
            return true;
        }
        else {
            event.preventDefault();
            return false;
        }
    };
    Validations.prototype.keyPressOnlyNumbers = function (event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^[0-9]*$/.test(inp)) {
            return true;
        }
        else {
            event.preventDefault();
            return false;
        }
    };
    Validations.prototype.keyPressnoneSpecialCharacters = function (event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^[a-zA-Z0-9\s]*$/.test(inp)) {
            return true;
        }
        else {
            event.preventDefault();
            return false;
        }
    };
    Validations.prototype.keyPressForGtin = function (event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^[a-zA-Z0-9-\s]*$/.test(inp)) {
            return true;
        }
        else {
            event.preventDefault();
            return false;
        }
    };
    Validations.prototype.noPaste = function (event) {
        event.preventDefault();
        return false;
    };
    return Validations;
}());
exports.Validations = Validations;
//# sourceMappingURL=Validations.js.map