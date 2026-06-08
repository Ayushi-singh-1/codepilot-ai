const express = require("express");
const cors = require("cors");

const repositoryRoutes = require("./routes/repositoryRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/repositories", repositoryRoutes);
app.use("/api/analysis", analysisRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "CodePilot API Running",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error Handlers
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:");
  console.error(err);
});