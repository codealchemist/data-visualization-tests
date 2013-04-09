define([
    'd3',
    'log',
    'settings'
], function(d3, Log, Settings){
    var container = '#visualization';
    
    /**
     * Shows / hides loading animation.
     * 
     * @author Alberto Miranda <alberto.php@gmail.com>
     */
    var Loading = {
        show: function() {
            d3.select(container).append("div").attr("class", "loading");
        },
        hide: function() {
            d3.select(container + ' .loading').remove();
        }
    };
    
    /**
     * Scroll timed listener.
     * Avoids calling the callback each time scroll is fired, which happens
     * A LOT! Instead, detects if scroll ocurred and after a given interval, if
     * it did so, calls the callback function.
     * 
     * @author Alberto Miranda <alberto.php@gmail.com>
     */
    var scrollInterval;
    var onScroll = function(callback) {
        $(container).on('wheel', function(event){
            //gecko compatible
            App.Ui.scroll.didScroll = true;

            if (event.originalEvent.deltaY >= 0) {
                App.Ui.scroll.scrolledUp = true;
            } else {
                App.Ui.scroll.scrolledUp = false;
            }

            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
        });
        $(container).on('mousewheel', function(event){
            //webkit compatible
            App.Ui.scroll.didScroll = true;
            
            if (event.originalEvent.wheelDelta >= 0) {
                App.Ui.scroll.scrolledUp = true;
            } else {
                App.Ui.scroll.scrolledUp = false;
            }

            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
        });

        scrollInterval = setInterval(function() {
            if ( App.Ui.scroll.didScroll ) {
                App.Ui.scroll.didScroll = false;
                if (App.Ui.scroll.scrolledUp) {
                    ++App.Ui.scroll.value;
                } else {
                    --App.Ui.scroll.value;
                }
                
                if (typeof callback == 'function') {
                    callback(App.Ui.scroll);
                }
            }
        }, 50);
    };

    /**
     * Removes scroll interval function.
     */
    var removeScroll = function() {
        clearInterval(scrollInterval);
    };

    /**
     * Handles Menu actions.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param {string} id
     */
    var Menu = {
        /**
         * Activates passed menu item id.
         *
         * @author Alberto Miranda <alberto.php@gmail.com>
         * @param {string} id
         */
        activate: function(id) {
            this.deactivateAll();
            $('#menu-' + id).addClass('active');
        },

        /**
         * Deactivates all menu items.
         *
         * @author Alberto Miranda <alberto.php@gmail.com>
         */
        deactivateAll: function() {
            $('.nav li').removeClass('active');
        }
    };

    /**
     * Loads requested CSS file.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param {string} filename Without .css
     */
    var loadCss = function(filename){
        Log.write(Settings);
        var cssFile = Settings.testsCssFolder + filename + '.css';
        Log.write('loading css: ' + cssFile);
        $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', cssFile) );
    };
    
    Log.write('UI loaded');
    return {
        onScroll: onScroll,
        removeScroll: removeScroll,
        Loading: Loading,
        Menu: Menu,
        loadCss: loadCss
    };
});