const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { PORT } = require("./config/server.config");
const apiRouter = require("./routes");
const errorHandler = require("./utils/errorHandler");
const dbConnector = require("./config/db.config");
const { loggerMiddleware, logger } = require("./config/logger.config");

const app = express();

app.use(loggerMiddleware);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use("/api", apiRouter);

app.use(errorHandler);

logger.on("error", (error) => {
  console.error("Winston logger error:", error.message);
  process.exit(1); // Exit app if logging is critical
});

app.listen(PORT, async () => {
  console.log(`Server started at PORT: ${PORT}`);
  await dbConnector.connect();
  console.log("Successfully connected to db");
});
