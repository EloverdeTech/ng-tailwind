export function getEnumFromString(string: string, enumClass: any) {
    if (string && enumClass && enumClass[string.toUpperCase()]) {
        return enumClass[string.toUpperCase()];
    }

    throw new Error('Invalid enum [' + string + ']!');
}
