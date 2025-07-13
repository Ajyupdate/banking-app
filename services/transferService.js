const Transfer = require("../models/Transfer");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const RavenAtlasService = require("./ravenAtlasService");
const { formatAmount } = require("../utils/helpers");
const logger = require("../utils/logger");

class TransferService {
  async initiateTransfer(userId, accountId, transferData) {
    try {
      // Verify account exists and belongs to user
      const account = await Account.findById(accountId);
      if (!account || account.user_id !== userId) {
        throw new Error("Account not found or does not belong to user");
      }

      // Check if account has sufficient balance
      if (parseFloat(account.balance) < parseFloat(transferData.amount)) {
        throw new Error("Insufficient balance");
      }

      // Create transfer record
      const transfer = await Transfer.create({
        account_id: accountId,
        amount: transferData.amount,
        recipient_name: transferData.recipient_name,
        recipient_account: transferData.recipient_account,
        recipient_bank: transferData.recipient_bank,
        recipient_bank_code: transferData.recipient_bank_code,
        narration: transferData.narration,
        status: "pending",
      });

      console.log(transfer, 34);

      // Create transaction record
      const transaction = await Transaction.create({
        user_id: userId,
        account_id: accountId,
        reference: transfer.reference,
        type: "transfer",
        amount: transfer.amount,
        balance_before: account.balance,
        balance_after:
          parseFloat(account.balance) - parseFloat(transfer.amount),
        status: "pending",
        counterparty: transfer.recipient_name,
        counterparty_account: transfer.recipient_account,
        counterparty_bank: transfer.recipient_bank,
        narration:
          transfer.narration || `Transfer to ${transfer.recipient_name}`,
      });
      console.log("after transaction 53");

      // Initiate transfer with Raven Atlas
      const ravenResponse = await RavenAtlasService.initiateTransfer({
        amount: transferData.amount,
        recipient_account: transferData.recipient_account,
        recipient_bank: transferData.recipient_bank_code,
        narration: transferData.narration,
        reference: transfer.reference,
      });
      console.log("after ravenResponse 63");

      // Update transfer status based on Raven response
      if (ravenResponse.status === "success") {
        await Transfer.updateStatus(transfer.reference, "completed");
        await Transaction.updateStatus(transfer.reference, "completed");
        await Account.updateBalance(accountId, transferData.amount, "debit");
      } else {
        await Transfer.updateStatus(transfer.reference, "failed");
        await Transaction.updateStatus(transfer.reference, "failed");
        throw new Error(ravenResponse.message || "Transfer failed");
      }

      return await Transfer.findByReference(transfer.reference);
    } catch (error) {
      logger.error(`TransferService.initiateTransfer error: ${error.message}`);

      // If transfer was created but failed, update status
      if (transfer && transfer.reference) {
        await Transfer.updateStatus(transfer.reference, "failed");
        await Transaction.updateStatus(transfer.reference, "failed");
      }

      throw error;
    }
  }

  async getTransferById(transferId) {
    try {
      const transfer = await Transfer.findById(transferId);
      if (!transfer) {
        throw new Error("Transfer not found");
      }
      return transfer;
    } catch (error) {
      logger.error(`TransferService.getTransferById error: ${error.message}`);
      throw error;
    }
  }

  async getTransfersByAccount(accountId) {
    try {
      const transfers = await Transfer.findByAccountId(accountId);
      return transfers;
    } catch (error) {
      logger.error(
        `TransferService.getTransfersByAccount error: ${error.message}`
      );
      throw error;
    }
  }

  async getBanks() {
    try {
      const banks = await RavenAtlasService.listBanks();
      return banks;
    } catch (error) {
      logger.error(`TransferService.getBanks error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TransferService();
