'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      try {
        let puzzleString = req.body.puzzle;
        let coordinate = req.body.coordinate;
        let value = req.body.value;

        if (!puzzleString || !coordinate || !value) {
          throw new Error('Required field(s) missing');
        }

        if (!(value > 0) || !(value < 10)) {
          throw new Error('Invalid value');
        }

        if (!/^[A-I][1-9]$/.test(coordinate)) {
          throw new Error('Invalid coordinate');
        }

        let error = solver.validate(puzzleString);

        if (error !== true) {
          throw new Error(error);
        }

        let row = coordinate[0].charCodeAt(0) - 65;
        let col = coordinate[1] - 1;
        let conflict = [];

        let puzzleArray = solver.getPuzzleArray(puzzleString);

        // If value submitted to /api/check is already placed in puzzle
        // on that coordinate, the returned value will be an object
        // containing a valid property with true if value is not conflicting.
        if (typeof puzzleArray[row] !== 'undefined'
          && typeof puzzleArray[row][col] !== 'undefined'
          && puzzleArray[row][col] === value
        ) {
          return res.json({valid: true});
        }

        if (!solver.checkRowPlacement(puzzleArray, row, value)) {
          conflict.push('row');
        }

        if (!solver.checkColPlacement(puzzleArray, col, value)) {
          conflict.push('column');
        }

        if (!solver.checkRegionPlacement(puzzleArray, row, col, value)) {
          conflict.push('region');
        }

        if (conflict.length === 0) {
          return res.json({valid: true});
        } else {
          return res.json({valid: false, conflict: conflict});
        }
      } catch (e) {
        return res.json({error: e.message});
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      try {
        let puzzleString = req.body.puzzle || '';

        if (!puzzleString) {
          return res.json({error: 'Required field missing'});
        }

        let solvedPuzzleString = solver.solve(puzzleString);

        res.json({ solution: solvedPuzzleString });
      } catch (e) {
        return res.json({error: e.message});
      }
    });
};
