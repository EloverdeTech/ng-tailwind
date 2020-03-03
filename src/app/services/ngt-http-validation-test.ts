import { NgtHttpValidationService, NgtHttpValidationResponse } from 'ng-tailwind';

export class NgtHttpValidationTestService extends NgtHttpValidationService {

    unique(validationResource: any, value: any): Promise<NgtHttpValidationResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (value == 'not unique') {
                    return resolve({ valid: false });
                }

                return resolve({ valid: true });
            }, 2000);
        });
    }

    exists(validationResource: any, value: any): Promise<NgtHttpValidationResponse> {
        throw new Error("Method not implemented.");
    }

}