import { extractPdfItems } from "@/lib/bill/tools/parserTools/extractPdfItems";
import { buildRows } from "@/lib/bill/tools/parserTools/buildRows";
import { buildTokens } from "@/lib/bill/tools/parserTools/buildTokens";
import { parseEnergyRows } from "@/lib/bill/tools/parserTools/parseEnergyRows";
import { parseTotal } from "@/lib/bill/tools/parserTools/parseTotal";
import { parsePeriod } from "@/lib/bill/tools/parserTools/parsePeriod";

type ParsedBillFileResult = {
    parsedPeriod: { month: string; year: string }; // | null;
    parsedDayCons: string;
    parsedNightCons: string;
    parsedTotal: string;
};

export async function parseBillFile(file: File): Promise<ParsedBillFileResult> {
    const items = await extractPdfItems(file);

    const rows = buildRows(items);

    const tokenRows = rows
        .map(buildTokens)
        .filter((row) => row.tokens.length > 0);

    const period = parsePeriod(tokenRows);

    const energy = parseEnergyRows(tokenRows);
    const day = energy
        .filter((r) => r.tariff === "day")
        .reduce((sum, r) => sum + r.consumption, 0);
    const night = energy
        .filter((r) => r.tariff === "night")
        .reduce((sum, r) => sum + r.consumption, 0);

    const total = parseTotal(tokenRows);

    return {
        parsedPeriod: {
            month: period ? period.month : "",
            year: period ? period.year : "",
        },
        parsedDayCons: day.toString(),
        parsedNightCons: night.toString(),
        parsedTotal: total !== null ? total.toString() : "",
    };
}
