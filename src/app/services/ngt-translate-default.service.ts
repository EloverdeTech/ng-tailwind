import { NgtTranslateService } from "projects/ng-tailwind/src/public-api";

export class NgtTranslateDefaultService extends NgtTranslateService {
    public ngtFormDefaultValidationMessage: string = 'Preencha corretamente todos os campos';
    public ngtDatatableNoDataFound: string = 'Nenhum registro encontrado';
    public ngtSelectLoadingText: string = 'Carregando resultados';
    public ngtSelectNotFoundText: string = 'Não encontrado';
    public ngtSelectTypeToSearchText: string = 'Digite para procurar';
    public ngtSelectClearAllTooltip: string = 'Limpar seleção';
    public ngtSelectPlaceholder: string = 'Selecione';
    public ngtSelectCreateText: string = 'Adicionar';
    public ngtTextAreaRemainingCharacters: string = 'Caracteres restantes';
    public ngtStandardHelperTitle: string = 'Ajuda?';
    public ngtValidationMaxCharactersExceded: string = 'Número máximo de caracteres excedido';
    public ngtValidationRequiredField: string = 'Campo obrigatório';
    public ngtValidationInvalidEmail: string = 'E-mail inválido';
    public ngtValidationAlreadyExists: string = 'Já existe';
    public ngtValidationInvalidCnpj: string = 'CNPJ inválido';
    public ngtValidationInvalidCpf: string = 'CPF inválido';
    public ngtValidationPasswordRequiredMinCharacters: string = 'O Campo deve ter no minimo 8 caracteres';
    public ngtValidationFieldsNotMatch: string = 'Os campos não coincidem';
    public ngtValidationInvalidDate: string = 'Data inválida';
    public ngtValidationInvalidPrevision: string = 'Previsão inválida';
    public ngtValidationExternalServerUnavailable: string = 'Servidor externo indisponível';
    public ngtValidationValueMustBeGreaterThan(minValue?: string | number): string {
        return 'O valor informado deve ser maior ou igual à ' + minValue;
    }

    public ngtValidationMinLengthField(minLenth?: string | number): string {
        return 'O Campo deve ter no mínimo ' + minLenth + ' caracteres';
    }

    public ngtPagination(from: string | number, to: string | number, total: string | number): string {
        return `Visualizando ${from} - ${to} de ${total} registros`;
    }
}
