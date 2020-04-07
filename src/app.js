const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs, likes } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0 ) {
    return response.status(400).json({error: 'Repository not found!'});
  }

  if(likes > 0) {
    return response.status(401).json({ likes: repositories[repositoryIndex].likes });
  }

  const repository = {
    id,
    url,
    title,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
   const { id } = request.params;

   const repositoryIndex = repositories.findIndex(
     (repository) => repository.id === id
   );

   if (repositoryIndex < 0) {
     return response.status(400).json({ error: "Repository not found!" });
   }

   repositories.splice(repositoryIndex, 1);

   return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
   const { id } = request.params;

   const repositoryIndex = repositories.findIndex(
     (repository) => repository.id === id
   );

   if (repositoryIndex < 0) {
     return response.status(400).json({ error: "Repository not found!" });
   }

   const likes = repositories[repositoryIndex].likes;

   repositories[repositoryIndex].likes = likes + 1;

   return response.status(200).json({likes: repositories[repositoryIndex].likes});
});

module.exports = app;
