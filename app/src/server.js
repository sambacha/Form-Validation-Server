const express = require('express'), app = express();
const cors = require('cors');
const validator = require('./validator');

const isReqLogged = process.env.LOG_REQS || "true"
const port = process.env.PORT || 8080;

const logValidationRequest = (req, res, next) => {
    if (isReqLogged == "true"){
        let request = {
            "method": req.method,
            "endpoint": req.originalUrl,
            "schema": JSON.stringify(req.body.schema),
            "raw_submission": JSON.stringify(req.body.submission)
        };
        let requestLog = {
            "type": "validation_request",
            "data": request
        };
        console.log(requestLog);
    }
    next();
};

app.use(express.json());
app.use(cors());
// Keep logValidationRequest after express.json() or else the req.body will be undefined
app.use(logValidationRequest);

app.options('*', cors());

// Endpoint used to validate against:
app.post('/validate', validator.validate);

app.listen(port, () => {
    let startupLog = {
        "type": "startup_message",
        "data": `Server is listening on port ${port}`
    };
    console.log(startupLog)
});