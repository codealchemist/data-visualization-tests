define([
    "d3",
    "ui",
    "log",
    "jparallax"
], function(d3, Ui, Log){
    var testName = 'PARALLAX1';
    var container = '#visualization';
    var description = '<a href="http://en.wikipedia.org/wiki/Parallax_scrolling">Parallax scrolling</a> demo using <a href="http://stephband.info/jparallax">jquery.parallax</a>.<br />Dynamically loading Tweets from <a href="http://www.twitter.com/albertomiranda/">my timeline</a>.';
    App.d3 = d3;

    /**
     * Load and render current test.
     * Adds event handling.
     */
    var load = function() {
        Log.write('Loading test: ' + testName);
        $(container).html('');
        Ui.removeScroll();
        Ui.Loading.show();

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
     */
    var render = function(tweets) {
        Log.write(tweets);

        $('#visualization').append('<div class="port"><div class="parallaxBackground parallax-layer"></div><div class="parallaxForeground parallax-layer"></div></div>');
        Ui.loadCss('parallax1.test');

        var elements = d3.select(".parallaxForeground")
            .selectAll("p")
            .data(tweets)
            .enter().append("p")
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

        //init parallax
        jQuery('.parallax-layer').parallax({
            mouseport: jQuery(".port"),
            xparallax: false
        }, {
            yparallax: "600px",
            yorigin: 0
        }, {
            yparallax: "1600px",
            yorigin: 0
        });

        //App.Visualization.element = svg;
        Ui.Loading.hide();
    };

    return {
        load: load
    };
});