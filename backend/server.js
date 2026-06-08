const express = require("express");
const cors = require("cors");

const repositoryRoutes = require("./routes/repositoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/repositories", repositoryRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CodePilot API Running"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:");
  console.error(err);
});