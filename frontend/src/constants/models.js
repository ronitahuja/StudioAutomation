import { mistral, huggingface, google, meta, qwen, deepseek } from "../assets";

const models = [
  {
    name: "distil-whisper-large-v3-en",
    image: huggingface,
  },
  {
    name: "whisper-large-v3",
    image: huggingface,
  },
  {
    name: "whisper-large-v3-turbo",
    image: huggingface,
  },
  {
    name: "gemma2-9b-it",
    image: google,
  },
  {
    name: "mixtral-8x7b-32768",
    image: mistral,
  },
  {
    name: "mistral-saba-24b",
    image: mistral,
  },
  {
    name: "qwen-qwq-32b",
    image: qwen,
  },
  {
    name: "qwen-2.5-coder-32b",
    image: qwen,
  },
  {
    name: "qwen-2.5-32b",
    image: qwen,
  },
  {
    name: "deepseek-r1-distill-qwen-32b",
    image: deepseek,
  },
  {
    name: "deepseek-r1-distill-llama-70b-specdec",
    image: deepseek,
  },
  {
    name: "deepseek-r1-distill-llama-70b",
    image: deepseek,
  },
  {
    name: "llama-3.3-70b-versatile",
    image: meta,
  },
  {
    name: "llama-3.1-8b-instant",
    image: meta,
  },
  {
    name: "llama-guard-3-8b",
    image: meta,
  },
  {
    name: "llama3-70b-8192",
    image: meta,
  },
  {
    name: "llama3-8b-8192",
    image: meta,
  },
  {
    name: "llama-3.3-70b-specdec",
    image: meta,
  },
  {
    name: "llama-3.2-1b-preview",
    image: meta,
  },
  {
    name: "llama-3.2-3b-preview",
    image: meta,
  },
];
export default models;
