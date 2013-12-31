/**
 * Author:   jhat
 * Date:     2013-12-30
 * Email:    cpf624@126.com
 * Home:     http://pfchen.org
 * Describe: ExtJS 分页大小插件
 */

Ext.define('Ext.ux.PageSizeBar', {

    /**
     * Creates new PageSizeBar.
     * @param {Object} config Configuration options
     */
    constructor : function(config) {
        if (config) {
            Ext.apply(this, config);
        }
    },

    init: function(pbar) {
        var idx = pbar.items.indexOf(pbar.child('#refresh'));
        var store = Ext.create('Ext.data.ArrayStore', {
                fields: ['value'],
                data: [[10], [20], [30]],
                queryMode: 'local',
        });
        var combo = Ext.create('Ext.form.field.ComboBox', {
            itemId: 'pageSize',
            displayField: 'value',
            valueField: 'value',
            width: 50,
            store: store,
            enableKeyEvents: true,
            regex: /^\d+$/,
            allowBlank: false,
            allowOnlyWhitespace: false,
            maxLength: 3,
            isChange: false,
            fireChange: function(eOpts) {
                var value = this.getValue(),
                    oldValue = this.oldValue;
                if (value != oldValue) {
                    this.isChange = true;
                    this.fireEvent('change', this, value, oldValue, eOpts);
                }
            },
            listeners: {
                change: function(combo, newValue, oldValue, eOpts) {
                    if (!combo.isValid()) {
                        combo.setValue(oldValue);
                    } else if (combo.isChange) {
                        pbar.store.pageSize = newValue;
                        pbar.doRefresh();
                    }
                    combo.isChange = false;
                },
                select: function(combo, records, eOpts) {
                    combo.fireChange(eOpts);
                },
                focus: function(combo, events, eOpts) {
                    combo.oldValue = combo.getValue();
                    combo.isChange = false;
                },
                blur: function(combo, events, eOpts) {
                    combo.fireChange(eOpts);
                },
                keypress: function(combo, events, eOpts) {
                    if (events.getCharCode() == events.ENTER) {
                        combo.fireChange(eOpts);
                        combo.oldValue = combo.getValue();
                    }
                },
            },
        });
        pbar.insert(idx + 1, ['-', '每页显示', combo, '条']);

        pbar.on({
            change: function(pb, data) {
                combo.isChange = false;
                combo.setValue(pb.store.pageSize);
            }
        });
    },
});
