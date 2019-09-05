const Validator = require('formio/src/resources/Validator.js');

// a dumb var to fill the role of the database lookup.
// submission model would have been used to check for certain values such as:
// - Is the field value "unique"? (unique in the context of all other previous submissions)
const submissionModel = function(doc, field, skipId) {};

function validate(req, res, next){
    const validationRequest = req.body;

    // Owner, Access are left blank as these are Formio DB functions for permissions, which are not required
    // form is left blank as this was the unique UUID of the Form for a lookup in the formio DB.
    const body = {
        "data": validationRequest.submission.data,
        "owner": "",
        "access": [],
        "form": ""
    };

    // Token is left blank as this is future usage of the JWT,
    // allowing the JWT to be passed into subsequent API calls
    const token = "";

    const validator = new Validator(validationRequest.schema, submissionModel, token);

    validator.validate(body, (err, submission) => {
        if (err){
            // console.log(err); // Used mainly for debug
            // The details are joined together because they usually are returned as a array,
            // which is not the required format for the Formio UI:
            err.details.forEach(detail=> {
                detail.path = detail.path.join(".")
            });
            return res.status(400).send(err);
        }
        // Returns the processed submission, not the original submission.
        // Original submission and process submission may be different, as the processed could have
        // fields removed, such as extras that were submitted in the original
        return res.status(202).json({processed_submission: submission});
    });
}

module.exports = {
    validate: validate
};