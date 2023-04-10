Ext.define('KitchenSink.view.grid.RowNumberer', {
    extend: 'Ext.grid.Panel',

    xtype: 'row-numberer',
    store: 'Companies',

    columns: [
        {xtype: 'rownumberer'},
        {text: "Company", flex: 1, sortable: true, dataIndex: 'name'},
        {text: "Price", width: 120, sortable: true, formatter: 'usMoney', dataIndex: 'price'},
        {text: "Change", width: 120, sortable: true, dataIndex: 'change'},
        {text: "% Change", width: 120, sortable: true, dataIndex: 'pctChange'},
        {text: "Last Updated", width: 120, sortable: true, formatter: 'date("m/d/Y")', dataIndex: 'lastChange'}
    ],
    columnLines: true,
    height: 300,
    title: 'Grid with Numbered Rows',
    iconCls: 'icon-grid',
    //<example>
    exampleTitle: 'Grid with Numbered Rows',
    otherContent: [{
        type: 'Store',
        path: 'app/store/Companies.js'
    }, {
        type: 'Model',
        path: 'app/model/Company.js'
    }],
    themes: {
        classic: {
            width: 700
        },
        neptune: {
            width: 750
        }
    },
    //</example>

    initComponent: function() {
        this.width = this.themeInfo.width;
        this.callParent();
    }
});