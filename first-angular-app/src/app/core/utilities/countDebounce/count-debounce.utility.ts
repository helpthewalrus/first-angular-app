import { constants } from "../../constants";

/**
 * Count debounce time when fetching another chunk of movies will be available
 */
export function countDebounce(comparisonDate: number): number {
    const currDate: number = Date.now();
    if (constants.DEBOUNCE_TIME + comparisonDate < currDate) {
        return 0;
    } else {
        const debouncer: number = comparisonDate - currDate + constants.DEBOUNCE_TIME;
        return debouncer;
    }
}
