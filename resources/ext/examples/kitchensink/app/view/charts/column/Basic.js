/**
 * The Basic Column Chart displays a set of random data in a column series. The "Reload Data"
 * button will randomly generate a new set of data in the store.
 *
 * Tapping or hovering a column will highlight it.
 */
Ext.define('KitchenSink.view.charts.column.Basic', {
    extend: 'Ext.Panel',
    xtype: 'column-basic',

    // <example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',

    layout: 'fit',
    // </example>

    width: 650,
    height: 500,

    initComponent: function () {
        var me = this;

        me.items = {
            xtype: 'cartesian',
            store: {
                type: 'climate'
            },
            insetPadding: {
                top: 40,
                bottom: 40,
                left: 20,
                right: 40
            },
            interactions: 'itemhighlight',
            axes: [{
                type: 'numeric',
                position: 'left',
                minimum: 40,
                titleMargin: 20,
                title: {
                    text: 'Temperature in °F'
                },
                listeners: {
                    rangechange: function (axis, range) {
                        var store = this.getChart().getStore(),
                            min = Infinity,
                            max = -Infinity,
                            value;

                        store.each(function (rec) {
                            var value = rec.get('highF');
                            if (value > max) {
                                max = value;
                            }
                            if (value < min) {
                                min = value;
                            }
                        });

                        value = (min + max) / 2;
                        this.setLimits({
                            value: value,
                            line: {
                                title: {
                                    text: 'Average high: ' + value.toFixed(2) + '°F'
                                },
                                lineDash: [2,2]
                            }
                        });
                    }
                }
            }, {
                type: 'category',
                position: 'bottom'
            }],
            animation: Ext.isIE8 ? false : {
                easing: 'backOut',
                duration: 500
            },
            series: {
                type: 'bar',
                xField: 'month',
                yField: 'highF',
                style: {
                    minGapWidth: 20
                },
                highlight: {
                    strokeStyle: 'black',
                    fillStyle: 'gold',
                    lineDash: [5, 3]
                },
                label: {
                    field: 'highF',
                    display: 'insideEnd',
                    renderer: function (value) {
                        return value.toFixed(1);
                    }
                }
            },
            sprites: {
                type: 'text',
                text: 'Redwood City Climate Data',
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
            }
        };
        //<example>
        me.tbar = [
            '->',
            {
                text: Ext.os.is.Desktop ? 'Download' : 'Preview',
                handler: function() {
                    var chart = me.down('cartesian');
                    if (Ext.os.is.Desktop) {
                        chart.download({
                            filename: 'Redwood City Climate Data Chart'
                        });
                    } else {
                        chart.preview();
                    }
                }
            },
            {
                text: 'Reload Data',
                handler: function() {
                    me.down('cartesian').getStore().refreshData();
                }
            }
        ];
        //</example>

        this.callParent();
    }
});
