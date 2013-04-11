define([
    "d3",
    "ui",
    "log",
    "curtain",
    "settings"
], function(d3, Ui, Log, curtain, Settings){
    var testName = 'CURTAIN';
    var container = '#visualization';
    var cssFile = Settings.testsCssFolder + 'curtain.test';
    var description = 'Content scroll demo using ' +
        '<a href="https://github.com/Victa/curtain.js">Curtain.js</a>.<br />' +
        'Dynamically loading Tweets from <a href="http://www.twitter.com/albertomiranda/">my timeline</a>.<br /><br />' +
        '<blockquote>This plugin (Curtain.js) allows you to create a web page with multiple fixed panels that unroll with an amusing effect. Exactly like a curtain rises.</blockquote>';

    /**
     * Load and render current test.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     */
    var load = function() {
        Log.write('Loading test: ' + testName);
        $(container).html('');
        Ui.removeScroll();
        Ui.Loading.show();

        //load tweets and render
        var screenName = "albertomiranda";
        var tweetsCount = 13;
        $.ajax({
            url: "https://api.twitter.com/1/statuses/user_timeline.json?callback=?&screen_name=" + screenName + "&count=" + tweetsCount,
            dataType: "jsonp",
            success: function(response) {
                render(response);
            }
        });

        //show description
        $('#description').html(description);
    };

    /**
     * Renders current test.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param {array} tweets
     */
    var render = function(tweets) {
        Log.write(tweets);

        $('html').append(
            '<ol class="curtains">' +
            '   <li class="cover blue">' +
            '       <div>' +
            '           Curtain.js test<br />' +
            '           <blockquote>This plugin allows you to create a web page with multiple fixed panels that unroll with an amusing effect. Exactly like a curtain rises.</blockquote>' +
            '       </div>' +
            '   </li>' +
            '   <li class="green">' +
            '       <div class="cover"><br />' +
            '           <h1>Tweets loaded below</h1><br />' +
            '           <em>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</em>' +
            '       </div>' +
            '   </li>' +
            '   <li class="black">' +
            '       <div class="fixed">' +
            '           <ul id="tweets">' +
            '           </ul>' +
            '       </div>' +
            '   </li>' +
            '</ol>'
        );
        Ui.loadCss(cssFile);

        d3.select("#tweets")
            .selectAll("li")
            .data(tweets)
            .enter().append("li")
            .attr("class", "step")
            .text(function(d) { return d.text; })
            .on('click', function(d, i){
                Log.write(d);
                var tweetUrl = "http://twitter.com/" + d.user.name + "/status/" + d.id_str;
                Log.write('opening tweet: ' + tweetUrl);
                window.open(tweetUrl);

                d3.select(this)
                    .style('background', 'orange', 'important')
                    .style('opacity', '0.3')
                    .on('click', null);
            });

        //init curtain
        $('.curtains').curtain({
            scrollSpeed: 1000
        });

        Ui.Loading.hide();
    };

    return {
        load: load
    };
});