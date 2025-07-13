const axios = require("axios");
const { generateReference } = require("../utils/helpers");
const logger = require("../utils/logger");

class RavenAtlasService {
  constructor() {
    this.baseURL = process.env.RAVEN_API_BASE_URL;
    this.apiKey = process.env.RAVEN_API_KEY;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async initiateTransfer(transferData) {
    console.log(transferData, 16);
    try {
      const reference = generateReference();
      const payload = {
        reference,
        ...transferData,
      };

      console.log(this.apiKey, "here 24");
      console.log(this.baseURL);
      const response = await axios.post(
        `${this.baseURL}/transfers/create`,
        payload,
        {
          headers: this.headers,
        }
      );
      console.log(response, "response 27");

      return response.data;
    } catch (error) {
      logger.error(
        `RavenAtlasService.initiateTransfer error: ${error.message}`
      );
      res.status(500).json({
        success: false,
        message: error.message,
      });
      if (error.response) {
        logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async verifyTransfer(reference) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transfers/${reference}`,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      logger.error(`RavenAtlasService.verifyTransfer error: ${error.message}`);
      if (error.response) {
        logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async listBanks() {
    try {
      const response = await axios.get(`${this.baseURL}/banks`, {
        headers: this.headers,
      });

      return response.data;
    } catch (error) {
      logger.error(`RavenAtlasService.listBanks error: ${error.message}`);
      if (error.response) {
        logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}

module.exports = new RavenAtlasService();
