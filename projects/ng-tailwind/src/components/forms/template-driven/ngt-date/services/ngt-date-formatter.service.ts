import { Injectable } from '@angular/core';
import moment from 'moment';
import { NgtDateLocale } from '../ngt-date.component';

@Injectable({ providedIn: null })
export class NgtDateFormatterService {
    public formatToDisplay(
        value: string | string[],
        enableTime: boolean,
        dateFormat: string,
        placeholder: string
    ): string {
        if (!value) {
            return placeholder;
        }

        if (Array.isArray(value)) {
            return this.formatArrayToDisplay(value, enableTime);
        }

        if (dateFormat === 'H:i') {
            return value;
        }

        return this.formatSingleDateToDisplay(value, enableTime);
    }

    public convertFlatpickrToMomentFormat(flatpickrFormat: string): string {
        let momentFormat = '';

        const conversionMap: Record<string, string> = {
            'd': 'DD',
            'm': 'MM',
            'M': 'MMM',
            'Y': 'YYYY',
            'H': 'HH',
            'i': 'mm',
            's': 'ss',
            '/': '/',
            '-': '-',
            ':': ':',
            ' ': ' '
        };

        for (const char of flatpickrFormat) {
            const converted = conversionMap[char];

            if (converted) {
                momentFormat += converted;
            } else if (char !== '.') {
                momentFormat += char;
            }
        }

        return momentFormat || 'DD/MM/YYYY HH:mm:00';
    }

    public convertDateByLocale(dateString: string, locale: NgtDateLocale): string {
        if (locale == NgtDateLocale.US) {
            return dateString;
        }

        return this.convertBrazilianToAmerican(dateString);
    }

    private convertBrazilianToAmerican(dateString: string): string {
        const parts = dateString.split('/');

        if (parts.length !== 3) {
            return dateString;
        }

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    private formatArrayToDisplay(dates: string[], enableTime: boolean): string {
        const formatted = dates
            .map(date => {
                const momentDate = moment(date);

                if (!momentDate.isValid()) {
                    return null;
                }

                return enableTime
                    ? momentDate.format('DD/MM/YYYY HH:mm:00')
                    : momentDate.format('DD/MM/YYYY');
            })
            .filter(Boolean);

        return formatted.join(' - ');
    }

    private formatSingleDateToDisplay(value: string | string[], enableTime: boolean): string {
        const momentValue = moment(value);

        if (!momentValue.isValid()) {
            return '';
        }

        return enableTime
            ? momentValue.format('DD/MM/YYYY HH:mm:00')
            : momentValue.format('DD/MM/YYYY');
    }
}
