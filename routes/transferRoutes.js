const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const auth = require('../middleware/auth');

router.post('/', auth, transferController.initiateTransfer);
router.get('/banks', auth, transferController.getBanks);
router.get('/:id', auth, transferController.getTransfer);
router.get('/account/:accountId', auth, transferController.getTransfers);

module.exports = router;