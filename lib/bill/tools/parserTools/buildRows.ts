import type { PdfItem } from "./extractPdfItems";

export interface PdfRow {
    page: number;
    y: number;
    items: PdfItem[];
}

const ROW_TOLERANCE = 2;

export function buildRows(items: PdfItem[]): PdfRow[] {
    const rows: PdfRow[] = [];

    for (const item of items) {
        const last = rows.at(-1);

        if (
            !last ||
            last.page !== item.page ||
            Math.abs(last.y - item.y) > ROW_TOLERANCE
        ) {
            rows.push({
                page: item.page,
                y: item.y,
                items: [item],
            });

            continue;
        }

        last.items.push(item);
    }

    return rows;
}
