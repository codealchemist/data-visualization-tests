define([
   "jquery",
   "d3",
   "ui",
   "log"
], function($, d3, Ui, Log){
    var testName = 'DATA SCROLL 1';
    var container = '#visualization';
    var description = 'Bar graph using <a href="http://d3js.org">d3</a>.<br />Using mouse wheel event.<br />Copied form <a href="http://bl.ocks.org/mbostock/4062085">d3 sample</a>.';
    Ui.Loading.show();
    App.d3 = d3;

    /**
     * Load and render current test.
     * Adds event handling.
     */
    var load = function() {
        Log.write('loading test: ' + testName);
        $(container).html('');

        //load related css file
        Ui.loadCss('scroll1.test');
        
        //handle scroll
        Ui.onScroll(function(){
            Log.write('SCROLLED!');

            var year = App.Visualization.year,
                data = App.Visualization.data,
                year0 = App.d3.min(data, function(d) { return d.year; }),
                year1 = App.d3.max(data, function(d) { return d.year; });

            switch (App.Ui.scroll.scrolledUp) {
                case true: year = Math.max(year0, year - 10); break;
                case false: year = Math.min(year1, year + 10); break;
            }
            App.Visualization.update(year);
        });

        //show description
        $('#description').html(description);
        
        //render
        render();
    };

    /**
     * Renders current test.
     */
    var render = function() {
        var margin = {top: 20, right: 40, bottom: 30, left: 20},
            width = 900 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            barWidth = Math.floor(width / 19) - 1;

        var x = d3.scale.linear()
            .range([barWidth / 2, width - barWidth / 2]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("right")
            .tickSize(-width)
            .tickFormat(function(d) { return Math.round(d / 1e6) + "M"; });

        // An SVG element with a bottom-right origin.
        var svg = d3.select(container).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // A sliding container to hold the bars by birthyear.
        var birthyears = svg.append("g")
            .attr("class", "birthyears");

        // A label for the current year.
        var title = svg.append("text")
            .attr("class", "title")
            .attr("dy", ".71em")
            .text(2000);

        d3.csv("js/data/population.csv", function(error, data) {
            //Log.write(data);

            // Convert strings to numbers.
            data.forEach(function(d) {
                d.people = +d.people;
                d.year = +d.year;
                d.age = +d.age;
            });

            // Compute the extent of the data set in age and years.
            var age1 = d3.max(data, function(d) { return d.age; }),
                year0 = d3.min(data, function(d) { return d.year; }),
                year1 = d3.max(data, function(d) { return d.year; }),
                year = year1;
            App.Visualization.data = data;
            App.Visualization.year = year;

            // Update the scale domains.
            x.domain([year1 - age1, year1]);
            y.domain([0, d3.max(data, function(d) { return d.people; })]);

            // Produce a map from year and birthyear to [male, female].
            data = d3.nest()
                .key(function(d) { return d.year; })
                .key(function(d) { return d.year - d.age; })
                .rollup(function(v) { return v.map(function(d) { return d.people; }); })
                .map(data);

            // Add an axis to show the population values.
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + width + ",0)")
                .call(yAxis)
                .selectAll("g")
                .filter(function(value) { return !value; })
                .classed("zero", true);

            // Add labeled rects for each birthyear (so that no enter or exit is required).
            var birthyear = birthyears.selectAll(".birthyear")
                .data(d3.range(year0 - age1, year1 + 1, 5))
                .enter().append("g")
                .attr("class", "birthyear")
                .attr("transform", function(birthyear) { return "translate(" + x(birthyear) + ",0)"; });

            birthyear.selectAll("rect")
                .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
                .enter().append("rect")
                .attr("x", -barWidth / 2)
                .attr("width", barWidth)
                .attr("y", y)
                .attr("height", function(value) { return height - y(value); });

            // Add labels to show birthyear.
            birthyear.append("text")
                .attr("y", height - 4)
                .text(function(birthyear) { return birthyear; });

            // Add labels to show age (separate; not animated).
            svg.selectAll(".age")
                .data(d3.range(0, age1 + 1, 5))
                .enter().append("text")
                .attr("class", "age")
                .attr("x", function(age) { return x(year - age); })
                .attr("y", height + 4)
                .attr("dy", ".71em")
                .text(function(age) { return age; });

            App.Visualization.update = function update(year) {
                App.Visualization.year = year;
                Log.write('YEAR: ' + year);
                if (!(year in data)) return;
                title.text(year);

                birthyears.transition()
                    .duration(150)
                    .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

                birthyear.selectAll("rect")
                    .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
                    .transition()
                    .duration(250)
                    .attr("y", y)
                    .attr("height", function(value) { return height - y(value); });
            };
        });

        App.Visualization.element = svg;
    };

    Ui.Loading.hide();
    return {
        load: load
    };
});