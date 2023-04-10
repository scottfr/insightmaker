Ext.define('KitchenSink.Application', {
    extend: 'Ext.app.Application',
    namespace: 'KitchenSink',

    requires: [
        'Ext.app.*',
        'Ext.state.CookieProvider',
        'Ext.window.MessageBox',
        'Ext.tip.QuickTipManager',
        'KitchenSink.*',
        'Ext.chart.*'
    ],

    controllers: [
        'Global',
        'Direct'
    ],

    init: function() {
        if ('nocss3' in Ext.Object.fromQueryString(location.search)) {
            Ext.supports.CSS3BorderRadius = false;
            Ext.getBody().addCls('x-nbr x-nlg');
        }

        Ext.create('KitchenSink.store.Navigation', {
            storeId: 'navigation'
        });

        // Set the default route to start the application.
        this.setDefaultToken('all');

        Ext.setGlyphFontFamily('Pictos');
        Ext.tip.QuickTipManager.init();
        
        if (!Ext.microloaderTags.test) {
            Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
        }
    }
});
