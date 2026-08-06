import type { TokenRow } from "./buildTokens";

export function parsePeriod(
    rows: TokenRow[],
): { month: string; year: string } | null {
    const dateRegex = /\d{1,2}\.\d{1,2}\.\d{4}/;

    let candidate: { month: string; year: string } | null = null;
    let dateTokensArr: string[] = [];

    for (const row of rows) {
        const tokens = row.tokens;

        if (tokens.length === 0) {
            continue;
        }

        const dateTokens = tokens.filter((token) => dateRegex.test(token));

        if (dateTokens.length === 0) {
            continue;
        }

        if (dateTokens.length) {
            dateTokensArr.push(dateTokens[0]);
        }

        const label = tokens.join(" ").toLowerCase();
        if (label.includes("№") || label.includes("π")) {
            const billDate = dateTokens[0].split(" ");
            const [day, month, year] = billDate[billDate.length - 1].split(".");
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            const billMonth = date.getMonth();
            const billYear = date.getFullYear();

            return { month: String(billMonth), year: String(billYear) };
        }
    }

    const billDate = dateTokensArr[0].split(" ");
    const [day, month, year] = billDate[billDate.length - 1].split(".");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const billMonth = date.getMonth();
    const billYear = date.getFullYear();
    candidate = { month: String(billMonth), year: String(billYear) };

    return candidate;
}
