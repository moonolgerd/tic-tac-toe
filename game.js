/**
 * Tic Tac Toe — Browser Game
 * Two-player, local. Tracks scores across rounds.
 */

(function () {
  'use strict';

  // ─── Constants ───────────────────────────────────────────────
  const WINNING_COMBOS = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left col
    [1, 4, 7], // middle col
    [2, 5, 8], // right col
    [0, 4, 8], // diagonal \
    [2, 4, 6], // diagonal /
  ];

  // ─── State ───────────────────────────────────────────────────
  let board        = Array(9).fill(null); // null | 'X' | 'O'
  let currentPlayer = 'X';
  let gameOver     = false;
  let scores       = { X: 0, O: 0, Draw: 0 };

  // ─── DOM refs ────────────────────────────────────────────────
  const cells         = document.querySelectorAll('.cell');
  const statusEl      = document.getElementById('status');
  const winsXEl       = document.getElementById('wins-x');
  const winsOEl       = document.getElementById('wins-o');
  const winsDrawEl    = document.getElementById('wins-draw');
  const overlay       = document.getElementById('overlay');
  const overlayMsg    = document.getElementById('overlay-message');
  const btnRestart    = document.getElementById('btn-restart');
  const btnNext       = document.getElementById('btn-next');
  const btnResetScores = document.getElementById('btn-reset-scores');

  // ─── Helpers ─────────────────────────────────────────────────

  /** Check if the current board has a winner. Returns { winner, combo } or null. */
  function checkWinner() {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combo };
      }
    }
    return null;
  }

  /** Returns true when all 9 squares are filled. */
  function isBoardFull() {
    return board.every(cell => cell !== null);
  }

  /** Render the status line with coloured player name. */
  function setStatus(html) {
    statusEl.innerHTML = html;
  }

  /** Update all three score displays. */
  function updateScoreboard() {
    winsXEl.textContent    = scores.X;
    winsOEl.textContent    = scores.O;
    winsDrawEl.textContent = scores.Draw;
  }

  /** Show the end-of-round overlay with the result message. */
  function showOverlay(html) {
    overlayMsg.innerHTML = html;
    overlay.classList.remove('hidden');
  }

  /** Hide the end-of-round overlay. */
  function hideOverlay() {
    overlay.classList.add('hidden');
  }

  // ─── Core Game Logic ─────────────────────────────────────────

  /** Handle a click on a board cell. */
  function handleCellClick(e) {
    const index = Number(e.currentTarget.dataset.index);

    // Ignore if game is over or cell already taken
    if (gameOver || board[index] !== null) return;

    // Place the mark
    board[index] = currentPlayer;
    const cellEl = cells[index];
    cellEl.textContent = currentPlayer;
    cellEl.classList.add(currentPlayer.toLowerCase(), 'taken', 'pop');

    // Check for a winner
    const result = checkWinner();
    if (result) {
      gameOver = true;
      scores[result.winner]++;
      updateScoreboard();

      // Highlight winning cells
      result.combo.forEach(i => cells[i].classList.add('winner'));

      setStatus('');
      showOverlay(
        `<span class="${result.winner.toLowerCase()}">${result.winner}</span> wins! 🎉`
      );
      return;
    }

    // Check for a draw
    if (isBoardFull()) {
      gameOver = true;
      scores.Draw++;
      updateScoreboard();
      setStatus('');
      showOverlay('<span class="draw">It\'s a draw!</span> 🤝');
      return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setStatus(
      `Player <span class="${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`
    );
  }

  /** Reset the board for a new round (scores are kept). */
  function restartGame() {
    board         = Array(9).fill(null);
    currentPlayer = 'X';
    gameOver      = false;

    cells.forEach(cell => {
      cell.textContent = '';
      cell.className   = 'cell'; // strip all state classes
    });

    setStatus(
      `Player <span class="x">X</span>'s turn`
    );
    hideOverlay();
  }

  /** Reset scores AND restart the board. */
  function resetScores() {
    scores = { X: 0, O: 0, Draw: 0 };
    updateScoreboard();
    restartGame();
  }

  // ─── Event Listeners ─────────────────────────────────────────
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  btnRestart.addEventListener('click', restartGame);
  btnNext.addEventListener('click', restartGame);
  btnResetScores.addEventListener('click', resetScores);

  // ─── Init ─────────────────────────────────────────────────────
  updateScoreboard();
}());
