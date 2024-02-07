import { ElementRef } from '@angular/core';
import Inputmask from 'inputmask/dist/inputmask.es6.js';

export enum InputMaskEnum {
    CPF = 'cpf',
    CNPJ = 'cnpj',
    CUIT = 'cuit',
    RUT = 'rut',
    CPF_CNPJ = 'cnpj-cpf',
    CPF_CNPJ_RUT = 'cnpj-cpf-rut',
    DECIMAL = 'decimal',
    CELLPHONE = 'cellphone',
    PLATE = 'plate',
    CEP = 'cep',
    INTEGER = 'integer',
    NUMERIC_STRING = 'numeric-string',
    TIME = 'time',
    INTERNATIONAL_PHONE = 'international-phone',
    DATE = 'date'
}

export function applyInputMask(element: ElementRef, mask: InputMaskEnum, parameters?: any): void {
    Inputmask(mask, parameters).mask(element);
}

export function removeInputMask(element: ElementRef): void {
    Inputmask.remove(element);
}
