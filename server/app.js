const express = require("express");

require('dotenv').config();
const PORT = process.env.PORT || 5003;

const app = express();

const runServer = () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

runServer();