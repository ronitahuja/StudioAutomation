// const { pipeline } = require("@huggingface/transformers");

// let embeddingPipelinePromise;

// async function loadEmbeddingModel() {
//     if (!embeddingPipelinePromise) {
//         embeddingPipelinePromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
//     }
//     return embeddingPipelinePromise;
// }

// async function generateEmbedding(text) {
//     try {
//         const embeddingPipeline = await loadEmbeddingModel();
//         const embedding = await embeddingPipeline(text, { pooling: "mean", normalize: true });
//         return Array.from(embedding.data);
//     } catch (error) {
//         console.error("❌ Embedding generation failed:", error);
//         throw error;
//     }
// }

// module.exports = { generateEmbedding };



const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large", 
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("❌ Embedding generation failed:", error);
    throw error;
  }
}

module.exports = { generateEmbedding };
