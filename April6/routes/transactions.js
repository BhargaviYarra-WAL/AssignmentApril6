const express = require("express");
const router = express.Router();
const User = require("../models").User;
const Balance = require("../models").Balance;
const TransactionModel = require("../models").Transaction;
const { sequelize } = require("../models");
router.get("/getuser", (req, res) => {
  User.findAll().then(
    (users) => {
      res.json(users);
    },
    (error) => {
      res.json(error);
    }
  );
});
router.post("/adduser", (req, res) => {
  const { username, password } = req.body;
  User.create({ username, password }).then(
    (user) => {
      res.json(user);
    },
    (error) => {
      res.json(error);
    }
  );
});
router.get("/addbalance", (req, res) => {
  Balance.findAll({ include: User }).then(
    (balances) => {
      res.json(balances);
    },
    (error) => {
      res.json(error);
    }
  );
});
router.post("/getbalance", (req, res) => {
  const { balance, userId } = req.body;
  Balance.create({ balance, userId }).then(
    (balance) => {
      res.json(balance);
    },
    (err) => {
      res.json(err);
    }
  );
});
router.get("/transactions", (req, res) => {
  TransactionModel.findAll().then(
    (transactions) => {
      res.json(transactions);
    },
    (error) => {
      res.json(error);
    }
  );
});
router.post("/addtransaction", (req, res) => {
  const { amount, userId } = req.body;
  TransactionModel.create({ amount, userId }).then(
    (transaction) => {
      res.json(transaction);
    },
    (error) => {
      res.json(error);
    }
  );
});
router.put("/", async (req, res) => {
  const { senderName, recieverName, transaction_amount } = req.body;
  let transaction;
  const sender = await User.findOne({
    where: { username: senderName },
  });
  console.log(sender);
  if (sender === null) {
    res.json({ status: 0, data: "no sender" });
  } else {
    const reciever = await User.findOne({
      where: { username: recieverName },
    });
    if (reciever === null) {
      res.json({ status: 0, data: "no receiver" });
    } else {
      try {
        transaction = await sequelize.transaction();
        const sender_balance = await Balance.findOne({
          where: { userId: sender.id },
        });
        if (sender_balance.balance - transaction_amount < 0) {
          res.json({ status: 0, data: "sender has less balance" });
        } else {
          const reciever_balance = await Balance.findOne({
            where: { userId: reciever.id },
          });
          await Balance.update(
            {
              balance:
                Number(sender_balance.balance) - Number(transaction_amount),
            },
            { where: { userId: sender.id } },
            { transaction }
          );
          await Balance.update(
            {
              balance:
                Number(reciever_balance.balance) + Number(transaction_amount),
            },
            { where: { userId: reciever.id } },
            { transaction }
          );
          await TransactionModel.create(
            { amount: transaction_amount, userId: sender.id },
            { transaction }
          );
          console.log("success");
          await transaction.commit();
          res.json({ status: 1, data: "transaction done" });
        }
      } catch (error) {
        console.log("error");
        if (transaction) {
          await transaction.rollback();
        }
        res.json(error);
      }
    }
  }
});

module.exports = router;
