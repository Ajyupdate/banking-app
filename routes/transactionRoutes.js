const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.get('/', auth, transactionController.getUserTransactions);
router.get('/:id', auth, transactionController.getTransaction);
router.get('/account/:accountId', auth, transactionController.getAccountTransactions);
router.get('/type/:type', auth, transactionController.getTransactionsByType);

module.exports = router;