export abstract class NgtHttpValidationService {
    public abstract unique(validationResource: any, value: any): Promise<NgtHttpValidationResponse>;

    public abstract exists(validationResource: any, value: any): Promise<NgtHttpValidationResponse>;

    public abstract emailValidation(email: string): Promise<NgtHttpValidationResponse>;

    public abstract phoneValidation(phone: string): Promise<NgtHttpValidationResponse>;

    public abstract passwordValidation(password: string, passwordableId?: string, passwordPolicyId?: string): Promise<NgtHttpValidationResponse>;
}

export interface NgtHttpValidationResponse {
    valid: any;
}
