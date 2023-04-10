/**
 * A basic bar chart is a chart with horizontal bars of lengths proportional to the
 * magnitudes of the data it represents. Basic bars can be used in the same manner as the
 * column charts. Categories are typically organized along the vertical axis and values
 * along the horizontal axis. Tapping or hovering a bar will highlight it.
 */
Ext.define('KitchenSink.view.charts.bar.Basic', {
    extend: 'Ext.Panel',
    xtype: 'bar-basic',

    // <example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    // </example>

    width: 650,

    items: [{
        xtype: 'cartesian',
        width: '100%',
        height: 500,
        insetPadding: 40,
        flipXY: true,
        animation: {
            easing: 'easeOut',
            duration: 500
        },
        store: {
            type: 'economy-sectors'
        },
        axes: [{
            type: 'numeric',
            position: 'bottom',
            fields: 'ind',
            grid: true,
            maximum: 4000000,
            majorTickSteps: 10,
            title: 'Billions of USD',
            renderer: function (v, layoutContext) {
                return Ext.util.Format.number(layoutContext.renderer(v) / 1000, '0,000');
            }
        }, {
            type: 'category',
            position: 'left',
            fields: 'country',
            grid: true
        }],
        series: [{
            type: 'bar',
            xField: 'country',
            yField: 'ind',
            style: {
                opacity: 0.80,
                minGapWidth: 10
            },
            highlightCfg: {
                strokeStyle: 'black',
                radius: 10
            },
            label: {
                field: 'ind',
                display: 'insideEnd',
                renderer: function (v) {
                    return Ext.util.Format.number(v / 1000, '0,000');
                }
            },
            tooltip: {
                trackMouse: true,
                style: 'background: #fff',
                renderer: function(storeItem, item) {
                    this.setHtml(storeItem.get('country') + ': ' +
                        Ext.util.Format.number(storeItem.get('ind'), '0,000 (millions of USD)'));
                }
            }
        }],
        sprites: [{
            type: 'text',
            text: 'Industry size in major economies (2011)',
            fontSize: 22,
            width: 100,
            height: 30,
            x: 40, // the sprite x position
            y: 20  // the sprite y position
        }, {
            type: 'text',
            text: 'Source: http://en.wikipedia.org/wiki/List_of_countries_by_GDP_sector_composition',
            fontSize: 10,
            x: 12,
            y: 490
        }]
        //<example>
    }, {
        style: 'padding-top: 10px;',
        xtype: 'gridpanel',
        columns : {
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            items: [
                { text: 'Country', dataIndex: 'country' },
                { text: 'IE', dataIndex: 'ind', renderer: function(v) { return v + '%'; } }
            ]
        },
        store: {
            type: 'economy-sectors'
        },
        width: '100%'
        //</example>
    }],

    tbar: [
        '->',
        {
            text: 'Preview',
            handler: function() {
                this.up('panel').down('cartesian').preview();
            }
        }
    ]
});
