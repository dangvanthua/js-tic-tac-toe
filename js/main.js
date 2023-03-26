import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementAtIdx, getCellElementList, getCurrentTurnElement, getGameStatusElement, getReplayGameButton } from "./selectors.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    const currentTurnElement = getCurrentTurnElement();
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
}

function updateGameStatus(newStatus) {
    gameStatus = newStatus;

    const gameStatusElement = getGameStatusElement();
    if (!gameStatusElement) return;

    gameStatusElement.textContent = newStatus;
}

function showReplayButton() {
    const replayButton = getReplayGameButton();
    if (replayButton) {
        replayButton.classList.add('show');
    }
}

function hideReplayButton() {
    const replayButton = getReplayGameButton();
    if (replayButton) {
        replayButton.classList.remove('show');
    }
}

function highlightWinCells(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error('Invalid win position');
    };

    for (const position of winPositions) {
        const cell = getCellElementAtIdx(position);
        if (cell) cell.classList.add('win');
    }

}

function handleCellClick(cellElement, index) {
    const isClicked = cellElement.classList.contains(TURN.CIRCLE) || cellElement.classList.contains(TURN.CROSS);
    const isGameEnded = gameStatus !== GAME_STATUS.PLAYING;
    if (isClicked || isGameEnded) return;
    cellElement.classList.add(currentTurn);
    // save value into index cellvalues
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
    // toggleTurn function
    toggleTurn();

    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED:
            {
                // upadte game status
                updateGameStatus(game.status);
                // show replay button
                showReplayButton();
                break;
            }

        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN:
            {
                // update game status
                updateGameStatus(game.status);
                // highlight win cells
                highlightWinCells(game.winPositions);
                // show replay button 
                showReplayButton();
                break;
            }

        default:
        // playing
    }
}

function initCellElementList() {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cellElement, index) => {
        cellElement.addEventListener('click', () => handleCellClick(cellElement, index))
    })
}

function resetGame() {
    // reset temp global vars
    let newTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
    currentTurn = newTurn;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => '');

    // reset dom element
    // upadate status
    updateGameStatus(GAME_STATUS.PLAYING);

    // reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(newTurn);
    }

    // reset game board
    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.className = "";
    }

    // hide replay button
    hideReplayButton();
}

function initReplayButton() {
    const replayButton = getReplayGameButton();
    if (replayButton) {
        replayButton.addEventListener('click', resetGame);
    }

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
    initReplayButton();
})()