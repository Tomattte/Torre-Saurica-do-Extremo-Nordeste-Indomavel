// IMPORTS

// players.js

// inimigos.js

// colisoes.js

import { criarProjectil } from './colisoes.js';
import { atualizarProjecteis } from './colisoes.js';
import { desenharProjecteis } from './colisoes.js'

// Lista para guardar todos os tiros ativos na tela
const projecteis = [];

/*--------------------------------------------------------------------*/

// CANVAS CONFIGURATION 

const canvas = document.getElementById("canvas");
const c = canvas.getContext('2d');

// Variables to store the original canvas size

const C_WIDTH = canvas.width;
const C_HEIGHT = canvas.height;

c.fillStyle = "white";
c.fillRect(0, 0, C_WIDTH, C_HEIGHT);

function resizeGame() {

    // Variables to store the current size of the users window

    const U_WIDTH = window.innerWidth;
    const U_HEIGHT = window.innerHeight;

    // Calculates the approximate scale based on the user's window size.

    const scaleX = U_WIDTH / C_WIDTH;
    const scaleY = U_HEIGHT / C_HEIGHT;

    // The lowest scale is used to avoid cutting off parts of the canvas
    // Math.floor is used to get a integer value and avoid pixel distortion

    let scale = Math.floor(Math.min(scaleX, scaleY));
    
    // 1 is set as the minimun scale

    if (scale < 1) scale = 1;

    // Canvas is displayed with the final size

    canvas.style.width = (C_WIDTH * scale) + 'px';
    canvas.style.height = (C_HEIGHT * scale) + 'px';
}

// Resizes on page load
window.addEventListener('load', resizeGame);

// Resizes on window size change
window.addEventListener('resize', resizeGame);

/*--------------------------------------------------------------------*/
