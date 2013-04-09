define([
    "log"
], function(Log){
    /**
    * Set value for passed namespace string.
    * 
    * @author Alberto Miranda <alberto@glyder.co>
    * @param {string} namespace
    * @param {mixed} data
    */
    var set = function(namespace, data) {
        if(data==undefined) data = {};
        var parts = namespace.split('.');
        var parent = parts.shift();
        var dataProperty = parts.pop();
        if (typeof window[parent] != 'object' || window[parent] == null ) window[parent] = {};
        parent = window[parent];

        var len = parts.length;
        var currentProperty = null;
        for (var i = 0; i < len; ++i) {
            //create property if it doesn't exist
            currentProperty = parts[i];
            if (typeof parent[ currentProperty ] != 'object' || window[parent] == null){
                parent[ currentProperty ] = {};
            }
            parent = parent[ currentProperty ];
        }

        //assign passed data and return object
        parent[ dataProperty ] = data;
        return parent;
   };
   
   /**
    * Get value from passed namespace string.
    * 
    * @author Alberto Miranda <alberto@glyder.co>
    * @param {string} namespace
    * @return {mixed}
    */
    var get = function(namespace) {
        var parts = namespace.split('.');
        var parent = parts.shift();

        //handle one item name only
        if (!parts.length) return window[parent];

        var dataProperty = parts.pop();
        if (typeof window[parent] === "undefined") {
            return false;
        }
        parent = window[parent];

        var len = parts.length;
        var currentProperty = null;
        for (var i = 0; i < len; ++i) {
            //create property if it doesn't exist
            currentProperty = parts[i];
            if (typeof parent[ currentProperty ] === "undefined"){
                parent[ currentProperty ] = {};
            }
            parent = parent[ currentProperty ];
        }

        return parent[ dataProperty ];
    };
    Log.write('NAMESPACE loaded');
    
    //--------------------------------------------------------------------------
    
    //public interface
    return {
        get: get,
        set: set
    };
});
