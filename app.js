require("dotenv").config();
require("./utils/db");

const express = require("express");
const api = require("./routes/api");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(cors({credentials: true, origin: "http://localhost:8100"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", api);

app.listen(process.env.PORT, () => {
    console.log(`${process.env.APP_NAME} | Listening att http://localhost${process.env.PORT}`);
});
