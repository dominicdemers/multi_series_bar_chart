var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("id", "all_g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);

var x1 = d3.scaleBand().padding(0.05);

var y = d3.scaleLinear().rangeRound([height, 0]);

var z = d3.scaleOrdinal(d3.schemeCategory20);

var hz = d3.scaleLinear().rangeRound([400, 480]);
var hz2 = d3.scaleOrdinal()
    .domain(data).range([233.08,
        246.94,
        261.63,
        277.18,
        293.66,
        311.13,
        329.63,
        349.23,
        369.99,
        392,
        415.3,
        440,
        466.16,
        493.88,
        523.25,
        554.37,
        587.33,
        622.25,
        659.25,
        698.46,
        739.99,
        783.99,
        830.61,
    ]);

dispatch.on("load_chart", function (chart_data) {

    var new_depts = _.map(d3.select("#sel_dept").property("selectedOptions"), function (x) {
        return x.value;
    });
    debugger;
    // TO CHANGE INPUT DATA SET
    var start_dept = ["Employment and Social Development Canada"];
    var start_reg = ["National Capital Region"];
    var start_fol = ["Z"];
    var start_Q = ["MAN_80"];

    var new_chart_data = _.map(chart_data[start_tenure][start_Q], function (answer, a_key) {
        var dept_list = _.filter(answer, function (row) {
            return new_depts.includes(_.keys(row)[0]);
        });
        return Object.assign.apply(Object, [{}, { Category: answer_labels[a_key] }].concat(_toConsumableArray(dept_list)));
    });

    debugger;

    x0.domain(new_chart_data.map(function (d) {
        return d.Category;
    }));

    x1.domain(new_depts)
        .rangeRound([0, x0.bandwidth()]);

    y.domain([0, d3.max(new_chart_data, function (d) {
        return d3.max(new_depts, function (y) {
            return d[y];
        });
    })]).nice();



    g.append("g")
        .attr("id", "chart_g")
        .selectAll("g")
        .data(new_chart_data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + x0(d.Category) + ",0)";
        })
        .attr("id", "rect_g")
        .selectAll("rect")
        .data(function (d, i) {
            return new_depts.map(function (y) {
                return { key: y, value: d[y], tabindex: i + 1 };
            });
        })
        .enter()
        .append("rect")
        .attr("tabindex", function (d) {
            return d.tabindex;
        })
        .attr("x", function (d) {
            return x1(d.key);
        })
        .attr("y", function (d) {
            return y(+d.value);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function (d) {
            return height - y(+d.value);
        })
        .attr("fill", function (d) {
            return z(d.key);
        })
        .on("focus", function (d, i) {

            oscillator.frequency.value = hz(d.value);
            oscillator.connect(context.destination);
            setTimeout(function () {
                oscillator.disconnect(context.destination);
            }, 100);
        });

     g.append("g")
         .attr("class", "xaxis")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x0));


    g.append("g")
        .attr("class", "yaxis")
        .call(
            d3.axisLeft(y)
                .tickFormat(formatPercent)
                .ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", function () {return y(y.ticks().pop()) + 0.5 })
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("%");

    dispatch.on("update_chart", function (update_data) {

        var new_deptx = _.map(d3.select("#sel_dept").property("selectedOptions"), function (x) {
            return x.value;
        });

        debugger;
        //For the ordinal range, I need to select all values that are in the graph, ans map then tp

        // data is the chart values

        x0.domain(update_data.map(function (d) {
            return d.Category;
        }));
        x1.domain(new_deptx).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(update_data, function (d) {
            return d3.max(new_deptx, function (state) {
                return d[state];
            });
        })]).nice();

        d3.select(".yaxis").transition(750).call(d3.axisLeft(y).tickFormat(formatPercent).ticks(null, "s"));

        var old_g = d3.select("#chart_g").selectAll("#rect_g").data(update_data);

        var old_bar = old_g.selectAll("rect").data(function (d, i) {
            return _.map(new_deptx, function (state, j) {
                return { key: state, value: d[state], tabindex: new_deptx.length * i + j + 1 };
            });
        });
        debugger;
        old_bar.exit().remove();

        var new_bar = old_bar.enter().append("rect").on("focus", function (d, i) {
            oscillator.frequency.value = hz(d.value);
            oscillator.connect(context.destination);
            setTimeout(function () {
                oscillator.disconnect(context.destination);
            }, 100);
        });

        new_bar.merge(old_bar).transition(750).attr("tabindex", function (d) {
            return d.tabindex;
        }).attr("x", function (d) {
            return x1(d.key);
        }).attr("y", function (d) {
            return y(d.value);
        }).attr("width", x1.bandwidth()).attr("height", function (d) {
            return height - y(d.value);
        }).attr("fill", function (d) {
            return z(d.key);
        });
    });
});
