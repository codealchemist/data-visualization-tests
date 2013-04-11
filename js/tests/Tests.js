//tests container
define([
   "tests/Scroll1.test",
   "tests/Scroll2.test",
   "tests/Parallax1.test",
   "tests/Parallax2.test",
   "tests/Parallax3.test",
   "tests/Curtain.test"
], function(Scroll1, Scroll2, Parallax1, Parallax2, Parallax3, Curtain){
    console.log('[ APP ] --> tests loaded');
    
    return {
        Scroll1: Scroll1,
        Scroll2: Scroll2,
        Parallax1: Parallax1,
        Parallax2: Parallax2,
        Parallax3: Parallax3,
        Curtain: Curtain
    };
});