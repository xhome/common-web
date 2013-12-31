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
 *         navigationConfig: { // 导航菜单配置
 *             title: 'Navigation',
 *             root: {
 *                 children: [{
 *                     id: 'msys',
 *                     text: '系统配置',
 *                     leaf: true,
 *                     iconCls: 'icon-test', // 重置默认图标
 *                     showScript: 'xauth/js/user/user.js', // 显示面板所需加载的javascript
 *                     showClass: 'Ext.panel.Panel', // 显示面板类
 *                     showConfig: { // 显示面板配置
 *                         id: 'sys_config',
 *                         html: 'System Config',
 *                     }
 *                 }, {
 *                     id: 'mxauth',
 *                     text: '认证管理',
 *                     leaf: false,
 *                     children: [{
 *                         id: 'mxauth_role',
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
    height: 80
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
    extend: 'Ext.panel.Panel',

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
     * @cfg {Object} defaults
     * 所有子元素默认样式
     */
    defaults: {
        margin: 'auto',
    },

    /**
     * @cfg {String} region
     * 布局位置
     */
    region: 'north',
});

/**
 * 可编辑表格
 *
 * {@link Ext.grid.Panel}
 */
Ext.define('XHome.Dashboard.EditorGridPanel', {
    extend: 'Ext.grid.Panel',

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
        }
        this.callParent([config]);
    },
});

/**
 * 版权信息面板
 *
 * {@link Ext.panel.Panel}
 */
Ext.define('XHome.Dashboard.Copyright', {
    id: 'xhome_dashboard_copyright',
    extend: 'Ext.panel.Panel',

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
            hash = hash.substr(1);
            var ids = hash.split('_');
            var nid = ids[0];
            node = navigation.getRootNode().findChild('id', nid);
            for (var i = 1; i < ids.length && node; i++) {
                nid = nid + '_' + ids[i];
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
            pageSize: 1,
        }, config);

        var listeners = Ext.apply({}, config.listeners);
        if (config.wrapperBeforeload) {
            var beforeload = listeners.beforeload;
            listeners.beforeload = function(store, operation) {
                // 数据加载前显示提示框
                XHome.Msg.progress('正在加载数据……',
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
