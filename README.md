# TeaTable

TeaTable is a JavaScript library that allows you to quickly and easily create dynamic tables for your web applications. It supports CRUD operations, sorting, searching, full-screen display, CSV export, and pagination.

Just add your data and it will facilitate read, create, update, delete, and search operations while also providing a responsive UI.

## Installation

To include the library in your project, you can use the following command:

```bash
npm i teatable
```

_If you want to use it without importing, you can comment out the 'export default' line in the code and include it in your project._

## Features

- CRUD Operations: Functions for adding, reading, updating, and deleting data.
- Sorting: Sorting by the relevant column when clicking on each column header.
- Searching: Instant searching within table data.
- Full Screen: Displaying the table in full-screen mode.
- CSV Export: Exporting table data in CSV format.
- Pagination: Navigating through large data sets page by page.

## Usage

To use the library, first import the TeaTable class into your project and create an instance.

```
import TeaTable from 'teatable';

const options = {
    data: [ // data here
        { id: 1, name: Sample Data 1", extra: "Extra Info 1" },
        { id: 2, name: "Sample Data 2" }
    ],
    themeColor : "#6967ce",

    rowsPerPage: 5, // Optional: Number of rows per page (default: 5)
    // Optional: Callback functions
    onCreate: (item) => { /* ... */ },
    onEdit: (item, index) => { /* ... */ },
    onDelete: (item, index) => { /* ... */ },
    // language support
    txtAdd     : "Add",
    txtUpdate  : "Update",
    txtDel     : "Delete",
    txtEdit    : "Edit",
    txtAct     : "Actions",
    txtSearch  : "Search...",
    txtPage    : "Page",
    txtConfirm : "Are you sure to delete this data?"
};

const myTable = new TeaTable('tableContainerId', options);
```

This code creates a table within the HTML element with the specified tableContainerId ID.

## Styling

To visually enhance the library, include the following CSS file in your project:

```html
<link rel="stylesheet" href="node_modules/teatable/assets/style.css">
```
or

```import 'teatable/assets/style.css';```


## What's Next?

- Dark Mode or Theme Selector ADDED
- Multilanguage support ADDED
- Async pagination support


## Links
- NpmJs - https://www.npmjs.com/package/teatable
- Devto - https://dev.to/hkkcngz/teatable-create-dynamic-crud-table-paginated-sorted-featured-3f0l
- Github - https://github.com/hkkcngz/teatable
- CodePen - [https://codepen.io/hkkcngz/pen/ZEwMJPo](https://codepen.io/hkkcngz/pen/ZEwMJPo)


## Donate
 - [Give a support](https://www.buymeacoffee.com/F6HYT2d)


### Licence

This project is licensed under the MIT License by Hakki Cengiz.
