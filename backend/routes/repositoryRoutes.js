const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const { getRepositoryData } = require("../services/githubService");

console.log("Repository routes loaded");

// GET all repositories
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM repositories ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

// IMPORT repository
router.post("/import", async (req, res) => {
  try {
    const { githubUrl } = req.body;

    const existingRepo = await pool.query(
      "SELECT * FROM repositories WHERE github_url = $1",
      [githubUrl]
    );

    if (existingRepo.rows.length > 0) {
      return res.status(400).json({
        error: "Repository already imported",
      });
    }

    const repoData = await getRepositoryData(githubUrl);

    const result = await pool.query(
      `
      INSERT INTO repositories
      (
        github_url,
        repo_name,
        owner_name,
        description,
        stars,
        language
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        githubUrl,
        repoData.name,
        repoData.owner.login,
        repoData.description,
        repoData.stargazers_count,
        repoData.language,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// DELETE repository
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM repositories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Repository not found",
      });
    }

    res.json({
      message: "Repository deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;