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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use("/api" ,apiRouter);

app.get("/dummydata", (req, res) => {
  res.send({
    ConnectionLevel: [
      {
        paramName: "ClientID",
        paramType: "Number",
        mandatory: true,
        sensitive: false,
        variableName: "client_id",
        description: "Client ID",
      },
      {
        paramName: "x-cal-secret-key",
        paramType: "String",
        mandatory: true,
        sensitive: true,
        variableName: "x_cal_secret_key",
        description: "Secret Key",
      },
      
    ],
    TransactionLevel: [
      {
        paramName: "Email",
        paramType: "String",
        mandatory: true,
        sensitive: false,
        variableName: "email",
        description: "Email",
      },
      {
        paramName: "Name",
        paramType: "",
        mandatory: true,
        sensitive: true,
        variableName: "name",
        description: "name",
      },
    ],
  });
});

// app.use(errorHandler);

logger.on("error", (error) => {
  console.error("Winston logger error:", error.message);
  process.exit(1); 
});

app.listen(PORT, async () => {
  console.log(`Server started at PORT: ${PORT}`);
  await dbConnector.connect();
  console.log("Successfully connected to db");
});
