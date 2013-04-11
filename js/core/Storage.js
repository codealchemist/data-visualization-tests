define([
    "log"
], function(Log){
    /**
     * LocalStorage interface.
     *
     * @author Alberto Miranda <alberto@glyder.co>
     */
    var Storage = (function(){
        /**
         * Returns value for passed key.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         * @param {string} key
         * @return {mixed}
         */
        var get = function(key){
            var itemString = localStorage.getItem(key);
            var itemObj = JSON.parse(itemString);
            return itemObj;
        };

        /**
         * Sets passed value for passed key.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         * @param {string} key
         * @param {mixed} value
         */
        var set = function(key, value){
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
        };

        /**
         * Unsets passed key.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         * @param {string} key
         */
        var remove = function(key){
            localStorage.removeItem(key);
        };

        /**
         * Unsets all keys.
         *
         * @author Alberto Miranda <alberto@glyder.co>
         */
        var removeAll = function(){
            localStorage.clear();
        };

        return {
            get: get,
            set: set,
            remove: remove,
            removeAll: removeAll
        };
    })();

    Log.write('STORAGE loaded');
    return Storage;
});