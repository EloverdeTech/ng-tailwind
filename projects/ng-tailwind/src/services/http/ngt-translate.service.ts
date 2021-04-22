export abstract class NgtTranslateService {
    protected abstract ngtFormDefaultValidationMessage: string;

    protected abstract ngtDatatableNoDataFound: string;

    protected abstract ngtSelectLoadingText: string;
    protected abstract ngtSelectTypeToSearchText: string;
    protected abstract ngtSelectClearAllTooltip: string;
    protected abstract ngtSelectPlaceholder: string;
    protected abstract ngtSelectCreateText: string;

    protected abstract ngtTextAreaRemainingCharacters: string;

    protected abstract ngtValidationMaxCharactersExceded: string;
    protected abstract ngtValidationRequiredField: string;
    protected abstract ngtValidationInvalidEmail: string;
    protected abstract ngtValidationAlreadyExists: string;
    protected abstract ngtValidationInvalidCnpj: string;
    protected abstract ngtValidationInvalidCpf: string;
    protected abstract ngtValidationPasswordRequiredMinCharacters: string;
    protected abstract ngtValidationFieldsNotMatch: string;
    protected abstract ngtValidationInvalidDate: string;
    protected abstract ngtValidationInvalidPrevision: string;
    protected abstract ngtValidationExternalServerUnavailable: string;

    public get(varName: string) {
        return this[varName];
    }

    protected abstract ngtValidationValueMustBeGreaterThan(minValue?: number | string): string;
    protected abstract ngtValidationMinLengthField(minLenth?: number | string): string;

    protected abstract ngtPagination(from: number | string, to: number | string, total: number | string): string;
}
