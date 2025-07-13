const Deposit = require("../models/Deposit");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { formatAmount } = require("../utils/helpers");
const logger = require("../utils/logger");

class DepositService {
  async createDeposit(accountId, depositData) {
    try {
      // Verify account exists
      const account = await Account.findById(accountId);
      if (!account) {
        throw new Error("Account not found");
      }

      console.log("depositservice 16");
      // Create deposit record
      const { narration, ...depositDataWithoutNarration } = depositData;

      const deposit = await Deposit.create({
        account_id: accountId,
        ...depositDataWithoutNarration,
      });

      // Confirm deposit was actually created
      if (!deposit || !deposit.id) {
        throw new Error("Failed to create deposit record");
      }

      // Optional: Fetch the created deposit to double-check
      const createdDeposit = await Deposit.findById(deposit.id);
      if (!createdDeposit) {
        throw new Error("Deposit creation verification failed");
      }

      console.log("Deposit confirmed, proceeding with transaction creation");

      // Create transaction record
      const transaction = await Transaction.create({
        user_id: account.user_id,
        account_id: accountId,
        reference: deposit.reference,
        type: "deposit",
        amount: deposit.amount,
        balance_before: account.balance,
        balance_after: parseFloat(account.balance) + parseFloat(deposit.amount),
        status: "pending",
        counterparty: deposit.sender_name,
        counterparty_account: deposit.sender_account,
        counterparty_bank: deposit.sender_bank,
        narration: `Deposit from ${deposit.sender_name}`,
      });

      return deposit;
    } catch (error) {
      logger.error(`DepositService.createDeposit error: ${error.message}`);
      throw error;
    }
  }

  async processDeposit(reference) {
    try {
      // Find deposit by reference
      const deposit = await Deposit.findByReference(reference);
      if (!deposit) {
        throw new Error("Deposit not found");
      }

      if (deposit.status === "completed") {
        return deposit;
      }

      // Update account balance
      const account = await Account.updateBalance(
        deposit.account_id,
        deposit.amount,
        "credit"
      );

      // Update deposit status
      await Deposit.updateStatus(reference, "completed");

      // Update transaction status
      await Transaction.updateStatus(reference, "completed");

      return await Deposit.findByReference(reference);
    } catch (error) {
      logger.error(`DepositService.processDeposit error: ${error.message}`);
      throw error;
    }
  }

  async getDepositById(depositId) {
    try {
      const deposit = await Deposit.findById(depositId);
      if (!deposit) {
        throw new Error("Deposit not found");
      }
      return deposit;
    } catch (error) {
      logger.error(`DepositService.getDepositById error: ${error.message}`);
      throw error;
    }
  }

  async getDepositsByAccount(accountId) {
    try {
      const deposits = await Deposit.findByAccountId(accountId);
      return deposits;
    } catch (error) {
      logger.error(
        `DepositService.getDepositsByAccount error: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = new DepositService();
