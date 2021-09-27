const express = require("express");
const mongoose = require("mongoose");
const checkLogin = require("../middlewares/checkLogin");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");

//creating Data model
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

//GET ACTIVE TODOS USING CUSTOM INSTANCE METHOD with async await
router.get("/active", async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong in the server side",
    });
  }
});

//GET ACTIVE TODOS USING CUSTOME INSTANCE WITH CALLBACK
router.get("/active-callback", (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    if (!err) {
      res.status(200).json({
        data,
      });
    } else {
      res.status(500).json({
        error: "Something went wrong in the server side",
      });
    }
  });
});

//GET DATA WITH JS STRING USING STATIC METHOD
router.get("/js", async (req, res) => {
  try {
    const data = await Todo.findByJs();
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error:'There is problem with server side'
    });
  }
});


//GET DATA USING QUERY HELPER
router.get("/language", async (req, res) => {
    try {
      const data = await Todo.find().byLanguage('Node');
      res.status(200).json({
        data,
      });
    } catch (error) {
      res.status(500).json({
        error:'There is problem with server side'
      });
    }
  });

//GET  ALL TODOS
router.get("/", checkLogin, (req, res) => {
  Todo.find({})
    .populate("user", "name username -_id")
    .select({
      _id: 0, // don't want to show
      __v: 0,
      date: 0,
    })
    .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error",
        });
      } else {
        res.status(200).json({
          result: data,
          message: "Todo was retrieved successfully",
        });
      }
    });
});

//GET A TODO BY ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.findOne({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: "Single Todo was retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

//POST A TODO
router.post("/", checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId
  });
  try {
    const todo = await newTodo.save()
    await User.updateOne({
      _id: req.userId
    },{
      $push: {
        todos: todo._id
      }
    })
    res.status(200).json({
      message: "Todo was inserted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

//POST MULTIPLE TODOS
router.post("/all", (req, res) => {
  Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        message: "Todo were inserted successfully",
      });
    }
  });
});

//PUT TODO BY ID
router.put("/:id", (req, res) => {
  // await Todo.updateOne

  Todo.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: "inactive",
      },
    },
    {
      new: true,
    },
    (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error",
        });
      } else {
        res.status(200).json({
          message: "Todo was updated successfully",
        });
      }
    }
  );
  //   console.log(result);
});

//DELETE TODO
router.delete("/:id", async (req, res) => {
  try {
    const data = await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: "Todo was deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

module.exports = router;
