Ext.define('KitchenSink.store.Companies', {
    extend: 'Ext.data.ArrayStore',
    alias: 'store.companies',
    model: 'KitchenSink.model.Company',
    data: [
        [0,  '3m Co',                                       71.72, 0.02,  0.03,  '9/1 12:00am', 'Manufacturing'],
        [1,  'Alcoa Inc',                                   29.01, 0.42,  1.47,  '9/1 12:00am', 'Manufacturing'],
        [2,  'Altria Group Inc',                            83.81, 0.28,  0.34,  '9/1 12:00am', 'Manufacturing'],
        [3,  'American Express Company',                    52.55, 0.01,  0.02,  '9/1 12:00am', 'Finance'],
        [4,  'American International Group, Inc.',          64.13, 0.31,  0.49,  '9/1 12:00am', 'Services'],
        [5,  'AT&T Inc.',                                   31.61, -0.48, -1.54, '9/1 12:00am', 'Services'],
        [6,  'Boeing Co.',                                  75.43, 0.53,  0.71,  '9/1 12:00am', 'Manufacturing'],
        [7,  'Caterpillar Inc.',                            67.27, 0.92,  1.39,  '9/1 12:00am', 'Services'],
        [8,  'Citigroup, Inc.',                             49.37, 0.02,  0.04,  '9/1 12:00am', 'Finance'],
        [9,  'E.I. du Pont de Nemours and Company',         40.48, 0.51,  1.28,  '9/1 12:00am', 'Manufacturing'],
        [10, 'Exxon Mobil Corp',                            68.1,  -0.43, -0.64, '9/1 12:00am', 'Manufacturing'],
        [11, 'General Electric Company',                    34.14, -0.08, -0.23, '9/1 12:00am', 'Manufacturing'],
        [12, 'General Motors Corporation',                  30.27, 1.09,  3.74,  '9/1 12:00am', 'Automotive'],
        [13, 'Hewlett-Packard Co.',                         36.53, -0.03, -0.08, '9/1 12:00am', 'Computer'],
        [14, 'Honeywell Intl Inc',                          38.77, 0.05,  0.13,  '9/1 12:00am', 'Manufacturing'],
        [15, 'Intel Corporation',                           19.88, 0.31,  1.58,  '9/1 12:00am', 'Computer'],
        [16, 'International Business Machines',             81.41, 0.44,  0.54,  '9/1 12:00am', 'Computer'],
        [17, 'Johnson & Johnson',                           64.72, 0.06,  0.09,  '9/1 12:00am', 'Medical'],
        [18, 'JP Morgan & Chase & Co',                      45.73, 0.07,  0.15,  '9/1 12:00am', 'Finance'],
        [19, 'McDonald\'s Corporation',                     36.76, 0.86,  2.40,  '9/1 12:00am', 'Food'],
        [20, 'Merck & Co., Inc.',                           40.96, 0.41,  1.01,  '9/1 12:00am', 'Medical'],
        [21, 'Microsoft Corporation',                       25.84, 0.14,  0.54,  '9/1 12:00am', 'Computer'],
        [22, 'Pfizer Inc',                                  27.96, 0.4,   1.45,  '9/1 12:00am', 'Medical'],
        [23, 'The Coca-Cola Company',                       45.07, 0.26,  0.58,  '9/1 12:00am', 'Food'],
        [24, 'The Home Depot, Inc.',                        34.64, 0.35,  1.02,  '9/1 12:00am', 'Retail'],
        [25, 'The Procter & Gamble Company',                61.91, 0.01,  0.02,  '9/1 12:00am', 'Manufacturing'],
        [26, 'United Technologies Corporation',             63.26, 0.55,  0.88,  '9/1 12:00am', 'Computer'],
        [27, 'Verizon Communications',                      35.57, 0.39,  1.11,  '9/1 12:00am', 'Services'],
        [28, 'Wal-Mart Stores, Inc.',                       45.45, 0.73,  1.63,  '9/1 12:00am', 'Retail'],
        [29, 'Walt Disney Company (The) (Holding Company)', 29.89, 0.24,  0.81,  '9/1 12:00am', 'Services']
    ]
}, function(cls) {
    var data = cls.prototype.config.data;

    for(var i = 0; i < data.length; i++){
        data[i].push('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, sodales a, porta at, vulputate eget, dui. Pellentesque ut nisl. ');
    }
});
