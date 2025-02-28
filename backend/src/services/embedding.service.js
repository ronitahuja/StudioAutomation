const { pipeline } = require("@huggingface/transformers");

let embeddingPipelinePromise;

async function loadEmbeddingModel() {
    if (!embeddingPipelinePromise) {
        embeddingPipelinePromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    return embeddingPipelinePromise;
}

async function generateEmbedding(text) {
    try {
        const embeddingPipeline = await loadEmbeddingModel();
        const embedding = await embeddingPipeline(text, { pooling: "mean", normalize: true });
        return Array.from(embedding.data);
    } catch (error) {
        console.error("❌ Embedding generation failed:", error);
        throw error;
    }
}

module.exports = { generateEmbedding };
