FROM node:18

# Set environment variables dynamically (no hardcoded secrets)
ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=${GITHUB_TOKEN}

ENV ATLAS_DB_URL=mongodb+srv://ronitdarwinbox:123@cluster0.payf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV LOG_DB_URL=mongodb+srv://ronitdarwinbox:123@cluster0.payf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

ENV MY_GROQ_API_KEY=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
ENV DARWIN_GROQ_API_KEY=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


# Clone the repository securely
RUN git clone https://${GITHUB_TOKEN}@github.com/ronitahuja/StudioAutomation.git
WORKDIR /StudioAutomation

# Install backend dependencies
WORKDIR /StudioAutomation/backend
RUN npm install

# Install frontend dependencies
WORKDIR /StudioAutomation/frontend
RUN npm install

# Expose necessary ports
EXPOSE 3000 5173

# Start both backend and frontend
CMD ["sh", "-c", "cd /StudioAutomation/backend && npm run dev & cd /StudioAutomation/frontend && npm run dev"]
