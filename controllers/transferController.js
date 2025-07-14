const TransferService = require("../services/transferService");
const auth = require("../middleware/auth");
const logger = require("../utils/logger");

class TransferController {
  async initiateTransfer(req, res, next) {
    try {
      console.log(req.user, "req.user 8");
      const userId = req.user.id;

      const {
        accountId,
        amount,
        recipientAccount,
        recipientBankCode,
        recipientName,
        narration,
      } = req.body;

      const transfer = await TransferService.initiateTransfer(
        userId,
        accountId,
        {
          amount,
          recipient_account: recipientAccount,
          recipient_bank_code: recipientBankCode,
          recipient_name: recipientName,
          recipient_bank: recipientBankCode,
          narration,
        }
      );

      res.status(201).json({
        success: true,
        data: transfer,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        return res.status(error.response.status || 400).json({
          success: false,
          message: error.response.data.message || "Transfer failed",
          details: error.response.data,
        });
      }

      // For other types of errors
      logger.error(
        `TransferController.initiateTransfer error: ${error.message}`
      );
      res.status(400).json({
        success: false,
        message: error.message || "Transfer failed",
      });
    }
  }

  async getTransfer(req, res, next) {
    try {
      const transferId = req.params.id;
      const transfer = await TransferService.getTransferById(transferId);

      res.status(200).json({
        success: true,
        data: transfer,
      });
    } catch (error) {
      logger.error(`TransferController.getTransfer error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async getTransfers(req, res, next) {
    try {
      const accountId = req.params.accountId;
      const transfers = await TransferService.getTransfersByAccount(accountId);

      res.status(200).json({
        success: true,
        data: transfers,
      });
    } catch (error) {
      logger.error(`TransferController.getTransfers error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async getBanks(req, res, next) {
    try {
      const banks = await TransferService.getBanks();

      res.status(200).json({
        success: true,
        data: banks,
      });
    } catch (error) {
      logger.error(`TransferController.getBanks error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }
}

module.exports = new TransferController();
