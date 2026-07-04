const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/customers", require("./routes/customerRoutes"));
app.use("/visitors", require("./routes/visitorRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));

// Default Route
app.get("/", (req, res) => {
  res.json({ message: "Mini Visitor CRM API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
