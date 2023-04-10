/**
 * This example shows how to create a line chart with images as markers. Line charts allow
 * to visualize the evolution of a value over time, or the ratio between any two values.
 */
Ext.define('KitchenSink.view.charts.line.ImageMarkers', {
    extend: 'Ext.panel.Panel',
    xtype: 'line-markers',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Numeric',
        'Ext.draw.modifier.Highlight',
        'Ext.chart.axis.Time',
        'Ext.chart.interactions.ItemHighlight'
    ],

    layout: 'fit',

    width: 650,

    tbar: [
        '->',
        {
            text: 'Refresh',
            handler: function () {
                var store = this.up('panel').down('cartesian').getStore();
                store.refreshData();
            }
        },
        {
            text: 'Switch Theme',
            handler: function () {
                var panel = this.up().up(),
                    chart = panel.down('cartesian'),
                    currentThemeClass = Ext.getClassName(chart.getTheme()),
                    themes = Ext.chart.theme,
                    themeNames = [],
                    currentIndex = 0,
                    name;

                for (name in themes) {
                    if (Ext.getClassName(themes[name]) === currentThemeClass) {
                        currentIndex = themeNames.length;
                    }
                    if (name !== 'Base' && name.indexOf('Gradients') < 0) {
                        themeNames.push(name);
                    }
                }
                chart.setTheme(themes[themeNames[++currentIndex % themeNames.length]]);
                chart.redraw();
            }
        },
        {
            text: 'Reset pan/zoom',
            handler: function () {
                var panel = this.up('panel'),
                    chart = panel.down('cartesian'),
                    axes = chart.getAxes();

                axes[0].setVisibleRange([0, 1]);
                axes[1].setVisibleRange([0, 1]);
                chart.redraw();
            }
        }
    ],

    items: [{
        xtype: 'cartesian',
        height: 500,
        store: {
            type: 'pie'
        },
        id: 'line-chart-markers',
        interactions: [
            'panzoom',
            'itemhighlight'
        ],
        legend: {
            position: 'bottom'
        },
        series: [
            {
                type: 'line',
                xField: 'name',
                yField: 'g1',
                fill: true,
                style: {
                    smooth: true,
                    miterLimit: 3,
                    lineCap: 'miter',
                    strokeOpacity: 1,
                    fillOpacity: 0.7,
                    lineWidth: 8
                },
                title: 'Square',
                highlight: {
                    scale: 0.9
                },
                marker: {
                    type: 'image',
                    src: 'resources/images/square.png',
                    width: 48,
                    height: 48,
                    x: -24,
                    y: -24,
                    scale: 0.7,
                    fx: {
                        duration: 200
                    }
                }
            },
            {
                type: 'line',
                xField: 'name',
                yField: 'g2',
                style: {
                    opacity: 0.7,
                    lineWidth: 8
                },
                title: 'Circle',
                highlight: {
                    scale: 0.9
                },
                marker: {
                    type: 'image',
                    src: 'resources/images/circle.png',
                    width: 48,
                    height: 48,
                    x: -24,
                    y: -24,
                    scale: 0.7,
                    fx: {
                        duration: 200
                    }
                }
            },
            {
                type: 'line',
                xField: 'name',
                yField: 'g3',
                style: {
                    opacity: 0.7,
                    lineWidth: 8
                },
                title: 'Pentagon',
                highlight: {
                    scale: 0.9
                },
                marker: {
                    type: 'image',
                    src: 'resources/images/pentagon.png',
                    width: 48,
                    height: 48,
                    x: -24,
                    y: -24,
                    scale: 0.7,
                    fx: {
                        duration: 200
                    }
                }
            }
        ],
        axes: [
            {
                type: 'numeric',
                position: 'left',
                fields: ['g1', 'g2', 'g3'],
                minimum: 0,
                listeners: {
                    rangechange: function (axis, range) {
                        if (!range) {
                            return;
                        }
                        // expand the range slightly to make sure markers aren't clipped
                        var max = range[1];
                        if (max >= 1000) {
                            range[1] = max - max % 100 + 100;
                        } else {
                            range[1] = max - max % 50 + 50;
                        }
                    }
                }
            },
            {
                type: 'category',
                position: 'bottom',
                visibleRange: [0, 0.75],
                fields: 'name'
            }
        ]
    }],

    initComponent: function () {
        this.callParent();
        var panzoom = this.down('cartesian').getInteractions()[0];
        this.down('toolbar').add(panzoom.getModeToggleButton());
    }

});
