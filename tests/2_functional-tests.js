const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
import {
  puzzlesAndSolutions,
  invalidStrings,
  unsolvableStrings,
  wrongLengthStrings,
} from '../controllers/puzzle-strings';

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve',
    (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: puzzlesAndSolutions[0][0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve',
    (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

  test('Solve a puzzle with invalid characters: POST request to /api/solve',
    (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: invalidStrings[0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

  test('Solve a puzzle with incorrect length: POST request to /api/solve',
    (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: wrongLengthStrings[0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve',
    (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({puzzle: unsolvableStrings[0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });

  test('Check a puzzle placement with all fields: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '3'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });

  test(
    'Check a puzzle placement with single placement conflict: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '4'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.include(res.body.conflict, 'row');
          assert.notInclude(res.body.conflict, 'region');
          assert.notInclude(res.body.conflict, 'column');
          done();
        });
    });

  test(
    'Check a puzzle placement with multiple placement conflicts: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '5'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'region');
          assert.notInclude(res.body.conflict, 'column');
          done();
        });
    });

  test(
    'Check a puzzle placement with all placement conflicts: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '2'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'region');
          assert.include(res.body.conflict, 'column');
          done();
        });
    });

  test(
    'Check a puzzle placement with missing required fields: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

  test(
    'Check a puzzle placement with invalid characters: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: invalidStrings[0], coordinate: 'A2', value: '3'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

  test(
    'Check a puzzle placement with incorrect length: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: wrongLengthStrings[0], coordinate: 'A2', value: '3'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            'Expected puzzle to be 81 characters long',
          );
          done();
        });
    });

  test(
    'Check a puzzle placement with invalid placement coordinate: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzlesAndSolutions[0], coordinate: 'J0', value: '3'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

  test(
    'Check a puzzle placement with invalid placement value: POST request to /api/check',
    (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({puzzle: puzzlesAndSolutions[0], coordinate: 'A2', value: '22'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
});

