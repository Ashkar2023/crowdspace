import { SchemaValidator } from "@cr0wdspace/common";

class ValidationService extends SchemaValidator {
    constructor(){
        super();
    }
}

export const validator = new ValidationService();