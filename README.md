# malkovich

# Convert html into pdf document

## Options:

* format: letter, legal, a4, a3
* orientation: portrait or landscape
* margin, marginTop, marginBottom, marginLeft, marginRight: margin value (1in, 1cm, 10cm, 10px)
* displayHeaderFooter: true or any value enables headerTemplate and footerTemplate
* headerTemplate: html added to the top of each page (if displayHeaderFooter is true)
* footerTemplate:  html added to the bottom of each page (if displayHeaderFooter is true)

## template values:
* <b>date</b> formatted print date
* <b>title</b> document title
* <b>url</b> document location
* <b>pageNumber</b> current page number
* <b>totalPages</b> total pages in the document

## example:

<div>
    <span class="date"></span>
    <span class="title"></span>
    <span class="url"></span>
    <span class="pageNumber"></span>
    <span class="totalPages"></span>
</div>




        format: req.body.format,
        margin: {  // use specific margin values if provided, otherwise use a single margin value, otherwise use default values
            top: req.body.marginTop || req.body.margin,
            bottom: req.body.marginBottom || req.body.margin,
            left: req.body.marginLeft || req.body.margin,
            right: req.body.marginRight || req.body.margin,
        },
        orientation: req.body.orientation,
        displayHeaderFooter: req.body.displayHeaderFooter,
        headerTemplate: req.body.headerTemplate,
        footerTemplate: req.body.footerTemplate,