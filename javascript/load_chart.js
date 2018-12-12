"use strict";



function _toConsumableArray(arr) {
    let i;
    let arr2;
    if (Array.isArray(arr)) {
        for ( i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; }
        else { return Array.from(arr);
    }
}

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("id", "all_g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);

let x1 = d3.scaleBand().padding(0.05);

let y = d3.scaleLinear().rangeRound([height, 0]);

// var hz_old = d3.scaleLinear().rangeRound([400, 480]);
// var hz_range = [262, 988];
// var hz = d3.scaleLinear().domain(d3.extent(y.domain())).range(hz_range);
// var mEvent = false;

dispatch.on("load_chart", function (chart_data) {

    // var new_depts = _.map(d3.select("#sel_dept").property("selectedOptions"), function (x) {
    //     return x.value;
    // });

    let selectedDeptArray = [];
    let selObj = document.getElementById('sel_dept');
    let i;
    let count = 0;
    for (i=0; i<selObj.options.length; i++) {
        if (selObj.options[i].selected) {
            selectedDeptArray[count] = selObj.options[i].value;
            count++;
        }
    }

    let new_depts = selectedDeptArray;

    let new_chart_data_1 = _.groupBy(_.filter(chart_data[start_fol][start_reg][start_Q], function (answer) {
        return _.contains(new_depts, answer.final_dept_e);
    }), 'question_value');


    let new_chart_data = _.map(new_chart_data_1, function (value) {

        let mapped = _.map(value, function (dept) {
            return _defineProperty({}, dept.final_dept_e, dept.shr_w_resp);
        });

        let tempx1 =  _.extend.apply(null, mapped);
        // let newObj = _.extend(tempx1 , {
        //     Answer: value[0].question_value
        // });

        // var newObj = Object.assign.apply(Object, [{}].concat(_toConsumableArray(mapped), [{
        //     Answer: value[0].question_value
        // }]));

        return _.extend(tempx1 , {
            Answer: value[0].question_value,
            Sorter: value[0].sorter
        });
    });

    if(new_chart_data.length == 0) {
        d3.select("#no_response")
          .style("display","block");
        d3.select("#table_div")
          .style("display","none");
    }


    x0.domain(_.keys(new_chart_data_1));

    x1.domain(new_depts).rangeRound([0, x0.bandwidth()]);

    y.domain([0, d3.max(new_chart_data, function (d) {
        return d3.max(new_depts, function (y) {
            return d[y];
        });
    })]).nice();

    g.append("g").attr("id", "chart_g").selectAll("g").data(new_chart_data).enter().append("g").attr("transform", function (d) {
        return "translate(" + x0(d.Answer) + ",0)";
    }).attr("id", "rect_g").selectAll("rect").data(function (d, i) {
        return new_depts.map(function (y) {
            return { key: y, value: d[y], tabindex: i + 1 };
        });
    }).enter()
        .append("rect")
        .attr("id", "bar1")
        .attr("x", function (d) {
            return x1(d.key);
        }).attr("y", function (d) {
            return _.isUndefined(d.value) ? y(0) : y(+d.value);
        }).attr("width", x1.bandwidth()).attr("height", function (d) {
            return _.isUndefined(d.value) ? height - y(0) : height - y(+d.value);
        }).attr("fill", function (d) {
            return z(d.key);
        }).on("mousedown", function () {
            // mEvent = true;
        }).on("focus", function (d) {
            // if (mEvent) {
            //     mEvent = false;
            // } else {
            //     oscillator.frequency.value = hz(d.value);
            //     oscillator.connect(context.destination);
            //     setTimeout(function () {
            //         oscillator.disconnect(context.destination);
            //     }, 100);
            // }
        });

    g.append("g").attr("class", "xaxis").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x0));

    g.append("g").attr("class", "yaxis").call(d3.axisLeft(y).tickFormat(formatPercent).ticks(null, "s")).append("text").attr("x", 2).attr("y", function () {
        return y(y.ticks().pop()) + 0.5;
    }).attr("dy", "0.32em").attr("fill", "#000").attr("font-weight", "bold").attr("text-anchor", "start");

    dispatch.on("update_chart", function (update_data) {


            let selectedDeptArray = [];
            let selObj = document.getElementById('sel_dept');
            let i;
            let count = 0;
            for (i=0; i<selObj.options.length; i++) {
                if (selObj.options[i].selected) {
                    selectedDeptArray[count] = selObj.options[i].value;
                    count++;
                }
            }

        let new_deptx = selectedDeptArray;

        x0.domain(_.pluck(update_data, 'Answer'));

        y.domain([0, d3.max(update_data, function (d) {
            return d3.max(new_deptx, function (d2) {
                return d[d2];
            });
        })]).nice();

        d3.select(".yaxis").transition(750).call(d3.axisLeft(y).tickFormat(formatPercent).ticks(null, "s"));

        d3.select(".xaxis").transition(750).call(d3.axisBottom(x0).ticks(null, "s"));

        x1.domain(new_deptx).rangeRound([0, x0.bandwidth()]);

        let old_g = d3.select("#chart_g").selectAll("#rect_g").data(update_data);

        old_g.exit().remove();

        let new_g = old_g.enter().append("g")
            .attr("id",'rect_g')
            .attr("transform", function (d) {
            return "translate(" + x0(d.Answer) + ",0)";
            });

        let old_bar = old_g.merge(new_g).attr("transform", function (d) {
            return "translate(" + x0(d.Answer) + ",0)";
        }).selectAll("rect")
            .attr("id", "bar2")
            .data(function (d, i) {
            return _.map(new_deptx, function (state, j) {
                return { key: state, value: d[state], tabindex: new_deptx.length * i + j + 1 };
            });
        });

        old_bar.exit().remove();

        old_bar.on("mousedown", function () {
            // mEvent = true;
        }).on("focus", function (d) {
            // if (mEvent) {
            //     mEvent = false;
            // } else {
            //     oscillator.frequency.value = hz(d.value);
            //     oscillator.connect(context.destination);
            //     setTimeout(function () {
            //         oscillator.disconnect(context.destination);
            //     }, 100);
            // }
        }).transition(750)
            .attr("id", "bar3")
            .attr("x", function (d) {
            return x1(d.key);
            }).attr("y", function (d) {
                return _.isUndefined(d.value) ? y(0) : y(d.value);
            }).attr("width", function () {
                return x1.bandwidth();
            }).attr("height", function (d) {
                return _.isUndefined(d.value) ? height - y(0) : height - y(d.value);
            }).attr("fill", function (d) {
                return z(d.key);
            });

        old_bar.enter().append("rect")
            .attr("id", "bar4")
            .on("mousedown", function () {
            // mEvent = true;
        }).on("focus", function (d) {
            // if (mEvent) {
            //     mEvent = false;
            // } else {
            //     oscillator.frequency.value = hz(d.value);
            //     oscillator.connect(context.destination);
            //     setTimeout(function () {
            //         oscillator.disconnect(context.destination);
            //     }, 100);
            // }
        }).transition(750)
            .attr("x", function (d) {
            return x1(d.key);
        }).attr("y", function (d) {
            return _.isUndefined(d.value) ? y(0) : y(d.value);
        }).attr("width", function () {
            return x1.bandwidth();
        }).attr("height", function (d) {
            return _.isUndefined(d.value) ? height - y(0) : height - y(d.value);
        }).attr("fill", function (d) {
            return z(d.key);
        });
    });
});