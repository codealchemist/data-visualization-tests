//tests container
define([
   "tests/Scroll1.test",
   "tests/Scroll2.test",
   "tests/Parallax1.test",
   "tests/Parallax2.test"
], function(Scroll1, Scroll2, Parallax1, Parallax2){
    console.log('[ APP ] --> tests loaded');
    
    return {
        Scroll1: Scroll1,
        Scroll2: Scroll2,
        Parallax1: Parallax1,
        Parallax2: Parallax2
    };
});