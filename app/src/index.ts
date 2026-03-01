
import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import { createPdfFromPool } from './services/pdf.service';
import { PdfGenerationOptions } from './models/pdf-generation-options.model';

const port = 80;
const app = express();

app.use(express.json({
    limit: '10mb'
}));
app.use(express.urlencoded({ 
    extended: true,
    limit: '50mb'
}));

const contentPath = path.join(__dirname, 'content');
app.use(express.static(contentPath));

app.get('/', (req, res) => {
    res.send('Hello Lovely World!');
});

app.get('/error', (req, res) => {
    res.status(500).send('Internal Server Error');
});

app.get('/healthcheck', (req, res) => {
    res.send('OK');
});

app.post('/pdf', async (req, res) => {

    const htmlContent = req.body.htmlContent;
    const filename = req.body.filename || 'document.pdf';
    const displayHeaderFooter = parseDisplayHeaderFooter(req.body.displayHeaderFooter);
    const options: PdfGenerationOptions = {
        format: req.body.format,
        margin: {  // use specific margin values if provided, otherwise use a single margin value, otherwise use default values
            top: req.body.marginTop || req.body.margin,
            bottom: req.body.marginBottom || req.body.margin,
            left: req.body.marginLeft || req.body.margin,
            right: req.body.marginRight || req.body.margin,
        },
        orientation: req.body.orientation,
        displayHeaderFooter,
        headerTemplate: req.body.headerTemplate,
        footerTemplate: req.body.footerTemplate,
    };

    if (!htmlContent) {
        res.status(400).send('HTML content is required');
        return;
    }

    try {
        
        const pdfBuffer = await createPdfFromPool(htmlContent, options);

        // Send the PDF as a response
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('An error occurred while generating the PDF');
    }

});

app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});

function parseDisplayHeaderFooter(value: unknown): boolean | undefined {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();

        if (normalized === '') {
            return undefined;
        }

        if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
            return false;
        }

        return true;
    }

    if (typeof value === 'number') {
        return value !== 0;
    }

    return undefined;
}

