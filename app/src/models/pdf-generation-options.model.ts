import { PaperFormat, PDFMargin } from "puppeteer";

export type PdfGenerationOptions = {
    format: PaperFormat;
    displayHeaderFooter?: boolean;
    headerTemplate?: string;
    footerTemplate?: string;
    orientation?: 'portrait' | 'landscape';
    margin: PDFMargin;
};
