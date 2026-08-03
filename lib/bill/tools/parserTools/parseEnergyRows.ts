import type { TokenRow } from "./buildTokens";

export type Tariff = "day" | "night" | "unknown";

export interface EnergyRow {
    tariff: Tariff;
    oldReading: number;
    newReading: number;
    consumption: number;
    unitPrice: number;
    amount: number;
    rawLabel: string;
}

function normalizeLabel(label: string): string {
    return label.replace(/\./g, "").replace(/\s+/g, "").toLowerCase();
}

function classify(label: string): Tariff {
    const value = normalizeLabel(label);

    if (
        value.includes("днев") ||
        value.includes("ƒì") ||
        value.includes("äí")
    ) {
        return "day";
    }

    if (value.includes("нощ") || value.includes("õ") || value.includes("íî")) {
        return "night";
    }

    return "unknown";
}

export function parseEnergyRows(rows: TokenRow[]): EnergyRow[] {
    const result: EnergyRow[] = [];

    for (const row of rows) {
        if (row.tokens.length < 6) {
            continue;
        }

        const [label, oldReading, newReading, consumption, unitPrice, amount] =
            row.tokens;

        result.push({
            tariff: classify(label),

            rawLabel: label,

            oldReading: Number(oldReading),
            newReading: Number(newReading),

            consumption: Number(consumption),

            unitPrice: Number(unitPrice),

            amount: Number(amount),
        });
    }

    return result;
}
