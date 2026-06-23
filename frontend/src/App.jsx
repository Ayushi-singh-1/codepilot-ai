import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [githubUrl, setGithubUrl] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
            <strong>Repository:</strong>{" "}
            {analysis.repository}
          </p>

          <p>
            <strong>Owner:</strong>{" "}
            {analysis.owner}
          </p>

          <p>
            <strong>Language:</strong>{" "}
            {analysis.language}
          </p>

          <p>
            <strong>Stars:</strong>{" "}
            {analysis.stars}
          </p>

          <p>
            <strong>Health Score:</strong>{" "}
            {analysis.healthScore}
          </p>

          <p>
            <strong>Technology Area:</strong>{" "}
            {analysis.techCategory}
          </p>

          <p>
            <strong>Summary:</strong>{" "}
            {analysis.summary}
          </p>

          <p>
            <strong>Recommendation:</strong>{" "}
            {analysis.recommendation}
          </p>
        </div>
      )}

      <h2>Imported Repositories</h2>

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

      {repositories
        .filter((repo) =>
          repo.repo_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
        .map((repo) => (
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
              <strong>Owner:</strong>{" "}
              {repo.owner_name}
            </p>

            <p>
              <strong>Language:</strong>{" "}
              {repo.language}
            </p>

            <p>
              <strong>Stars:</strong>{" "}
              {repo.stars}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {repo.description}
            </p>

            <button
              onClick={() =>
                analyzeRepository(repo.id)
              }
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Analyze Repository
            </button>
          </div>
        ))}
    </div>
  );
}

export default App;