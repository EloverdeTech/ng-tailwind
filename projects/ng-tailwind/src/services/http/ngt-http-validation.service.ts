export interface NgtHttpValidationService {
    emailValidation(email: string): Promise<NgtHttpValidationResponse>;
    phoneValidation(phone: string): Promise<NgtHttpValidationResponse>;
}

export abstract class NgtHttpValidationService {
    public abstract unique(validationResource: any, value: any): Promise<NgtHttpValidationResponse>;

    public abstract exists(validationResource: any, value: any): Promise<NgtHttpValidationResponse>;
}

export interface NgtHttpValidationResponse {
    valid: any;
}
