import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

export interface PdfItem {
    text: string;
    normalized: string;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
    isWhitespace: boolean;
    isDigit: boolean;
}

export async function extractPdfItems(file: File): Promise<PdfItem[]> {
    const bytes = new Uint8Array(await file.arrayBuffer());

    const pdf = await pdfjs.getDocument({
        data: bytes,
        useSystemFonts: true,
    }).promise;

    const items: PdfItem[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const content = await page.getTextContent();

        for (const item of content.items) {
            if (!("str" in item)) {
                continue;
            }

            const [, , , , x, y] = item.transform;

            items.push({
                text: item.str,
                normalized: item.str.normalize("NFKC"),
                x,
                y,
                width: item.width,
                height: item.height,
                page: pageNumber,
                isWhitespace: /^\s*$/.test(item.str),
                isDigit: /^\d+$/.test(item.str),
            });
        }
    }

    return items;
}
