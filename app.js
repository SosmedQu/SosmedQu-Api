require("dotenv").config();
require("./utils/db");

const express = require("express");
const auth = require("./routes/api");
const app = express();
const cors = require("cors");

app.use(cors({credentials: true, origin: "http://localhost:8100"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/auth", auth);

app.listen(process.env.PORT, () => {
    console.log(`${process.env.APP_NAME} | Listening att http://localhost${process.env.PORT}`);
});
