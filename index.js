const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bodyParser = require("body-parser");

const app = express();
const port = 3111;
const mongodbUrl =
  "mongodb+srv://testuser:testuser@expanse-tracker.yvyh4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept"
  );
  next();
});

const ExpenseTracker = new Schema(
  {
    emailId: { type: String, required: true, default: "" },
    phoneNumber: { type: Number, required: true, default: 0 },
    // expDate: { type: Date, required: true, default: new Date() },
  },
  { timestamps: true } //timestampe 2 created on and updated on and unique id 16 car value
);

const Expense = mongoose.model("express", ExpenseTracker);

/*Expense({expName:'roshan', expAmount:100, expDate: new Date()})
.save()
.then( ()=> console.log('saved'))
.catch((err)=>{throw err;
}); */

Expense.find().then((expenses) => console.log(expenses.length));

//
app.get("/", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

app.post("/saveUser", bodyParser.json(), (req, res) => {
  console.log("req.body==>", req.body);
  Expense(req.body)
    .save()
    .then(() => {
      console.log("New Expense");
      res.json({ message: "Expense saved" });
    });
});

// root file
app.listen(port, () => {
  console.log(`to port ${port}`);
});

/*fetch('http://localhost:3111/')
.then(response => console.log(response.text()))
.then(data => {console.log(data)});*/

//can use post in place of put
app.put("/editExpense/:expId", async (req, res) => {
  try {
    const { expAmount } = req.body;
    const { expId } = req.params; // params= parameters=:expId
    //const expense= await Expense.findById({_id:expId});
    const expense = await Expense.findByIdAndUpdate(
      { _id: expId },
      { expAmount }
    );
    //expense.expName=expName;
    await expense.save();
    res.send({ code: 1, Message: "updated expense successfully" });
  } catch (err) {
    res.send({ code: 0, message: err.message });
  }
});

/*fetch('http://localhost:3111/saveExpense', {
    headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json'
    },
    method:'POST',
    body:JSON.stringify({expName:'Phone Repair', expAmt:1000, expDate:new Date()})
})
.then(response => console.log(response.text()))
.then(data => {console.log(data)})

fetch('http://localhost:3111/aditExpense/:_Id', {
    headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json'
    },
    method:'PUT',
    body:JSON.stringify({expName:'Phone Repair'})
})
.then(response => console.log(response.text()))
.then(data => {console.log(data)})

fetch('http://localhost:3111/deleteExpense/6142b5ddd3535ce55cb8e7fb', {
    
    method:'DELETE',
    
})
.then(response => console.log(response.text()))
.then(data => {console.log(data)})
*/
app.delete("/deleteExpense/:expId", async (req, res) => {
  try {
    const { expId } = req.params; // params= parameters=:expId
    await Expense.findByIdAndDelete({ _id: expId });
    res.send({ code: 1, Message: "updated expense successfully" });
  } catch (err) {
    res.send({ code: 0, message: err.message });
  }
});
