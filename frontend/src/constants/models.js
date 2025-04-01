import { mistral, google, meta, qwen, deepseek } from "../assets";

const models = [
  {
    name: "gemma2-9b-it",
    image: google,
  },
  {
    name: "mixtral-8x7b-32768",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/mistral.png",
  },
  {
    name: "mistral-saba-24b",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/mistral.png",
  },
  {
    name: "qwen-qwq-32b",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/qwen.jpeg",
  },
  {
    name: "qwen-2.5-coder-32b",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/qwen.jpeg",
  },
  {
    name: "qwen-2.5-32b",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/qwen.jpeg",
  },
  {
    name: "deepseek-r1-distill-qwen-32b",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/deepseek.png",
  },
  {
    name: "deepseek-r1-distill-llama-70b-specdec",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/deepseek.png",
  },
  {
    name: "deepseek-r1-distill-llama-70b",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/deepseek.png",
  },
  {
    name: "llama-3.3-70b-versatile",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/meta.jpeg",
  },
  {
    name: "llama-3.1-8b-instant",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/meta.jpeg",
  },
  {
    name: "llama-guard-3-8b",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/meta.jpeg",
  },
  {
    name: "llama3-70b-8192",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/meta.jpeg",
  },
  {
    name: "llama3-8b-8192",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/meta.jpeg",
  },
  {
    name: "llama-3.3-70b-specdec",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/meta.jpeg",
  },
  {
    name: "llama-3.2-1b-preview",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/meta.jpeg",
  },
  {
    name: "llama-3.2-3b-preview",
    image:
      "https://studioautomation-images.s3.ap-south-1.amazonaws.com/meta.jpeg",
  },
];
export default models;
