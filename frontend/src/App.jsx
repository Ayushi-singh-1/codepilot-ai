import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [githubUrl, setGithubUrl] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("stars");

  const fetchRepositories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/repositories"
      );

      setRepositories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const importRepository = async () => {
    if (!githubUrl.includes("github.com")) {
      alert("Please enter a valid GitHub URL");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/repositories/import",
        {
          githubUrl,
        }
      );

      setGithubUrl("");
      fetchRepositories();

      alert("Repository imported successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Failed to import repository"
      );
    }
  };

  const analyzeRepository = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/analysis/${id}`
      );

      setAnalysis(response.data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed");
    }
  };

  const deleteRepository = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/repositories/${id}`
      );

      setAnalysis(null);
      fetchRepositories();

      alert("Repository deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  // Statistics
  const totalRepositories = repositories.length;

  const totalStars = repositories.reduce(
    (sum, repo) => sum + (repo.stars || 0),
    0
  );

  const mostPopularRepo =
    repositories.length > 0
      ? repositories.reduce((prev, current) =>
          prev.stars > current.stars ? prev : current
        )
      : null;

  const filteredRepositories = repositories
    .filter((repo) =>
      repo.repo_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "stars") {
        return (b.stars || 0) - (a.stars || 0);
      }

      return a.repo_name.localeCompare(b.repo_name);
    });

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>🚀 CodePilot AI</h1>

      <p>
        Import GitHub repositories and analyze them.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter GitHub Repository URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          style={{
            width: "500px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />

        <button
          onClick={importRepository}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          Import Repository
        </button>
      </div>

      {analysis && (
        <div
          style={{
            border: "2px solid #4CAF50",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "25px",
            backgroundColor: "#f8fff8",
          }}
        >
          <h2>📊 Repository Analysis</h2>

          <p>
            <strong>Repository:</strong> {analysis.repository}
          </p>

          <p>
            <strong>Owner:</strong> {analysis.owner}
          </p>

          <p>
            <strong>Language:</strong> {analysis.language}
          </p>

          <p>
            <strong>Stars:</strong> {analysis.stars}
          </p>

          <p>
            <strong>Health Score:</strong> {analysis.healthScore}
          </p>

          <p>
            <strong>Technology Area:</strong>{" "}
            {analysis.techCategory}
          </p>

          <p>
            <strong>Summary:</strong> {analysis.summary}
          </p>

          <p>
            <strong>Recommendation:</strong>{" "}
            {analysis.recommendation}
          </p>
        </div>
      )}

      <div
        style={{
          border: "2px solid #2196F3",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "25px",
          backgroundColor: "#f5faff",
        }}
      >
        <h2>📊 Repository Statistics</h2>

        <p>
          <strong>Total Repositories:</strong>{" "}
          {totalRepositories}
        </p>

        <p>
          <strong>Total Stars:</strong>{" "}
          {totalStars}
        </p>

        <p>
          <strong>Most Popular:</strong>{" "}
          {mostPopularRepo?.repo_name || "N/A"}
        </p>
      </div>

      <h2>Imported Repositories</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setSortType("stars")}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
          }}
        >
          Sort By Stars
        </button>

        <button
          onClick={() => setSortType("name")}
          style={{
            padding: "8px 12px",
          }}
        >
          Sort By Name
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={{
            width: "300px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {filteredRepositories.map((repo) => (
        <div
          key={repo.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow:
              "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>{repo.repo_name}</h3>

          <p>
            <strong>Owner:</strong> {repo.owner_name}
          </p>

          <p>
            <strong>Language:</strong> {repo.language}
          </p>

          <p>
            <strong>Stars:</strong> {repo.stars}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {repo.description}
          </p>

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() =>
                analyzeRepository(repo.id)
              }
              style={{
                marginRight: "10px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Analyze Repository
            </button>

            <button
              onClick={() =>
                deleteRepository(repo.id)
              }
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Delete Repository
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;