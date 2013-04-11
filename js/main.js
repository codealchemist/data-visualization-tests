/*global require*/
'use strict';

//namespace
var App = {
    isLoading: false,
    Ui: {
        scroll: {
            didScroll: false,
            scrolledUp: false,
            value: 0
        }
    },
    Visualization: {

    }
};

// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        d3: {
            exports: 'd3'
        },
        jquery: {
            exports: 'jquery'
        },
        jparallax: {
            deps: ['jquery'],
            exports: 'jparallax'
        },
        skrollr: {
            exports: 'skrollr'
        },
        curtain: {
            deps: ['jquery'],
            exports: 'curtain'
        },
        handlebars: {
            exports: 'handlebars'
        }
    },
    paths: {
        d3: 'lib/d3.v3.min',
        jparallax: 'lib/jquery.parallax.min',
        skrollr: 'lib/skrollr.min',
        curtain: 'lib/curtain',
        jquery: 'lib/jquery-1.9.1.min',
        handlebars: 'lib/handlebars',
        log: 'core/Log',
        ui: 'core/Ui',
        namespace: 'core/Namespace',
        settings: 'settings',
        string: 'core/String',
        template: 'core/Template',
        storage: 'core/Storage'
    }
});

require([
    'app',
    'log'
], function (App, Log) {
    Log.write('MAIN loaded');
    App.Tests.Scroll1.load();
});
