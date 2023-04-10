/**
 * Demonstrates the Spreadsheet selection model.
 *
 * Supported features:
 *
 *  - Single / Range / Multiple individual row selection.
 *  - Single / Range cell selection.
 *  - Column selection by click selecting column headers.
 *  - Select / deselect all by clicking in the top-left, header.
 *  - Adds row number column to enable row selection.
 *
 * Copy/paste to system clipboard using Ctrl+C, Ctrl+X and Ctrl+V.
 */
Ext.define('KitchenSink.view.grid.Spreadsheet', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.selection.SpreadsheetModel',
        'Ext.grid.plugin.Clipboard',
        'KitchenSink.store.grid.MonthlySales'
    ],
    //<example>
    exampleTitle: 'Spreadsheet with locking',
    otherContent: [{
        type: 'Controller',
        path: 'app/view/grid/SpreadsheetController.js'
    },{
        type: 'Store',
        path: 'app/store/grid/MonthlySales.js'
    },{
        type: 'Model',
        path: 'app/model/grid/MonthlySales.js'
    }],
    //</example>

    xtype: 'spreadsheet',
    controller: 'spreadsheet',

    store: {
        type: 'monthlysales'
    },
    columnLines: true,
    height: 400,
    width: 750,
    title: 'Spreadsheet',
    frame: true,
    resizable: true,

    selModel: {
        type: 'spreadsheet',
        // Disables sorting by header click, though it will be still available via menu
        columnSelect: true,
        pruneRemoved: false
    },

    // Enable CTRL+C/X/V hot-keys to copy/cut/paste to the system clipboard.
    plugins: 'clipboard',

    listeners: {
        selectionchange: 'onSelectionChange'
    },

    tools: [{
        type: 'refresh',
        handler: 'onRefresh',
        tooltip: 'Reload Data'
    }],

    tbar: [{
        xtype: 'component',
        html: 'Selectable: '
    }, {
        text: 'Rows',
        enableToggle: true,
        toggleHandler: 'toggleRowSelect',
        pressed: true
    }, {
        text: 'Cells',
        enableToggle: true,
        toggleHandler: 'toggleCellSelect',
        pressed: true
    }, {
        text: 'Columns',
        enableToggle: true,
        toggleHandler: 'toggleColumnSelect',
        pressed: true
    }, '->', {
        xtype: 'component',
        reference: 'status'
    }],

    columns:[
        { text: 'Year', dataIndex: 'year', width: 70, minWidth: 70, locked: true },
        { text: 'Jan',  dataIndex: 'jan', width: 100 },
        { text: 'Feb',  dataIndex: 'feb', width: 100 },
        { text: 'Mar',  dataIndex: 'mar', width: 100 },
        { text: 'Apr',  dataIndex: 'apr', width: 100 },
        { text: 'May',  dataIndex: 'may', width: 100 },
        { text: 'Jun',  dataIndex: 'jun', width: 100 },
        { text: 'Jul',  dataIndex: 'jul', width: 100 },
        { text: 'Aug',  dataIndex: 'aug', width: 100 },
        { text: 'Sep',  dataIndex: 'sep', width: 100 },
        { text: 'Oct',  dataIndex: 'oct', width: 100 },
        { text: 'Nov',  dataIndex: 'nov', width: 100 },
        { text: 'Dec',  dataIndex: 'dec', width: 100 }
    ],

    viewConfig: {
        columnLines: true,
        trackOver: false
    }
});
