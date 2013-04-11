define([
    "d3",
    "ui",
    "log",
    "skrollr",
    "template",
    "settings"
], function(d3, Ui, Log, skrollr, Template, Settings){
    var testName = 'PARALLAX2';
    var container = '#visualization';
    var cssFile = Settings.testsCssFolder + 'parallax3.test';
    var description = '<a href="http://en.wikipedia.org/wiki/Parallax_scrolling">Parallax scrolling</a> demo using ' +
        '<a href="https://github.com/Prinzhorn/skrollr">Skrollr</a>.<br />' +
        'Dynamically loading Tweets from <a href="http://www.twitter.com/albertomiranda/">my timeline</a>.<br /><br />' +
        '<blockquote>Actually, skrollr is much more than "just" parallax scrolling. It\'s a full-fledged scrolling animation library. In fact, you can use it and still have no parallax scrolling at all. But I wanted to sound hip and use some buzz-words. By the way, skrollr leverages HTML5 and CSS3 ;-)</blockquote>';

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
        Ui.loadCss(cssFile);

        //center container
        var marginLeft = $(window).width()/2 - $('.container').width()/2;
        $('.container').css({"margin-left": marginLeft + "px"});

        Template.render({
            templateName: 'parallax3.template.html',
            targetId: 'visualization',
            data: tweets,
            callback: function() {
                console.log('RENDERED!');

                d3.select(".parallaxForeground3")
                    .selectAll("p")
                    .data(tweets)
                    .enter().append("p")
                    .text(function(d) { return d.text; })
                    .attr("data-0", function(d,i){
                        //displace tweets so every one is visible, one next to the other
                        var px = 650 * i;
                        return "left: " + px + "px";
                    })
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
                skrollr.init({
                    forceHeight: false
                });
                Ui.Loading.hide();
            }
        });
    };

    return {
        load: load
    };
});