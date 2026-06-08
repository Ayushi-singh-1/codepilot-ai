import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [githubUrl, setGithubUrl] = useState("");
  const [repositories, setRepositories] = useState([]);

  const fetchRepositories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/repositories"
      );

      setRepositories(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const importRepository = async () => {
    console.log("Import button clicked");

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

      alert("Repository imported successfully!");

      setGithubUrl("");
      fetchRepositories();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        "Failed to import repository"
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>🚀 CodePilot AI</h1>

      <p>
        Import GitHub repositories and view repository metadata.
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

      <h2>Imported Repositories</h2>

      {repositories.length === 0 ? (
        <p>No repositories imported yet.</p>
      ) : (
        repositories.map((repo) => (
          <div
            key={repo.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginTop: "15px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{repo.repo_name || "Unknown Repository"}</h3>

            <p>
              <strong>Owner:</strong>{" "}
              {repo.owner_name || "N/A"}
            </p>

            <p>
              <strong>Language:</strong>{" "}
              {repo.language || "N/A"}
            </p>

            <p>
              <strong>Stars:</strong>{" "}
              {repo.stars || 0}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {repo.description || "No description available"}
            </p>

            <p>
              <strong>Repository URL:</strong>{" "}
              <a
                href={repo.github_url}
                target="_blank"
                rel="noreferrer"
              >
                Open Repository
              </a>
            </p>

            <button
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Analyze Repository
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;