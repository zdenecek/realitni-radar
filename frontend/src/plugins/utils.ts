
interface Array<T> {
    unique(): Array<T>;
}

function init() {
    Array.prototype.unique = function () {
        return [...new Set(this)]
    };
}
