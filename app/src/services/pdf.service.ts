import puppeteer, { Page, PDFMargin, PDFOptions } from "puppeteer";
import { createPool } from "generic-pool";
import { PdfGenerationOptions } from "../models/pdf-generation-options.model";

const minute = 60 * 1000;
const hour = 60 * minute;
const idleTimeoutMillis = 5 * minute;

// Create a pool of Puppeteer browsers
const browserPool = createPool(
    {
        create: async () => await puppeteer.launch(),
        destroy: async (browser) => await browser.close(),
    },
    {
        max: 5, // Maximum browsers in the pool
        min: 1, // Minimum browsers in the pool
        idleTimeoutMillis: idleTimeoutMillis, // Timeout for idle browsers
    }
);

const pdfOptionDefaults: PDFOptions = {
    format: 'letter',
    printBackground: true,
    margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
    },
    scale: 1,
    // displayHeaderFooter: false,
    // headerTemplate: "",
    // footerTemplate: "",
    // landscape: false,
    // pageRanges: "",
    // width: "",
    // height: "",
    preferCSSPageSize: true,
    // path: '',
    omitBackground: false,
    // tagged: false,
    outline: true,
    // timeout: 0,
    waitForFonts: true
};

export async function createPdfFromPool(html: string, options: PdfGenerationOptions): Promise<Buffer> {
    // Launch Puppeteer
    const browser = await browserPool.acquire();
    const page = await browser.newPage();
    await page.setOfflineMode(true);

    try {
        return await createPdfFromHtml(page, html, options);
    } finally {
        browserPool.release(browser);
    }
}

function applyPdfOptionValues(options: PdfGenerationOptions) {

    const pdfOptions: PDFOptions = { ...pdfOptionDefaults };
    if (options.format) { pdfOptions.format = options.format; }
    if (options.margin) { 
        if (typeof options.margin === 'string') {

            const newMargin: PDFMargin = {
                top: options.margin,
                bottom: options.margin,
                left: options.margin,
                right: options.margin,
            };
            pdfOptions.margin = newMargin;

        } else {
            pdfOptions.margin = {
                top: options.margin.top || '0',
                bottom: options.margin.bottom || '0',
                left: options.margin.left || '0',
                right: options.margin.right || '0',
            };
        }
     }

    if (options.displayHeaderFooter) { pdfOptions.displayHeaderFooter = !!options.displayHeaderFooter; }
    if (options.headerTemplate) { pdfOptions.headerTemplate = options.headerTemplate; }
    if (options.footerTemplate) { pdfOptions.footerTemplate = options.footerTemplate; }
    if (options.orientation) { pdfOptions.landscape = options.orientation === 'landscape'; }

    return pdfOptions;
}

async function createPdfFromHtml(page: Page, html: string, options: PdfGenerationOptions): Promise<Buffer> {

    // Load the HTML content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfOptions = applyPdfOptionValues(options);

    console.log('Generating PDF with options:', JSON.stringify(pdfOptions, null, 2));

    // Generate PDF
    const pdfBuffer = await page.pdf(pdfOptions);

    return Buffer.from(pdfBuffer);
}