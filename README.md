# Form Validation Server

A  validation server that uses the [Formio](https://github.com/formio) Validation system.

Current [Formio Server](https://github.com/formio/formio) Validation system version supported: `^1.50.0`.

Every validation request expects a form schema object and a from submission object.

This server provides zero capacities to store form schemas or store submissions. 
It is up to you to implement schema storage and returning the results of the validation to the client.

**It is expected that this validation server is a internal microservice, and should never be exposed directly to the client**

Use the online [Formio Builder](https://formio.github.io/formio.js/app/builder) for a quick sampler to build.
You a application let [Postman](https://www.getpostman.com) to test validations. 

----

# Start Server:

`node app/src/server.js`

Will default to port `8080`.  Use ENV var `PORT` to set a custom port.

Every Validation Request is logged by default.  Use ENV var `LOG_REQS=false` to disable the logs.

Server will Generate the following log on successful startup:

```json
{ 
    type: 'startup_message',
    data: 'Server is listening on port 8080' 
}
```

# Validation Endpoint:

`POST localhost:8080/validate`

JSON Body:

```json
{
    "spec": {},
    "submission": {}
}
```

Example:

```json
{
    "spec":{
            "display": "form",
            "components": [
                {
                    "label": "Text Field",
                    "allowMultipleMasks": false,
                    "showWordCount": false,
                    "showCharCount": false,
                    "tableView": true,
                    "alwaysEnabled": false,
                    "type": "textfield",
                    "input": true,
                    "key": "textField2",
                    "defaultValue": "",
                    "validate": {
                        "customMessage": "",
                        "json": "",
                        "required": true
                    },
                    "conditional": {
                        "show": "",
                        "when": "",
                        "json": ""
                    },
                    "inputFormat": "plain",
                    "encrypted": false,
                    "properties": {},
                    "customConditional": "",
                    "logic": [],
                    "attributes": {},
                    "widget": {
                        "type": ""
                    },
                    "reorder": false
                },
                {
                    "type": "button",
                    "label": "Submit",
                    "key": "submit",
                    "disableOnInvalid": true,
                    "theme": "primary",
                    "input": true,
                    "tableView": true
                }
            ],
            "settings": {
            }
        },
    "submission":{
    "data": {
        "textField2": "222"
    },
    "metadata": {}
}
}
```

## Valid Response:

Status: `202 Accepted`

```json

{
    "processed_submission": {
        "textField2": "222"
    }
}
```
**Note:** Remember that a processed_submission may not equal the original submitted submission due to validation 
data conversions and data stripping.


A log message will be generated such as:

```json
{ 
    type: 'validation_request',
    data: { 
        method: 'POST',
        endpoint: '/validate',
        spec:'{"display":"form","components":[{"label":"Text Field","allowMultipleMasks":false,"showWordCount":false,"showCharCount":false,"tableView":true,"alwaysEnabled":false,"type":"textfield","input":true,"key":"textField2","defaultValue":"","validate":{"customMessage":"","json":"","required":true},"conditional":{"show":"","when":"","json":""},"inputFormat":"plain","encrypted":false,"properties":{},"customConditional":"","logic":[],"attributes":{},"widget":{"type":""},"reorder":false},{"type":"button","label":"Submit","key":"submit","disableOnInvalid":true,"theme":"primary","input":true,"tableView":true}],"settings":{}}',
        raw_submission: '{"data":{"textField2":"222"},"metadata":{}}' 
    } 
}
```

## Error Response:

Status: `400 Bad Request`

```json
{
    "isJoi": true,
    "name": "ValidationError",
    "details": [
        {
            "message": "\"textField2\" is not allowed to be empty",
            "path": "textField2",
            "type": "any.empty",
            "context": {
                "value": "",
                "invalids": [
                    "",
                    null
                ],
                "key": "textField2",
                "label": "textField2"
            }
        }
    ],
    "_object": {
        "textField2": ""
    },
    "_validated": {
        "textField2": ""
    }
}
```

Pass the relevant data back to the client to render the applicable error informaiton.

