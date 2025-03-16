const { FunctionModel } = require("../models");

class FunctionRepository {
  async insertFunctions(functionsData) {
    try {
      const newFunctions = await FunctionModel.insertMany(functionsData);
      return newFunctions;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async searchByEmbedding(queryEmbedding, topK = 5) {
    try {
      const results = await FunctionModel.aggregate([
        {
          $vectorSearch: {
            queryVector: queryEmbedding,
            path: "embedding",
            numCandidates: 15,
            limit: topK,
            index: "vector_index",
            similarity: "cosine",
          },
        },
      ]);
      return results;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async vectorSearch(queryEmbedding, topK = 5, threshold = 0.5) {
    try {
      const queryVector = Array.from(queryEmbedding);
      const results = await FunctionModel.aggregate([
        {
          $vectorSearch: {
            queryVector: queryVector,
            path: "embedding",
            numCandidates: queryVector.length,
            limit: topK,
            index: "vector_index",
            similarity: "cosine",
          },
        },
        {
          $addFields: {
            similarityScore: { $meta: "vectorSearchScore" }, 
          },
        },
        {
          $match: {
            similarityScore: { $gte: threshold }, 
          },
        },
        {
          $sort: { similarityScore: -1 },
        },
      ]);
      return results;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
module.exports = FunctionRepository;
