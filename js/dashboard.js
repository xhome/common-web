/**
 * Copyright (c) 2009-2013 XHome Studio
 * Contact:  http://www.xhomestudio.org/contact.html
 *
 * Author:   Jhat
 * Date:     2013-12-03
 * Email:    cpf624@126.com
 * Home:     http://pfchen.org
 *
 * 后台管理面板，依赖ExtJS 3.x/4.x
 * 
 * 使用示例
 * 
 * Ext.onReady(function() {
 *    // 不支持IE 8及其以下版本
 *    if (Ext.isIE8m) {
 *         Ext.MessageBox.alert('Info', 'Unsupport IE 8 and lower version.');
 *         return;
 *     }
 *     
 *     // ExtJS初始化提示
 *     Ext.QuickTips.init();
 *     
 *     // 生成界面
 *     new XHome.Dashboard({
 *         logoConfig: {
 *             html: '<h1>XHome Dashboard</h1>',
 *         },
 *         // 各个节点的id不能为空，子节点的id必须以父节点的id开头，并用-分隔，
 *         // 故节点id不应出现-
 *         navigationConfig: { // 导航菜单配置
 *             title: 'Navigation',
 *             root: {
 *                 children: [{
 *                     id: 'xauth_system',
 *                     text: '系统配置',
 *                     leaf: true,
 *                     iconCls: 'icon-test', // 重置默认图标
 *                     showScript: 'xauth/js/user/user.js', // 显示面板所需加载的javascript
 *                     showClass: 'Ext.panel.Panel', // 显示面板类
 *                     showConfig: { // 显示面板配置
 *                         id: 'xauth_system-config',
 *                         html: 'System Config',
 *                     }
 *                 }, {
 *                     id: 'xauth_manage',
 *                     text: '认证管理',
 *                     leaf: false,
 *                     children: [{
 *                         id: 'xauth_manage-role',
 *                         text: '角色管理',
 *                         leaf: true,
 *                         showClass: 'Ext.panel.Panel',
 *                         showConfig: {
 *                             html: 'Role Manage'
 *                         }
 *                     }]
 *                 }]
 *             },
 *         },
 *     });
 * });
 */

/**
 * Logo面板
 *
 * {@link Ext.panel.Panel}
 */
Ext.define('XHome.Dashboard.Logo', {
    id: 'xhome_dashboard_logo',
    extend: 'Ext.panel.Panel',
    alias: 'widget.xdlogo',

    /**
     * @cfg {String} region
     * Logo面板默认位置为窗口最上方
     */
    region: 'north',

    /**
     * @cfg {Boolean} border
     * Logo面板默认无边框
     */
    border: false,

    /**
     * @cfg {Number} height
     * Logo面板默认高度为80
     */
    height: 80,

    layout: {
        type: 'hbox',
        pack: 'end',
        align: 'bottom',
    },

    items: [{
        xtype: 'combo',
        fieldLabel: '主题:',
        displayField: 'name',
        valueField: 'value',
        editable: false,
        labelWidth: 30,
        width: 110,
        value: 'xlibs/ext/resources/css/ext-all.css',
        store: Ext.create('Ext.data.ArrayStore', {
            queryMode: 'local',
            fields: ['name', 'value'],
            data: [
                ['Classic', 'xlibs/ext/resources/css/ext-all.css'],
                ['Gray', 'xlibs/ext/resources/css/ext-all-gray.css'],
                ['Access', 'xlibs/ext/resources/css/ext-all-access.css'],
                ['Neptune', 'xlibs/ext/resources/css/ext-all-neptune.css']
            ],
        }),
        listeners: {
            change: function(combo, newValue, oldValue, eOpts) {
                Ext.util.CSS.swapStyleSheet('theme', combo.getValue());
            },
        }
    }]
});

/**
 * 导航菜单面板
 *
 * 节点命令规则:
 * 各个节点都应该有id属性，
 * 且字节点的id应该以其所有父节点id以 _ 为间隔组合起来的字符窜开头。
 * 示例：
 * root : {
 *     children: [{
 *         id: 'dashboard',
 *         text: 'Dashboard',
 *         children: [{
 *             id: 'dashboard_main',
 *             text: 'Main',
 *             leaf: true
 *         }]
 *     }]
 * }
 *
 * {@link Ext.tree.Panel}
 */
Ext.define('XHome.Dashboard.Navigation', {
    id: 'xhome_dashboard_navigation',
    extend: 'Ext.tree.Panel',
    alias: 'widget.xdnav',

    /**
     * @cfg {String} region
     * 导航菜单默认位置为窗口左边
     */
    region: 'west',

    /**
     * @cfg {Number} width
     * 导航菜单默认宽度为160
     */
    width: 160,

    /**
     * @cfg {Boolean} collapsible
     * 导航菜单默认显示可隐藏按钮
     */
    collapsible: true,

    /**
     * @cfg {Boolean} rootVisible
     * 导航菜单默认不显示导航树的跟节点
     */
    rootVisible: false,

    /**
     * @cfg {Object} root
     * 导航菜单显示目录树
     */
    root: null,

    /**
     * @cfg {String} title
     * 导航菜单默认标题为： 导航菜单
     */
    title: '导航菜单',

    /**
     * @cfg {String} / {Object} workspace
     * 工作面板对象或其ID，默认为ID为: xhome_dashboard_workspace的对象
     * 如果是{String}类型，将根据其值查找工作面板对象
     */
    workspace: 'xhome_dashboard_workspace',

    /**
     * @cfg {Function} createShowPanel
     * 点击菜单面板后，创建对应的显示面板
     * @param record {Object} 菜单项信息
     * @param callback {Function} 显示面板创建成功后的回调函数，通过回调函数传回创建的显示面板对象
     */
    createShowPanel: function(record, callback) {
        var node = record.raw;
        var navigation = this;
        var doCreateShowPanel = function() {
            var showConfig = {
                /**
                 * @cfg {String} title
                 * 内容面板标题默认与菜单标题一致
                 */
                title: node.text,
    
                /**
                 * @cfg {Boolean} closable
                 * 内容面板默认允许关闭，但关闭仅是隐藏，并不对其进行销毁
                 */
                closable: true,
    
                /**
                 * @cfg {Boolean} border
                 * 内容面板默认无边框
                 */
                border: false,
            };
            Ext.apply(showConfig, node['showConfig']);
            var showPanel = Ext.create(node.showClass, showConfig);
            // 选中内容面板后，同步将对应的导航菜单项选中
            showPanel.addListener('show',
                function(panel) {
                    var selection = navigation.getSelectionModel();
                    if (!selection.isSelected(record)) {
                        // 如果该节点不可见，还需要将其父节点依次展开
                        if (!record.isVisible()) {
                            var parentNode = record.parentNode;
                            while (parentNode != null) {
                                if (!parentNode.isExpanded()) {
                                    parentNode.expand();
                                }
                                parentNode = parentNode.parentNode;
                            }
                        }
                        selection.select(record);
                    }
                }
            );
            navigation.workspace.add(showPanel);
            navigation.workspace.setActiveTab(showPanel);
            return showPanel;
        };
        if (node.showScript) {
            Ext.Loader.loadScript({
                url: node.showScript,
                onLoad: function() {
                    callback(doCreateShowPanel());
                }
            });
        } else {
            callback(doCreateShowPanel());
        }
    },

    /**
     * 显示指定路径的节点
     */
    showPath: function(path) {
        this.selectPath(path, '', '/', function(treeNode, node) {
            if (treeNode && node) {
                this.fireEvent('itemclick', this, node);
            }
        });
    },

    /**
     * @cfg {Object} listeners
     * 事件监听配置
     */
    listeners: {
        /**
         * 监听鼠标单击事件
         * 如果是叶子节点，则将菜单对应的内容面板在工作面板上显示出来，
         * 否则展开或折叠该节点
         */
        itemclick: function(view, record) {
            if (record.isLeaf()) {
                // 查找工作面板对象
                var workspace = null;
                var type = typeof this.workspace;
                if (type == 'string') {
                    workspace = Ext.getCmp(this.workspace);
                    this.workspace = workspace;
                } else if (type == 'object') {
                    workspace = this.workspace;
                } else {
                    XHome.Msg.error('Workspace not find!');
                    return;
                }

                // 从工作面上上查找所点击菜单对应的内容面板，
                // 如果未找到内容面板，则新建并将其添加至工作面板上，然后显示；
                // 否则直接显示内容面板
                var node = record.raw;
                var callback = function(panel) {
                    node.showPanel = panel;
                    node.showPanel.show();
                };
                if (!node.showPanel) {
                    this.createShowPanel(record, callback);
                } else if (!workspace.getComponent(node.showPanel.id)) {
                    if (workspace.autoDestroy) {
                        this.createShowPanel(record, callback);
                    } else {
                        workspace.show();
                        workspace.add(node.showPanel);
                        node.showPanel.show();
                        workspace.setActiveTab(node.showPanel.id);
                    }
                } else {
                    node.showPanel.show();
                }
            } else if(record.isExpanded()) {
                view.collapse(record);
            } else {
                view.expand(record);
            }
        },
        select: function(view, record, index) {
            if (record.isLeaf()) {
                window.location.hash = record.raw.id;
            }
        }
    }
});

/**
 * 工作面板
 * 各功能模块都在该面板上显示
 *
 * {@link Ext.tab.Panel}
 */
Ext.define('XHome.Dashboard.Workspace', {
    id: 'xhome_dashboard_workspace',
    extend: 'Ext.tab.Panel',
    alias: 'widget.xdworkspace',

    /**
     * @cfg {String} region
     * 工作面板默认位置为窗口最右边
     */
    region: 'center',

    /**
     * @cfg {Boolean} border
     * 工作面板默认无边框
     */
    border: false,

    /**
     * @cfg {Boolean} autoDestroy
     * 默认不自动销毁被移除的显示面板
     */
    autoDestroy: false,

    /**
     * @cfg {Boolean} autoScroll
     * 自动显示滚动条
     */
    autoScroll: true,

    /**
     * @cfg {Object} listeners
     * 事件监听配置
     */
    listeners: {
        /**
         * 监听tab移除事件，只有一个tab时不移除
         * 避免全部移除后新打开的tab无法显示
         */
        beforeremove: function(workspace, component) {
            return workspace.items.length > 1;
        }
    }
});

/**
 * 查询面板
 *
 * {@link Ext.panel.Panel}
 */
Ext.define('XHome.Dashboard.SearchPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.xdspanel',

    /**
     * @cfg {Boolean} frame
     * 背景样式
     */
    frame: true,

    /**
     * @cfg {Boolean} border
     * 不显示边框
     */
    border: false,

    /**
     * @cfg {Object} style
     * 默认样式
     */
    style: {
        borderStyle: 'none',
        borderRadius: 0,
        borderWidth: 0,
    },

    /**
     * @cfg {Object} layout
     * 布局配置
     */
    layout: {
        type: 'table',
        tableAttrs: {
            style: {
                margin: 'auto',
            }
        },
    },

    /**
     * @cfg {String} defaultType
     * 子元素默认类型
     */
    defaultType: 'textfield',

    /**
     * @cfg {Object} defaults
     * 所有子元素默认样式
     */
    defaults: {
        margin: 'auto',
        labelWidth: 40,
    },

    /**
     * @cfg {String} region
     * 布局位置
     */
    region: 'north',

    /**
     * @cfg {Function} doSearch
     * 执行条件数据查询
     */
    doSearch: function() {
        var parent = this.findParentByType('xdwpanel');
        if (parent) {
            var grid = parent.child('xdgrid');
            if (grid) {
                grid.store.reload();
            }
        }
    },

    /**
     * @cfg {Function} getSearchCondition
     * 获取查询条件
     */
    getSearchCondition: function() {
        var form = this.getForm();
        return form && form.isValid() ? form.getValues() : undefined;
    },

    /**
     * 重置构造函数，在面板最后添加查询按钮
     */
    constructor: function(config) {
        if (config && config.items) {
            config.items.push({
                xtype: 'button',
                text: '查询',
                x: 10,
                iconAlign: 'left',
                iconCls: 'icon_query',
                handler: function(button, e) {
                    var spanel = button.findParentByType('xdspanel');
                    spanel.doSearch();
                },
            });
        }
        this.callParent([config]);
    },
});

/**
 * 可编辑表格
 *
 * {@link Ext.grid.Panel}
 */
Ext.define('XHome.Dashboard.EditorGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.xdgrid',

    /**
     * @cfg {Boolean} autoScroll
     * 自动显示滚动条
     */
    autoScroll:true,

    /**
     * @cfg {Boolean} columnLines
     * 显示列间隔线
     */
    columnLines: true,

    /**
     * @cfg {Boolean} forceFit
     * 使列占满整个宽度
     */
    forceFit: true,

    /**
     * @cfg {Object} viewConfig
     * 默认显示配置
     */
    viewConfig: {
        /**
         * @cfg {Boolean} enableTextSelection
         * 允许表格内容复制
         */
        enableTextSelection: true,

        /**
         * @cfg {Boolean} loadMask
         * 数据加载遮罩
         */
        loadMask: false,
    },

    /**
     * @cfg {Object} selModel
     * 表格复选框
     */
    selModel: Ext.create('Ext.selection.CheckboxModel', {
        /**
         * @cfg {Boolean} checkOnly
         * 仅点击复选框时才有效
         */
        checkOnly:true,
    }),

    /**
     * @cfg {String} region
     * 布局位置
     */
    region: 'center',

    constructor: function(config) {
        if (config.store && !config.bbar) {
            var pbar = Ext.create('XHome.toolbar.Paging', {
                store: config.store,
            });
            config.bbar = [pbar];

            var grid = this;
            config.store.on({
                beforeload: function(store, operation, eOpts) {
                    var parent = grid.findParentByType('xdwpanel');
                    if (parent) {
                        var spanel = parent.child('xdspanel');
                        if (spanel) {
                            var params = spanel.getSearchCondition();
                            if (params == undefined) {
                                Ext.MessageBox.hide();
                                return false;
                            }
                            if (!operation.params) {
                                operation.params = params;
                            } else {
                                Ext.apply(operation.params, params);
                            }
                        }
                    }
                },
            });
        }
        this.callParent([config]);
    },
});

/**
 * 弹框表单
 *
 * {@link Ext.window.Window}
 */
Ext.define('XHome.Dashboard.FormWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.xdformwin',

    /**
     * @cfg {Boolean} modal
     * 弹窗遮罩
     */
    modal: true,

    /**
     * @cfg {Boolean} autoScroll
     * 自动显示滚动条
     */
    autoScroll: true,

    /**
     * @cfg {Boolean} border
     * 默认无边框
     */
    border: false,

    /**
     * @cfg {String} buttonAlign
     * 弹窗中的按钮居中显示
     */
    buttonAlign:'center',

    /**
     * @cfg {Object} hiddenItems
     * form表单中的隐藏字段
     */
    hiddenParams: {},

    /**
     * @cfg {Function} showResult
     * 显示操作执行结果
     * @param {Object} result 操作执行结果
     */
    showResult: function(result) {
        if (result.success) {
            this.showSuccess(result.message);
        } else {
            this.showError(result.message);
        }
    },

    /**
     * @cfg {Function} showError
     * 显示操作失败错误提示信息
     * @param message {String} 提示信息
     */
    showError: function(message) {
        Ext.MessageBox.hide();
        var error = this.getComponent('error');
        error.setText(message);
        error.show();
    },

    /**
     * @cfg {Function} showSuccess
     * 显示操作成功提示信息
     * @param message {String} 提示信息
     */
    showSuccess: function(message) {
        this.hide();
        XHome.Msg.info(message);
    },

    /**
     * @cfg {Function} success
     * 操作成功后回调
     * @param {Object} result 操作执行结果
     */
    success: function(result) {},

    /**
     * @cfg {Function} error
     * 操作失败后回调
     * @param {Object} result 操作执行结果
     */
    error: function(result) {},

    /**
     * @cfg {Function} reset
     * 重置表单
     */
    reset: function() {
        this.getComponent('form').getForm().reset();
        this.getComponent('error').hide();
    },

    constructor: function(config) {
        config = Ext.apply({}, config);

        if (!config.buttons) {
            // 使用默认的窗口按钮
            config.buttons = [{
                text: '提交',
                handler: function(button, e) {
                    var win = button.up('window');
                    var form = win.getComponent('form');
                    if (form.isValid()) {
                        form.submit({
                            success: function(form, action) {
                                win.showResult(action.result);
                                win.success(action.result);
                            },
                            failure: function(form, action) {
                                win.showResult(action.result);
                                win.error(action.result);
                            }
                        });
                    }
                },
            }, {
                text: '取消',
                handler: function(button, e) {
                    var win = button.up('window');
                    win.close();
                },
            }];
        }

        var items = config.items, hiddenParams = config.hiddenParams,
            hidden = false;
        // 将隐藏字段加入FormPanel
        if (items && hiddenParams) {
            for (param in hiddenParams) {
                hidden = true;
                for (var i = 0; i < items.length; i++) {
                    if (param == items[i].name) {
                        hidden = false;
                        break;
                    }
                }
                if (hidden) {
                    items.push({
                        xtype: 'hidden',
                        name: param,
                        itemId: param,
                        value: hiddenParams[param],
                    });
                }
            }
        }
        // 将items全部放在一个FormPanel中
        config.items = [{
            xtype: 'form',
            itemId: 'form',
            url: config.url,
            border: false,
            frame: true,
            defaults: {
                xtype: 'textfield',
                labelWidth: 40,
                labelAlign: 'center',
                width: '100%',
                anchor:'100%', 
            },
            items: items,
        }, {
            xtype: 'label',
            itemId: 'error',
            style: 'color: red; padding: 0px 4px 0px 4px;',
            hidden: true,
        }];

        this.callParent([config]);
    },

});

/**
 * 工作面板
 * 一般需要包含{@link XHome.Dashboard.SearchPanel}和{@link XHome.Dashboard.EditorGridPanel}
 *
 * {@link Ext.panel.Panel}
 */
Ext.define('XHome.Dashboard.WorkPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.xdwpanel',

    /**
     * @cfg {String} layout
     * 默认使用border布局
     */
    layout:'border',
});

/**
 * 版权信息面板
 *
 * {@link Ext.panel.Panel}
 */
Ext.define('XHome.Dashboard.Copyright', {
    id: 'xhome_dashboard_copyright',
    extend: 'Ext.panel.Panel',
    alias: 'widget.xdcopyright',

    /**
     * @cfg {String} region
     * 版权信息面板默认位置为窗口最下方
     */
    region: 'south',

    /**
     * @cfg {Boolean} border
     * 版权信息面板默认无边框
     */
    border: false,

    /**
     * @cfg {Number} height
     * 版权信息面板默认高度为18
     */
    height: 18,

    /**
     * @cfg {String} layout
     * 版权信息面板默认布局为border
     */
    layout: 'border',

    /**
     * @cfg {Object} style
     * 版权信息面板样式，默认文字水平居中
     */
    style: {
        textAlign: 'center',
    },

    /**
     * @cfg {String} html
     * 版权信息面板默认显示内容为： ©2009-2013 Xhome Studio
     */
    html: '©2009-2013 <a href="http://www.xhomestudio.org" target="__blank">Xhome Studio</a>'
});

/**
 * 后台管理面板
 *
 * {@link Ext.container.Viewport}
 */
Ext.define('XHome.Dashboard', {
    id: 'xhome_dashboard',
    extend: 'Ext.container.Viewport',
    layout: 'border',
    constructor: function(config) {
        var __config = {
            /**
             * @cfg {String} logoClass
             * Logo面板类，默认为： XHome.Dashboard.Logo
             */
            logoClass: 'XHome.Dashboard.Logo',

            /**
             * @cfg {Object} logoConfig
             * Logo面板初始化参数，默认为空
             */
            logoConfig: {},

            /**
             * @cfg {String} navigationClass
             * 导航菜单面板类，默认为： XHomme.Dashboard.Navigation
             */
            navigationClass: 'XHome.Dashboard.Navigation',

            /**
             * @cfg {Object} navigationConfig
             * 导航菜单面板初始化参数，默认仅配置工作面板对象
             */
            navigationConfig: {},

            /**
             * @cfg {String} workspaceClass
             * 工作面板类，默认为： XHome.Dashboard.Workspace
             */
            workspaceClass: 'XHome.Dashboard.Workspace',

            /**
             * @cfg {Object} workspaceConfig
             * 工作面板初始化参数，默认为空
             */
            workspaceConfig: {},

            /**
             * @cfg {String} copyrightClass
             * 版权信息面板类，默认为： XHome.Dashboard.Copyright
             */
            copyrightClass: 'XHome.Dashboard.Copyright',

            /**
             * @cfg {Object} copyrightConfig
             * 版权信息面板初始化参数，默认为空
             */
            copyrightConfig: {}
        };
        Ext.apply(__config, config);
        var workspace = Ext.create(__config.workspaceClass, __config.workspaceConfig);
        var navigation = Ext.create(__config.navigationClass,
            Ext.apply({workspace: workspace}, __config.navigationConfig));
        this.items = [
            Ext.create(__config.logoClass, __config.logoConfig),
            navigation, workspace,
            Ext.create(__config.copyrightClass, __config.copyrightConfig),
        ];
        this.callParent([config]);

        var hash = window.location.hash;
        var node = undefined;
        if (hash) {
            // 找到指定的节点并显示
            // 按-为分隔符查找子节点
            hash = hash.substr(1);
            var ids = hash.split('-');
            var nid = ids[0];
            node = navigation.getRootNode().findChild('id', nid);
            for (var i = 1; i < ids.length && node; i++) {
                nid = nid + '-' + ids[i];
                node.expand();
                node = node.findChild('id', nid);
            }
        } else {
            // 选择第一个叶子节点显示
            node = navigation.getRootNode();
            while (node && !node.isLeaf()) {
                node.expand();
                node = node.getChildAt(0);
            }
        }
        if (node) {
            navigation.fireEvent('itemclick', this, node);
            navigation.getSelectionModel().select(node);
        }
    },
});

/**
 * 消息提示
 *
 * {@link Ext.MessageBox}
 */
Ext.define('XHome.Msg', {
    singleton: true,

    /**
     * 弹出提示框
     *
     * @param {String} msg
     * 提示信息
     * @param {Function} fn
     * 回调函数
     * @param {Object} scope
     * 回调函数执行作用域
     */
    info: function(msg, fn, scope) {
        Ext.MessageBox.show({
            title: '提示',
            icon:  Ext.MessageBox.INFO,
            buttons: Ext.MessageBox.OK,
            msg: msg,
            fn: fn,
            scope: scope,
        });
    },
 
    /**
     * 弹出警告提示框
     *
     * @param {String} msg
     * 警告提示信息
     * @param {Function} fn
     * 回调函数
     * @param {Object} scope
     * 回调函数执行作用域
     */
    warn: function(msg, fn, scope) {
        Ext.MessageBox.show({
            title: '警告',
            icon:  Ext.MessageBox.WARNING,
            buttons: Ext.MessageBox.OK,
            msg: msg,
            fn: fn,
            scope: scope,
        });
    },
 
    /**
     * 弹出错误提示框
     *
     * @param {String} msg
     * 错误提示信息
     * @param {Function} fn
     * 回调函数
     * @param {Object} scope
     * 回调函数执行作用域
     */
    error: function(msg, fn, scope) {
        Ext.MessageBox.show({
            title: '错误',
            icon:  Ext.MessageBox.ERROR,
            buttons: Ext.MessageBox.OK,
            msg: msg,
            fn: fn,
            scope: scope,
        });
    },

    /**
     * 确认操作提示框
     *
     * @param {String} msg
     * 错误提示信息
     * @param {Function} fn
     * 回调函数
     * @param {Object} scope
     * 回调函数执行作用域
     */
    confirm: function(msg, fn, scope) {
        Ext.MessageBox.show({
            title: '提示',
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.MessageBox.YESNO,
            msg: msg,
            fn: fn,
            scope: scope,
        });
    },

    /**
     * 进度条提示框
     *
     * @param {String} msg
     * 提示信息
     * @param {Function} fn
     * 回调函数
     * @param {String} progressText
     * 进度条上显示的信息
     * @param {Object} waitConfig
     * A {@link Ext.ProgressBar.wait} config object
     * @param {Object} scope
     * 回调函数执行作用域
     */
    progress: function(msg, fn, progressText, waitConfig, scope) {
        Ext.MessageBox.show({
            title: '提示',
            progress: true,
            wait: true,
            icon:  Ext.MessageBox.INFO,
            buttons: Ext.MessageBox.CANCEL,
            msg: msg,
            fn: fn,
            progressText: progressText,
            waitConfig: waitConfig,
            scope: scope,
        });
    },

    /**
     * 隐藏提示窗口
     */
    hide: function(animateTarget, callback, scope) {
        Ext.MessageBox.hide(animateTarget, callback, scope);
    },
});

/**
 * JSON数据加载
 *
 * {@link Ext.data.JsonStore}
 */
Ext.define('XHome.data.JsonStore', {
    extend: 'Ext.data.JsonStore',

    /**
     * @cfg {Boolean} autoLoad
     * 自动加载数据
     */
    autoLoad: true,

    /**
     * @cfg {Boolean} wrapperBeforeload
     * 允许包装beforeload事件
     */
    wrapperBeforeload: true,

    /**
     * @cfg {Boolean} wrapperBeforeload
     * 允许包装load事件
     */
    wrapperLoad: true,

    /**
     * @cfg {Boolean} allowAbort
     * 允许取消数据加载请求
     */
    allowAbort: true,

    /**
     * @cfg {String} url
     * 数据加载连接，未配置proxy时有效
     */
    url: undefined,

    constructor: function(config) {
        config = Ext.apply({
            wrapperBeforeload: true,
            wrapperLoad: true,
            allowAbort: true,
        }, config);

        var listeners = Ext.apply({}, config.listeners);
        if (config.wrapperBeforeload) {
            var beforeload = listeners.beforeload;
            listeners.beforeload = function(store, operation) {
                // 数据加载前显示提示框
                XHome.Msg.progress('正在加载数据......',
                    function(buttonId, text, opt) {
                        // 如果在数据加载过程中点击了取消按钮，则取消数据加载
                        if (buttonId == 'cancel' && config.allowAbort) {
                            var req, requests = Ext.Ajax.requests;
                            for (id in requests) {
                                req = requests[id];
                                if (requests.hasOwnProperty(id)
                                    && req.options == operation.request) {
                                    Ext.Ajax.abort(req);
                                    break;
                                }
                            }
                        }
                    }
                );
                if (beforeload) {
                    beforeload(store, operation);
                }
            };
        }

        if (config.wrapperLoad) {
            var load = listeners.load;
            listeners.load = function(store, records, successful, eOpts) {
                // 数据加载完成后隐藏提示框
                Ext.MessageBox.hide();
                if (!successful) {
                    XHome.Msg.error(store.getProxy().getReader().rawData.message);
                }
                if (load) {
                    load(store, records, successful, eOpts);
                }
            };
        }
        config.listeners = listeners;

        if (!config.proxy && config.url) {
            // 配置默认proxy
            config.proxy = {
                type: 'ajax',
                url: config.url,
                reader: {
                    type: 'json',
                    root: 'results',
                    idProperty: 'id',
                    totalProperty: 'total',
                    messageProperty: 'message',
                    successProperty: 'success',
                }
            };
        }

        this.callParent([config]);
    },
});

/**
 * 分页工具条
 *
 * {@link Ext.toolbar.Paging}
 */
Ext.define('XHome.toolbar.Paging', {
    extend: 'Ext.toolbar.Paging',

    /**
     * @cfg {Boolean} border
     * 无边框
     */
    border: false,

    /**
     * @cfg {Boolean} displayInfo
     * 显示总条数提示信息
     */
    displayInfo: true,

    padding: 0,
    margin: 0,

    /**
     * @cfg {String} width
     * 默认宽度为100%
     */
    width: '100%',

    /**
     * @cfg {Function} onPagingBlur
     * 修改默认Blur事件,加载指定的分页
     */
    onPagingBlur: function(e) {
        var inputItem = this.getInputItem(),
            value = inputItem.getValue(),
            store = this.store,
            currentPage = store.currentPage;
        if (!isNaN(value) && value > 0 && value != currentPage) {
            var pageCount = Math.ceil(store.getTotalCount() / store.pageSize);
            if (value <= pageCount) {
                store.loadPage(value);
            } else {
                inputItem.setValue(currentPage);
            }
        } else {
            inputItem.setValue(currentPage);
        }
    },

    /**
     * @cfg {Ext.AbstractPlugin[]/Ext.AbstractPlugin/Object[]/Object/Ext.enums.Plugin[]/Ext.enums.Plugin} plugins
     * 扩展插件
     */
    plugins: [Ext.create('Ext.ux.PageSizeBar'), Ext.create('Ext.ux.ProgressBarPager')],
});

/**
 * 工具方法
 */
Ext.define('XHome.utils', {
    singleton: true,

    /**
     * 将数据对象转换为form表单格式的数据
     *
     * @param {Object} data
     * 待转换的数据对象
     * @param {String} prefix
     * 转换后的数据前缀
     * @param {String} dateFormat
     * 时间类型数据格式化, {@link Ext.Date.format}
     *
     * @return {Object} 返回key-value形式的数据
     */
    formEncode: function(data, prefix, dateFormat) {
        if (data == null || data == undefined) {
            return {};
        }
        if (prefix == null || prefix == undefined) {
            prefix = '';
        }
        if (dateFormat == null || dateFormat == undefined) {
            dateFormat = 'Y-m-d H:i:s';
        }

        /**
         * 时间类型对象转换
         *
         * @param {Date} d
         * 待转换的时间对象
         *
         * @return {String} 返回格式化后的时间对象
         */
        var encodeDate = function(d) {
            return Ext.Date.format(d, dateFormat);
        };

        /**
         * 数组类型对象转换
         *
         * @param {Array} a
         * 待转换的数组对象
         * @param {String} p
         * 转换后的数据前缀
         *
         * @return {Object} 返回key-value形式的数据
         */
        var encodeArray = function(a, p) {
            var r = {};
            for (var i = 0; i < a.length; i++) {
                var t = {}, v = a[i];
                if (v instanceof Function) {
                    continue;
                } else if (v instanceof Date) {
                    r[p + '[' + i + ']'] = encodeDate(v);
                } else if (v instanceof Array) {
                    t = encodeArray(v, '[' + i + ']');
                } else if (v instanceof Object) {
                    t = encodeObject(v, '[' + i + ']');
                } else {
                    r[p + '[' + i + ']'] = a[i];
                }
                for (tk in t) {
                    r[p + tk] = t[tk];
                }
            }
            return r;
        };

        /**
         * 对象类型对象转换
         *
         * @param {Object} o
         * 待转换的数据对象
         * @param {String} p
         * 转换后的数据前缀
         *
         * @return {Object} 返回key-value形式的数据
         */
        var encodeObject = function(o, p) {
            var r = {};
            for (k in o) {
                var t = {}, v = o[k];
                if (v instanceof Function) {
                    continue;
                } else if (v instanceof Date) {
                    r[p + '.' + k] = encodeDate(v);
                } else if (v instanceof Array) {
                    t = encodeArray(v, k);
                } else if (v instanceof Object) {
                    t = encodeObject(v, k);
                } else {
                    r[p + '.' + k] = v;
                }
                for (tk in t) {
                    r[p + '.' + tk] = t[tk];
                }
            }
            return r;
        };

        var result = {};
        if (data instanceof Function) {
            return {};
        } else if (data instanceof Date) {
            result[prefix] = encodeDate(data);
        } else if (data instanceof Array) {
            return encodeArray(data, prefix);
        } else if (data instanceof Object) {
            return encodeObject(data, prefix);
        } else {
            result[prefix] = data;
        }
        return result;
    },

    /**
     * Ajax 请求工具方法
     *
     * @param {Object} config
     * 请求配置项
     * confirmMsg 确认操作提示，如果为空不会有确实提示
     * progressMsg 正在进行操作提示，如果为空，不会有操作提示
     * url 请求地址
     * method 请求类型，默认为POST
     * params 请求参数
     * success 执行成功后的回调函数
     * error 执行失败后的回调函数
     * failure 请求失败后的回调函数
     */
    request: function(config) {
        if (!config.method) {
            config.method = 'POST';
        }
        var doRequest = function() {
            var request = Ext.Ajax.request({
                url: config.url,
                method: config.method,
                params: config.params,
                success: function(response, options) {
                    var result = Ext.JSON.decode(response.responseText);
                    XHome.Msg.hide();
                    if (result.success) {
                        XHome.Msg.info(result.message);
                        if (config.success instanceof Function) {
                            config.success(result, response, options);
                        }
                    } else {
                        XHome.Msg.error(result.message);
                        if (config.error instanceof Function) {
                            config.error(result, response, options);
                        }
                    }
                },
                failure: function(response, options) {
                    XHome.Msg.hide();
                    if (!response.aborted) {
                        XHome.Msg.info('请求失败');
                    }
                    if (config.failure instanceof Function) {
                        config.failure(response, options);
                    }
                },
            });
            if (config.progressMsg) {
                XHome.Msg.progress(config.progressMsg, function(btn) {
                    if (btn == 'cancel') {
                        Ext.Ajax.abort(request);
                    }
                });
            }
        };
        if (config.confirmMsg) {
            XHome.Msg.confirm(config.confirmMsg, function(btn) {
                if (btn == 'yes') {
                    doRequest();
                }
            });
        } else {
            doRequest();
        }
    },

    /**
     * 可编辑表格右键与双击事件绑定
     *
     * @param {Object} grid
     * 可编辑表格对象, {@link XHome.Dashboard.EditorGridPanel}
     * @param {Object} menu
     * 右键菜单，{@link Ext.menu.Menu}
     * @param {Function} dblclickCallback
     * 表格双击事件回调函数
     */
    bindGridClick: function(grid, menu, dblclickCallback) {
        grid.on('itemcontextmenu', function(gridView, record, item, index, e, eOpts ) {
            e.preventDefault();
            grid.getSelectionModel().select(record);
            menu.showAt(e.getXY());
        });
        grid.on('itemdblclick', function(gridView, record, item, index, e, eOpts ) {
            grid.getSelectionModel().select(record);
            dblclickCallback(record, item, index, e, eOpts);
        });
    },
});
