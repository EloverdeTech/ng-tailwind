
export abstract class NgtHttpValidationService {

    abstract unique(validationResource: any, value): Promise<NgtHttpValidationResponse>;

    abstract exists(validationResource: any, value): Promise<NgtHttpValidationResponse>;

}

export interface NgtHttpValidationResponse {
    valid: boolean;
};
