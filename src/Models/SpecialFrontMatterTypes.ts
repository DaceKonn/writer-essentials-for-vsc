export const CharactersSection: string = 'characters';
export const PlacesSection: string = 'places';

export function isSpecialType(test: string) {
    if (test === CharactersSection) {
        return true;
    } else if (test === PlacesSection) {
        return true;
    }
    return false;
}