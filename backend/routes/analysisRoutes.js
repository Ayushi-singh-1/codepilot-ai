const express = require("express");
const router = express.Router();
const pool = require("../db/db");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM repositories WHERE id = $1",
      [id]
    );

    const repo = result.rows[0];

    if (!repo) {
      return res.status(404).json({
        error: "Repository not found",
      });
    }

    res.json({
      repository: repo.repo_name,
      owner: repo.owner_name,
      summary: repo.description,
      language: repo.language,
      stars: repo.stars,
      recommendation:
        "Suitable for software engineering projects and open-source contribution.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;