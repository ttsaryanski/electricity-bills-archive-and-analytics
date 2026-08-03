import type { PdfRow } from "./buildRows";

export interface TokenRow {
    page: number;
    y: number;
    tokens: string[];
}

export function buildTokens(row: PdfRow): TokenRow {
    const tokens: string[] = [];

    let current = "";

    const flush = () => {
        if (!current) {
            return;
        }

        tokens.push(reverseNumericToken(current));
        current = "";
    };

    for (const item of row.items) {
        if (item.isWhitespace) {
            flush();
            continue;
        }

        if (item.isDigit || item.text === ".") {
            current += item.text;
            continue;
        }

        flush();

        tokens.push(item.normalized);
    }

    flush();

    const filteredTokens = tokens.filter((token) => token.trim() !== "");

    return {
        page: row.page,
        y: row.y,
        tokens: filteredTokens,
    };
}

function reverseNumericToken(token: string): string {
    if (!/^[\d.]+$/.test(token)) {
        return token;
    }

    return token.split("").reverse().join("");
}
