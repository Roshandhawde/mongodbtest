const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3111;

// MongoDB connection
const mongodbUrl =
  "mongodb+srv://testuser:testuser@expanse-tracker.yvyh4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json()); // Body parser for JSON
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Mongoose Schema
const ExpenseTrackerSchema = new mongoose.Schema(
  {
    emailId: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", ExpenseTrackerSchema);

// Fetch All Expenses
app.get("/", async (req, res) => {
  try {
    const data = await Expense.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ code: 500, message: "Error fetching expenses" });
  }
});

// Create New Expense
app.post("/saveUser", async (req, res) => {
  try {
    // Check if a user with the same emailId already exists
    const existingUser = await Expense.findOne({ emailId: req.body.emailId });

    if (existingUser) {
      // If user with the same emailId exists, return an error message
      return res
        .status(200)
        .json({ code: 200, message: "User with this email already exists" });
    }

    // If no user with the same emailId exists, create a new user
    const newExpense = new Expense(req.body);
    await newExpense.save();

    res.status(200).json({ code: 200, message: "User saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: "Error saving user" });
  }
});

// // Edit Expense
// app.put("/editExpense/:expId", async (req, res) => {
//   try {
//     const { expId } = req.params;
//     const { expAmount } = req.body;

//     const updatedExpense = await Expense.findByIdAndUpdate(
//       expId,
//       { expAmount },
//       { new: true }
//     );

//     if (!updatedExpense) {
//       return res.status(404).json({ code: 404, message: "Expense not found" });
//     }

//     res.status(200).json({
//       code: 200,
//       message: "Expense updated successfully",
//       updatedExpense,
//     });
//   } catch (err) {
//     res.status(500).json({ code: 500, message: err.message });
//   }
// });

// Delete Expense
// app.delete("/deleteExpense/:expId", async (req, res) => {
//   try {
//     const { expId } = req.params;

//     const deletedExpense = await Expense.findByIdAndDelete(expId);

//     if (!deletedExpense) {
//       return res.status(404).json({ code: 404, message: "Expense not found" });
//     }

//     res
//       .status(200)
//       .json({ code: 200, message: "Expense deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ code: 500, message: err.message });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
