const DepositService = require("../services/depositService");
const auth = require("../middleware/auth");
const logger = require("../utils/logger");
const Account = require("../models/Account");

class DepositController {
  async processWebhook(req, res, next) {
    try {
      // 1. Verify webhook secret

      if (req.body.secret !== process.env.WEBHOOK_SECRET) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      // 2. Extract payload
      const payload = req.body;

      // 3. Only process successful credit transactions
      if (payload.status !== "successful" || payload.type !== "transfer") {
        return res.status(200).json({
          success: true,
          message: "Non-credit transaction ignored",
        });
      }

      // 4. Find account by account number
      const account = await Account.findByAccountNumber(
        payload.meta.account_number
      );
      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Account not found",
        });
      }

      const amount = parseFloat(payload.meta.amount);

      // 6. Create deposit record
      const deposit = await DepositService.createDeposit(account.id, {
        amount: amount,
        reference: payload.trx_ref,
        sender_name: payload.meta.account_name || "Unknown",
        sender_account: payload.merchant_ref || "Unknown",
        sender_bank: "External Bank", // Could parse from narration if available
        currency: payload.meta.currency,
        narration: payload.meta.narration,
        metadata: JSON.stringify(payload), // Store full payload for reference
      });

      // 7. Process deposit (update balance)
      await DepositService.processDeposit(deposit.reference);

      res.status(200).json({
        success: true,
        message: "Deposit processed successfully",
      });
    } catch (error) {
      logger.error(`DepositController.processWebhook error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async getDeposit(req, res, next) {
    try {
      const depositId = req.params.id;
      const deposit = await DepositService.getDepositById(depositId);

      res.status(200).json({
        success: true,
        data: deposit,
      });
    } catch (error) {
      logger.error(`DepositController.getDeposit error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async getDeposits(req, res, next) {
    try {
      const accountId = req.params.accountId;
      const deposits = await DepositService.getDepositsByAccount(accountId);

      res.status(200).json({
        success: true,
        data: deposits,
      });
    } catch (error) {
      logger.error(`DepositController.getDeposits error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }
}

module.exports = new DepositController();
