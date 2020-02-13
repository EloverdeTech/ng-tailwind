
export abstract class NgtHttpValidationService {

    abstract unique(remoteResource: any, data: any);

    abstract exists(remoteResource: any, data: any);

}