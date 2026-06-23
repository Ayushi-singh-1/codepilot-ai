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

    let healthScore = "";

    if (repo.stars > 100000) {
      healthScore = "Excellent";
    } else if (repo.stars > 10000) {
      healthScore = "Good";
    } else if (repo.stars > 1000) {
      healthScore = "Moderate";
    } else {
      healthScore = "Small Project";
    }

    let techCategory = "";

    switch (repo.language) {
      case "JavaScript":
        techCategory = "Frontend / Web Development";
        break;

      case "TypeScript":
        techCategory = "Scalable Web Applications";
        break;

      case "Python":
        techCategory = "AI / Data Engineering";
        break;

      case "Java":
        techCategory = "Enterprise Applications";
        break;

      default:
        techCategory = "General Software Development";
    }

    res.json({
      repository: repo.repo_name,
      owner: repo.owner_name,
      summary: repo.description,
      language: repo.language,
      stars: repo.stars,
      healthScore,
      techCategory,
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