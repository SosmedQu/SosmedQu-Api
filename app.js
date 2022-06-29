require("dotenv").config();
require("./utils/db");

const express = require("express");
const api = require("./routes/api");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const apiDoc = require("./apidocs.json");

app.use(express.static("images"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDoc));
app.use(cookieParser());
app.use(cors({credentials: true, origin: "http://localhost:8100"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api", api);

app.listen(process.env.PORT, () => {
    console.log(`${process.env.APP_NAME} | Listening att http://localhost${process.env.PORT}`);
});
