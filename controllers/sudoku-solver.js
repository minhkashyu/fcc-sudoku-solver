class SudokuSolver {
  getPuzzleArray(puzzleString) {
    let puzzleArray = [];

    for (let i = 0; i < 9; i++) {
      puzzleArray.push(puzzleString.slice(i * 9, (i + 1) * 9).split(''));
    }

    return puzzleArray;
  }

  checkRowPlacement(puzzleArray, row, value) {
    if (typeof puzzleArray[row] === 'undefined') {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      if (typeof puzzleArray[row][i] === 'undefined'
        || puzzleArray[row][i] === value
      ) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleArray, col, value) {
    for (let i = 0; i < 9; i++) {
      if (typeof puzzleArray[i] === 'undefined'
        || typeof puzzleArray[i][col] === 'undefined'
        || puzzleArray[i][col] === value
      ) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleArray, row, col, value) {
    for (let i = 0; i < 9; i++) {
      let rRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      let rCol = 3 * Math.floor(col / 3) + i % 3;

      if (typeof puzzleArray[rRow] === 'undefined'
        || typeof puzzleArray[rRow][rCol] === 'undefined'
        || puzzleArray[rRow][rCol] === value
      ) {
        return false;
      }
    }
    return true;
  }

  isValidPlacement(puzzleArray, row, col, value) {
    for (let i = 0; i < 9; i++) {
      let rRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      let rCol = 3 * Math.floor(col / 3) + i % 3;

      if (typeof puzzleArray[row] === 'undefined'
        || typeof puzzleArray[row][i] === 'undefined'
        || puzzleArray[row][i] === value
        || typeof puzzleArray[i] === 'undefined'
        || typeof puzzleArray[i][col] === 'undefined'
        || puzzleArray[i][col] === value
        || typeof puzzleArray[rRow] === 'undefined'
        || typeof puzzleArray[rRow][rCol] === 'undefined'
        || puzzleArray[rRow][rCol] === value
      ) {
        return false;
      }
    }
    return true;
  }

  setCharAt(str, index, chr) {
    if (index > str.length - 1) {
      return str;
    }
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }

    if (!/^[.1-9]+$/.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }

    for (let i = 0; i < puzzleString.length; i++) {
      let val = puzzleString[i];
      let row = Math.floor(i / 9);
      let col = i % 9;

      if (val !== '.') {
        let tempPuzzleString = this.setCharAt(puzzleString, i, '.');
        let tempPuzzleArray = this.getPuzzleArray(tempPuzzleString);

        if (!this.isValidPlacement(tempPuzzleArray, row, col, val)) {
          return 'Puzzle cannot be solved';
        }
      }
    }

    return true;
  }

  // Define the backtracking function to solve the puzzle
  backtrack(puzzleArray) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzleArray[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            if (this.isValidPlacement(puzzleArray, row, col, num.toString())) {
              puzzleArray[row][col] = num.toString();
              if (this.backtrack(puzzleArray)) {
                return puzzleArray;
              }
              puzzleArray[row][col] = '.'; // Backtrack
            }
          }
          return false; // No valid number found
        }
      }
    }
    return puzzleArray; // All cells are filled
  }

  solve(puzzleString) {
    let error = this.validate(puzzleString);

    if (error !== true) {
      throw new Error(error);
    }

    // Convert the string to a 2D array
    let puzzleArray = this.getPuzzleArray(puzzleString);
    let solvedPuzzleArray = this.backtrack(puzzleArray);

    if (!solvedPuzzleArray) {
      throw new Error('Puzzle cannot be solved');
    }

    // Convert the 2D array back to a string
    return solvedPuzzleArray.map(row => row.join('')).join('');
  }
}

module.exports = SudokuSolver;

