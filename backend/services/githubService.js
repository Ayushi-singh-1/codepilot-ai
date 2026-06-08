const axios = require("axios");

const getRepositoryData = async (githubUrl) => {
  const parts = githubUrl.split("/");

  const owner = parts[3];
  const repo = parts[4];

  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`
  );

  return response.data;
};

module.exports = {
  getRepositoryData,
};