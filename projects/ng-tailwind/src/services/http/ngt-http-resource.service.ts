export interface NgtHttpFindExistingResourceInterface {
    table: string;
    column: string;
    value?: string;
    ignore_id?: string;
}

export interface NgtHttpFindExistingResourceResponse {
    id: string;
}

export abstract class NgtHttpResourceService {
    public abstract findExisting(findExistingResource: NgtHttpFindExistingResourceInterface): Promise<NgtHttpFindExistingResourceResponse>;
}
