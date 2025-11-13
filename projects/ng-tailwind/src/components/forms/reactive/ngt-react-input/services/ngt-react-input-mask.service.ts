import { ElementRef, Injectable } from "@angular/core";
import { applyInputMask, InputMaskEnum } from '../../../../../helpers/input-mask/input-mask.helper';

const MASKS: {} = {
    [InputMaskEnum.CPF]: {
        mask: ['999.999.999-99'],
        showMaskOnHover: false
    },
    [InputMaskEnum.CNPJ]: {
        mask: ['99.999.999/9999-99'],
        showMaskOnHover: false
    },
    [InputMaskEnum.CUIT]: {
        mask: ['99-99999999-9'],
        clearMaskOnLostFocus: false
    },
    [InputMaskEnum.RUT]: {
        mask: ['999999999999'],
        clearMaskOnLostFocus: false
    },
    [InputMaskEnum.CPF_CNPJ_RUT]: {
        mask: ['999.999.999-99', '999999999999', '99.999.999/9999-99'],
        keepStatic: true,
        showMaskOnHover: false
    },
    [InputMaskEnum.CPF_CNPJ]: {
        mask: ['999.999.999-99', '99.999.999/9999-99'],
        keepStatic: true,
        showMaskOnHover: false
    },
    [InputMaskEnum.DECIMAL]: {
        groupSeparator: '.',
        radixPoint: ',',
        autoGroup: true,
        repeat: 16,
        rightAlign: false,
        showMaskOnHover: false
    },
    [InputMaskEnum.CELLPHONE]: {
        mask: ['(99) 999-999', '(99) 9999-9999', '(99) 99999-9999'],
        keepStatic: true,
        showMaskOnHover: false
    },
    [InputMaskEnum.INTERNATIONAL_PHONE]: {
        mask: ['+999 99 999-999', '+99 (99) 9999-9999', '+99 (99) 99999-9999', '+999 (99) 9999-9999', '+999 (99) 99999-9999'],
        keepStatic: true,
        showMaskOnHover: false
    },
    [InputMaskEnum.PLATE]: {
        mask: ['AAA-9&99'],
        keepStatic: true,
        showMaskOnHover: false
    },
    [InputMaskEnum.CEP]: {
        mask: ['99999-999'],
        showMaskOnHover: false
    },
    [InputMaskEnum.INTEGER]: {
        rightAlign: false,
        showMaskOnHover: false
    },
    [InputMaskEnum.NUMERIC_STRING]: {
        regex: "[0-9]*",
        showMaskOnHover: false
    },
    [InputMaskEnum.TIME]: '99:99',
};

@Injectable({ providedIn: null })
export class NgtReactInputMaskService {
    private appliedMask: InputMaskEnum;

    public applyMask(
        mask: InputMaskEnum,
        inputElement: ElementRef,
        decimalMaskPrecision?: number,
        maxValue?: number,
        minValue?: number,
        validateMinValueOnMask?: boolean
    ): void {
        this.appliedMask = mask;

        MASKS[InputMaskEnum.DECIMAL]['digits'] = decimalMaskPrecision;
        MASKS[InputMaskEnum.DECIMAL]['max'] = maxValue;

        MASKS[InputMaskEnum.INTEGER]['max'] = maxValue;
        MASKS[InputMaskEnum.INTEGER]['min'] = validateMinValueOnMask ? minValue : undefined;

        if (mask === InputMaskEnum.DECIMAL) {
            return applyInputMask(inputElement, InputMaskEnum.DECIMAL, MASKS[mask]);
        }

        if (mask === InputMaskEnum.INTEGER) {
            return applyInputMask(inputElement, InputMaskEnum.INTEGER, MASKS[mask]);
        }

        if (mask) {
            return applyInputMask(inputElement, MASKS[mask]);
        }
    }

    public removeMask(value: string): string {
        if (this.appliedMask == InputMaskEnum.DECIMAL) {
            value = (value + "")
                .replace(/\./g, '')
                .replace(',', '.');
        }

        if (
            this.appliedMask === InputMaskEnum.CPF_CNPJ
            || this.appliedMask === InputMaskEnum.CPF
            || this.appliedMask === InputMaskEnum.CNPJ
            || this.appliedMask === InputMaskEnum.CPF_CNPJ_RUT
            || this.appliedMask === InputMaskEnum.CUIT
        ) {
            value = (value + "").replace(/[^\d]/g, '');
        }

        if (
            this.appliedMask === InputMaskEnum.CELLPHONE
            || this.appliedMask === InputMaskEnum.INTERNATIONAL_PHONE
        ) {
            value = (value + "")
                .replace('(', '')
                .replace(')', '')
                .replace(' ', '')
                .replace(' ', '')
                .replace('-', '')
                .replace('+', '');
        }

        return value;
    }
}
