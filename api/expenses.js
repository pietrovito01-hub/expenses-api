export const config = {
  runtime: "nodejs"
};

import crypto from "crypto";

let expenses = [];

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        data: expenses
      });
    }

    if (req.method === "POST") {
      const { description, amount } = req.body || {};

      if (!description || amount === undefined) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: description and amount"
        });
      }

      const parsedAmount = Number(amount);
      if (Number.isNaN(parsedAmount)) {
        return res.status(400).json({
          success: false,
          error: "Amount must be a valid number"
        });
      }

      const expense = {
        id: crypto.randomUUID(),
        description: description.trim(),
        amount: parsedAmount,
        timestamp: new Date().toISOString()
      };

      expenses.push(expense);

      return res.status(201).json({
        success: true,
        data: expense
      });
    }

    return res.status(405).json({
      success: false,
      error: "Method Not Allowed"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
}
