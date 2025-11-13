/**
 * Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica) number.
 * CNPJ is a unique identifier for companies in Brazil.
 *
 * @param value - The CNPJ value to validate (can include formatting characters)
 * @returns true if the CNPJ is valid, false otherwise
 *
 * @example
 * validateCNPJ('11.222.333/0001-81'); // returns true or false
 * validateCNPJ('11222333000181');     // returns true or false
 */
export function validateCNPJ(value: any): boolean {
    if (!value) {
        return false;
    }

    // Validation weights for CNPJ verification digits
    const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    // Remove non-digit characters
    const cleanedValue = value.replace(/[^\d]/g, '');

    // Check if CNPJ has exactly 14 digits
    if (cleanedValue.length !== 14) {
        return false;
    }

    // Check if all digits are the same (invalid CNPJ)
    if (/^(\d)\1{13}$/.test(cleanedValue)) {
        return false;
    }

    // Validate first verification digit
    let sum = 0;

    for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanedValue[i]) * weights[i + 1];
    }

    const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (parseInt(cleanedValue[12]) !== firstDigit) {
        return false;
    }

    // Validate second verification digit
    sum = 0;

    for (let i = 0; i < 13; i++) {
        sum += parseInt(cleanedValue[i]) * weights[i];
    }

    const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (parseInt(cleanedValue[13]) !== secondDigit) {
        return false;
    }

    return true;
}

/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas) number.
 * CPF is a unique identifier for individuals in Brazil.
 *
 * @param value - The CPF value to validate (can include formatting characters)
 * @returns true if the CPF is valid, false otherwise
 *
 * @example
 * validateCPF('123.456.789-09'); // returns true or false
 * validateCPF('12345678909');    // returns true or false
 */
export function validateCPF(value: any): boolean {
    if (!value) {
        return false;
    }

    // Remove non-digit characters
    const cleanedValue = value.replace(/[^\d]/g, '');

    // Check if CPF has exactly 11 digits
    if (cleanedValue.length !== 11) {
        return false;
    }

    // Check if all digits are the same (invalid CPF)
    if (/^(\d)\1{10}$/.test(cleanedValue)) {
        return false;
    }

    // Validate first verification digit
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanedValue[i]) * (10 - i);
    }

    const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (parseInt(cleanedValue[9]) !== firstDigit) {
        return false;
    }

    // Validate second verification digit
    sum = 0;

    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanedValue[i]) * (11 - i);
    }

    const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (parseInt(cleanedValue[10]) !== secondDigit) {
        return false;
    }

    return true;
}
