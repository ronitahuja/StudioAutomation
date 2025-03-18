class BaseError extends Error {
    constructor(name, statusCode, description, details) {
        super(description);
        this.name = name;
        this.statusCode = statusCode;
        this.details = details;
    }
}

module.exports = BaseError;


/**
 * name : Validation Error
 * statusCode : 400
 * description : Validation error occurred.
 * details : { errors: { email: 'Email is required.' } }
 */