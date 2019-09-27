export const CharactersSection: string = 'characters';

export function isSpecialType(test: string) {
    if (test === CharactersSection) {
        return true;
    }
    return false;
}