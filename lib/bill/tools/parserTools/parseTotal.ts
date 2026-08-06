import type { TokenRow } from "./buildTokens";

export function parseTotal(rows: TokenRow[]): number | null {
    const moneyRegex = /^\d+(\.\d{1,2})$/;

    let prices: number[] = [];
    let candidate: number | null = null;

    for (const row of rows) {
        const tokens = row.tokens;

        if (tokens.length === 0) {
            continue;
        }

        const numbers = tokens.map(Number).filter((n) => Number.isFinite(n));

        if (numbers.length === 0) {
            continue;
        }

        const label = tokens
            .slice(0, tokens.length - numbers.length)
            .join(" ")
            .toLowerCase();

        if (label.includes("пла") || label.includes("ôî")) {
            return numbers.at(-1) ?? null;
        }

        if (numbers.length === 1 && moneyRegex.test(numbers[0].toString())) {
            prices.push(numbers[0]);
        }
    }

    candidate = prices.length > 0 ? Math.max(...prices) : null;

    return candidate;
}
