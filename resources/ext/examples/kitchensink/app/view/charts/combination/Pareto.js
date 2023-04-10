/**
 * Pareto chart, named after Vilfredo Pareto, is a chart that contains both column and
 * line chart. Individual values are represented in descending order by bars, and the
 * cumulative total is represented by the line.
 */
Ext.define('KitchenSink.view.charts.combination.Pareto', {
    extend: 'Ext.Panel',
    requires: 'Ext.chart.theme.Category2',
    xtype: 'combination-pareto',

    // <example>
    // Content between example tags is omitted from code preview.
    bodyStyle: 'background: transparent !important',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    // </example>

    width: 650,

    initComponent: function() {
        var me = this;

        this.myDataStore = Ext.create('Ext.data.JsonStore', {
            fields: ['complaint', 'count', 'cumnumber', 'cumpercent' ],
            data: [
                { complaint: 'Overpriced', count: 543, cumnumber: 543, cumpercent: 31 },
                { complaint: 'Small Portions', count: 412, cumnumber: 955, cumpercent: 55 },
                { complaint: 'High Wait Time', count: 245, cumnumber: 1200, cumpercent: 69 },
                { complaint: 'Tasteless Food', count: 187, cumnumber: 1387, cumpercent: 80 },
                { complaint: 'Bad Ambiance', count: 134, cumnumber: 1521, cumpercent: 88 },
                { complaint: 'Not Clean', count: 98, cumnumber: 1619, cumpercent: 93 },
                { complaint: 'Too Noisy', count: 65, cumnumber: 1684, cumpercent: 97 },
                { complaint: 'Salty Food', count: 41, cumnumber: 1725, cumpercent: 99 },
                { complaint: 'Unfriendly Staff', count: 12, cumnumber: 1737, cumpercent: 100 }
            ]
        });

        //<example>
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [
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
            }]
        }];
        //</example>

        me.items = [{
            xtype: 'cartesian',
            theme: 'category2',
            width: '100%',
            height: 500,
            store: this.myDataStore,
            insetPadding: '40 40 20 40',
            legend: {
                docked: 'bottom'
            },
            sprites: [{
                type: 'text',
                text: 'Restaurant Complaints by Reported Cause',
                fontSize: 22,
                width: 100,
                height: 30,
                x: 40, // the sprite x position
                y: 20  // the sprite y position
            }, {
                type: 'text',
                text: 'Data: Restaurant Complaints',
                font: '10px Helvetica',
                x: 12,
                y: 480
            }],
            axes: [{
                type: 'numeric',
                position: 'left',
                fields: ['count'],
                majorTickSteps: 10,
                reconcileRange: true,
                grid: true,
                minimum: 0
            }, {
                type: 'category',
                position: 'bottom',
                fields: 'complaint',
                label: {
                    rotate: {
                        degrees: -45
                    }
                }
            }, {
                type: 'numeric',
                position: 'right',
                fields: ['cumnumber'],
                reconcileRange: true,
                majorTickSteps: 10,
                renderer: function (v) {
                    var total = this.getAxis().getRange()[1];
                    return (v / total * 100).toFixed(0) + '%';
                }
            }],
            series: [{
                type: 'bar',
                title: 'Causes',
                xField: 'complaint',
                yField: 'count',
                style: {
                    opacity: 0.80
                },
                highlight: {
                    fillStyle: 'rgba(204, 230, 73, 1.0)',
                    strokeStyle: 'black'
                },
                tooltip: {
                    trackMouse: true,
                    style: 'background: #fff',
                    renderer: function(record, item) {
                        this.setHtml(record.get('complaint') + ': ' + record.get('count') + ' responses.');
                    }
                }
            }, {
                type: 'line',
                title: 'Cumulative %',
                xField: 'complaint',
                yField: 'cumnumber',
                style: {
                    lineWidth: 2,
                    opacity: 0.80
                },
                marker: {
                    type: 'cross',
                    fx: {
                        duration: 200
                    }
                },
                highlightCfg: {
                    scaling: 2,
                    rotationRads: Math.PI / 4
                },
                tooltip: {
                    trackMouse: true,
                    style: 'background: #fff',
                    renderer: function(record, item) {
                        var store = record.store,
                            i, complaints = [];
                        for (i = 0; i <= item.index; i++) {
                            complaints.push(store.getAt(i).get('complaint'));
                        }
                        this.setHtml('<div style="text-align: center; font-weight: bold">' + record.get('cumpercent') + '%</div>' + complaints.join('<br>'));
                    }
                }
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
                    { text: 'Complaint', dataIndex: 'complaint', width: 175 },
                    { text: 'Count', dataIndex: 'count' },
                    { text: 'Cumulative', dataIndex: 'cumnumber' },
                    { text: 'Cumulative %', dataIndex: 'cumpercent', width: 175, renderer: function(v) { return v + '%'; } }
                ]
            },
            store: this.myDataStore,
            width: '100%'
        //</example>
        }];

        this.callParent();
    }
});
