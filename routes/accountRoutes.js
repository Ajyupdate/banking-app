const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const auth = require('../middleware/auth');

router.post('/', auth, accountController.createAccount);
router.get('/', auth, accountController.getUserAccounts);
router.get('/:id', auth, accountController.getAccount);
router.get('/number/:accountNumber', auth, accountController.getAccountByNumber);

module.exports = router;


