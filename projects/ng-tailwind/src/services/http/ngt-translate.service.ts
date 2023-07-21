export abstract class NgtTranslateService {
    public abstract ngtFormDefaultValidationMessage: string;

    public abstract ngtDatatableNoDataFound: string;
    public abstract ngtMultiSelectNoDataFound: string;

    public abstract ngtSelectLoadingText: string;
    public abstract ngtSelectNotFoundText: string;
    public abstract ngtSelectTypeToSearchText: string;
    public abstract ngtSelectClearAllTooltip: string;
    public abstract ngtSelectPlaceholder: string;
    public abstract ngtSelectCreateText: string;

    public abstract ngtTextAreaRemainingCharacters: string;

    public abstract ngtStandardHelperTitle: string;

    public abstract ngtFileTooLargeForPreview: string;
    public abstract ngtFileTooLargeForPreviewNoDownloadPermission: string;

    public abstract ngtValidationMaxCharactersExceded: string;
    public abstract ngtValidationRequiredField: string;
    public abstract ngtValidationInvalidEmail: string;
    public abstract ngtValidationInvalidPassword: string;
    public abstract ngtValidationAlreadyExists: string;
    public abstract ngtValidationInvalidCnpj: string;
    public abstract ngtValidationInvalidCpf: string;
    public abstract ngtValidationPasswordRequiredMinCharacters: string;
    public abstract ngtValidationFieldsNotMatch: string;
    public abstract ngtValidationInvalidDate: string;
    public abstract ngtValidationInvalidPrevision: string;
    public abstract ngtValidationExternalServerUnavailable: string;
    public abstract ngtValidationValueMustBeGreaterThan(minValue?: number | string): string;
    public abstract ngtValidationMinLengthField(minLenth?: number | string): string;

    public abstract ngtPagination(from: number | string, to: number | string, total: number | string): string;
}
