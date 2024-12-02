# malkovich

# Convert html into pdf document

## Options:

* _format_: letter, legal, a4, a3
* _orientation_: portrait or landscape
* _margin, marginTop, marginBottom, marginLeft, marginRight_: margin value (1in, 1cm, 10cm, 10px)
* _displayHeaderFooter_: true or any value enables headerTemplate and footerTemplate
* _headerTemplate_: html added to the top of each page (if displayHeaderFooter is true)
* _footerTemplate_:  html added to the bottom of each page (if displayHeaderFooter is true)

## template values:
* _date_ formatted print date
* _title_ document title
* _url_ document location
* _pageNumber_ current page number
* _totalPages_ total pages in the document

## example:

```
<div>
    <span class="date"></span>
    <span class="title"></span>
    <span class="url"></span>
    <span class="pageNumber"></span>
    <span class="totalPages"></span>
</div>
```
