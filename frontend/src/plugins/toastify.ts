

import Toastify from 'toastify-js';

export function toast(message: string, duration: number = 3000) {
    Toastify({ text: message, duration }).showToast();
}