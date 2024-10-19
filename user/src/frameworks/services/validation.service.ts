import { IValidationService } from "@adapters/controllers/interfaces/service/validation-service.interface.js";
import { credentialTypeSchema, displaynameSchema, emailSchema, passwordSchema, SchemaValidator, usernameSchema } from "@crowdspace/common";

export class ValidationService extends SchemaValidator implements IValidationService {

    constructor() {
        super();
    }

    validateEmail(email: string) {
        return this.validate(email, emailSchema);
    }

    validateUsername(username: string) {
        return this.validate(username, usernameSchema);
    }

    validatePassword(password: string) {
        return this.validate(password, passwordSchema);
    }

    validateDisplayname(displayname: string) {
        return this.validate(displayname, displaynameSchema);
    }

    validateCredentialType(type: string){
        return this.validate(type,credentialTypeSchema);
    }
}