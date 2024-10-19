import { ISchemaValidator } from "@crowdspace/common";

export interface IValidationService extends ISchemaValidator {
    validateEmail(email: string): boolean | never;
    validateUsername(username: string): boolean | never;
    validatePassword(password: string): boolean | never;
    validateDisplayname(displayname: string): boolean | never;
    validateCredentialType(displayname: string): boolean | never;
}
