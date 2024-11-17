export class NoCallbackDataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NoCallbackDataError"; // Set the name of the error
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}
export class InvalidUserSessionDataPropertyNameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidUserSessionDataPropertyNameError"; // Set the name of the error
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

export class NoTokenAddressError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NoTokenAddressError"; // Set the name of the error
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

export class NoAuthorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NoAuthorError"; // Set the name of the error
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}


export class UserDoesNotExistError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserDoesNotExistError"; // Set the name of the error
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

export class UserSettingsDoesNotExistError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserSettingsDoesNotExistError"; // Set the name of the error
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}