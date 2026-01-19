import { Injectable } from '@angular/core';
import { InputMaskEnum } from '../../../../../helpers/input-mask/input-mask.helper';

declare const Inputmask: any;

@Injectable()
export class NgtInputMaskService {
    private inputMaskInstance: any;
    private mask: InputMaskEnum | string;

    public applyMask(
        mask: InputMaskEnum | string,
        element: HTMLInputElement,
        decimalPrecision: number,
        maxValue?: number,
        minValue?: number,
        validateMinValue?: boolean
    ): void {
        this.mask = mask;

        this.removeMask(element);

        const masks = {
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
                digits: decimalPrecision,
                groupSeparator: '.',
                radixPoint: ',',
                autoGroup: true,
                repeat: 16,
                rightAlign: false,
                max: maxValue,
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
                max: maxValue,
                min: validateMinValue ? minValue : undefined,
                rightAlign: false,
                showMaskOnHover: false
            },
            [InputMaskEnum.NUMERIC_STRING]: {
                regex: "[0-9]*",
                showMaskOnHover: false
            },
            [InputMaskEnum.TIME]: '99:99',
        };

        if (mask === InputMaskEnum.DECIMAL) {
            this.inputMaskInstance = Inputmask('decimal', masks[mask]).mask(element);
        } else if (mask === InputMaskEnum.INTEGER) {
            this.inputMaskInstance = Inputmask('integer', masks[mask]).mask(element);
        } else if (masks[mask]) {
            this.inputMaskInstance = Inputmask(masks[mask]).mask(element);
        }
    }

    public removeMask(element: HTMLInputElement): void {
        if (this.inputMaskInstance) {
            this.inputMaskInstance.remove();
            this.inputMaskInstance = null;
        }

        if (element && (element as any).inputmask) {
            (element as any).inputmask.remove();
        }
    }

    public removeMaskFromValue(value: string): string {
        if (!value || !this.mask) {
            return value;
        }

        return value
            .replace(/\./g, '')
            .replace(/\//g, '')
            .replace(/\-/g, '')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/\s/g, '')
            .replace(/\:/g, '')
            .replace(/\+/g, '');
    }
}
