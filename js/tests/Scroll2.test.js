define([
    "d3",
    "ui",
    "log"
], function(d3, Ui, Log){
    var testName = 'DATA SCROLL 2';
    var container = '#visualization';
    var description = 'Quasi parallax with overriden scrolling.<br />Using mouse wheel event.<br />Dynamically loading Tweets from <a href="http://www.twitter.com/albertomiranda/">my timeline</a>.';
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

        //show description
        $('#description').html(description);

        var screenName = "albertomiranda";
        var tweetsCount = 10;
        $.ajax({
            url: "https://api.twitter.com/1/statuses/user_timeline.json?callback=?&screen_name=" + screenName + "&count=" + tweetsCount,
            dataType: "jsonp",
            success: function(response) {
                render(response);
            }
         });

        //handle scroll
        Ui.onScroll(function(){
            Log.write('SCROLLED!');
            var val = App.Ui.scroll.value;

            function scrollTween(element) {
                return function() {
                    var height = $(element).height();
                    var pHeight = $(element + ' p').height();
                    var marginTop = parseInt($(element).css("margin-top").replace("px", ""), 10);
                    var move = pHeight;
                    if (App.Ui.scroll.scrolledUp) move = -move;
                    var distance = move + marginTop;

                    //boundary check
                    var topMargin = pHeight;
                    var bottomMargin = $('.visualizationContainer').height();
                    if (distance > topMargin) { //top
                        Log.write("SCROLL TOP LIMIT REACHED!");
                        return function(t) { $(element).css({"margin-top": "20px"}); };
                    }
                    //Log.write("HEIGHT: " + height + ", P HEIGHT: " + pHeight + ", DISTANCE: " + distance);
                    if ( distance < -(height - bottomMargin + pHeight) ) { //bottom
                        Log.write('SCROLL BOTTOM LIMIT REACHED!');
                        return false;
                    }

                    var i = d3.interpolateNumber(marginTop, distance);
                    return function(t) { $(element).css({"margin-top": i(t)}); };
                };
            }

            function backgroundTween(element) {
                return function() {
                    var backgroundPosition = $(element).css("background-position");
                    Log.write("BACKGROUND POS: " + backgroundPosition);
                    var matches = backgroundPosition.match(/^[-0-9.]+px ([-0-9.]+)px$/);
                    Log.write(matches);
                    var currentTop;
                    if (matches) {
                        currentTop = parseInt(matches[1], 10);
                    } else {
                        currentTop = 0;
                    }
                    var height = $(element).height();
                    var move = 5;
                    var distance;
                    if (App.Ui.scroll.scrolledUp) {
                        distance = currentTop - move;
                    } else {
                        distance = currentTop + move;
                    }
                    Log.write("HEIGHT: " + height + ", CURRENT TOP: " + currentTop + ", DISTANCE: " + distance);

                    //boundary check
                    var bottom = $('.visualizationContainer').height();
                    if (distance > move-10) { //top
                        Log.write("SCROLL TOP LIMIT REACHED!");
                        return function(t) {
                            var position = "0px 0px";
                            $(element).css({"backgroundPosition": position});
                        };
                    }

                    if ( distance < -(height - Math.abs(currentTop)) ) { //bottom
                        Log.write('SCROLL BOTTOM LIMIT REACHED!');
                        return false;
                    }

                    var i = d3.interpolateNumber(currentTop, distance);
                    return function(t) {
                        var position = 0 + "px " + distance + "px";
                        $(element).css({"backgroundPosition": position});
                    };
                };
            }

            d3.select('.scrollForeground').transition()
                .delay(25)
                .duration(100)
                .tween("scrollTop", scrollTween('.scrollForeground'));

            d3.select('.scrollBackground').transition()
                .delay(250)
                .duration(7500)
                .tween("scrollBackground", backgroundTween('.scrollBackground'));
        });
    };

    /**
     * Renders current test.
     */
    var render = function(tweets) {
        Log.write(tweets);

        $('#visualization').append('<div class="scrollBackground"><div class="scrollForeground"></div></div>');
        Ui.loadCss('scroll2.test');

        var elements = d3.select(".scrollForeground")
            .selectAll("p")
            .data(tweets)
            .enter().append("p")
            .text(function(d) { return d.text; });

        //App.Visualization.element = svg;
        Ui.Loading.hide();
    };

    return {
        load: load
    };
});