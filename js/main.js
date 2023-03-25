import { TURN } from "./constants.js";
import { getCellElementList, getCurrentTurnElement, getGameStatusElement, getCellElementAtIdx } from "./selectors.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    const currentTurnElement = getCurrentTurnElement();
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
}

function handleCellClick(cellElement, index) {
    const isClicked = cellElement.classList.contains(TURN.CIRCLE) || cellElement.classList.contains(TURN.CROSS);
    if (isClicked) return;
    cellElement.classList.add(currentTurn);

    // toggleTurn function
    toggleTurn();
}

function initCellElementList() {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cellElement, index) => {
        cellElement.addEventListener('click', () => handleCellClick(cellElement, index))
    })
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    // bind click event li element
    initCellElementList();
    // bind click event button element
})()