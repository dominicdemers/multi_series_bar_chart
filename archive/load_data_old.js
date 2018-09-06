
var col_labels = ["Department", "Total", "Not at all", "To a minimal extent", "To a moderate extent", "To a great extent", "Series"];

var answer_labels = {
    "shr_To_a_minimal_extent": "To a minimal extent",
    "shr_Not_at_all": "Not at all",
    "shr_To_a_moderate_extent": "To a moderate extent",
    "shr_To_a_great_extent": "To a great extent"
};

var dispatch = d3.dispatch("load_choice", "load_table", "update_table", "load_chart", "update_chart");

var start_dept = ["Employment and Social Development Canada"];
var start_tenure = ["Term"];
var start_Q = ["Staffing activities are carried out in a transparent way"];

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var context = new (window.AudioContext || window.webkitAudioContext)();
var oscillator = context.createOscillator();
oscillator.start();

var formatPercent = d3.format(".0%");
var formatThousand = d3.format(",");

d3.csv("csv/raw_data.csv")
    .row(function(i) {

        var f = d3.format(".0%");
        var g = d3.format(".0f");

        i.shr_Not_at_all = +i.shr_Not_at_all/100;
        i.shr_To_a_minimal_extent = +i.shr_To_a_minimal_extent/100;
        i.shr_To_a_moderate_extent = +i.shr_To_a_moderate_extent/100;
        i.shr_To_a_great_extent = +i.shr_To_a_great_extent/100;

        i.total = g(+i.total);


        return i;
    })
    .get(function(error, rows) {

        sos_tbl_data = rows;// Now you can assign it
        //
        var columns = _.without(sos_tbl_data.columns, "question", "tenure");
        columns.push("Series");
        var answer_keys = _.without(sos_tbl_data.columns, "question", "tenure", "dept", "total");
        var tenure_keys = _.uniq(_.pluck(sos_tbl_data, "tenure"));
        var question_keys = _.uniq(_.pluck(sos_tbl_data, "question"));
        var dept_keys = _.without(_.uniq(_.pluck(sos_tbl_data, "dept")), 'Public Service Total').sort();
        dept_keys.splice(0, 0, 'Public Service Total');


        var sos_graph_data = Object.assign.apply(Object, [{}].concat(_toConsumableArray(tenure_keys.map(function (g_key) {
            return _defineProperty({}, g_key, Object.assign.apply(Object, [{}].concat(_toConsumableArray(question_keys.map(function (q_key) {
                return _defineProperty({}, q_key, Object.assign.apply(Object, [{}].concat(_toConsumableArray(answer_keys.map(function (a_key) {
                    return _defineProperty({}, a_key, _.map(dept_keys, function (d_key) {

                        var filt_data = _.filter(sos_tbl_data, function (row, i) {
                            return [q_key].includes(row.question) && [g_key].includes(row.tenure);
                        });

                        var temp_shr = _.pluck(_.where(filt_data, { dept: d_key }), a_key);

                        return _defineProperty({}, d_key, temp_shr[0]);
                    }));
                })))));
            })))));
        }))));

        // var new_table_data = _.flatten(_.map(dept_keys, function (dobj) {
        //     return _.map(fol_keys, function (fobj) {
        //         return _.map(reg_keys, function (robj) {
        //             return _.map(question_keys, function (qobj) {
        //
        //                 var answer_data = _.filter(sos_tbl_data, function (row, i) {
        //                     return dobj.includes(row.DEPT) && fobj.includes(row.FOL) && robj.includes(row.Region) && qobj.includes(row.Question);
        //                 });
        //
        //                 var mapped =_.map(answer_data, item =>
        //                     ({
        //                         [item.Answer]: item.WTPS_Sum
        //                     })
        //                 );
        //
        //                 var newObj =  Object.assign({}, ...mapped, {
        //                     DEPT: dobj,
        //                     FOL: fobj,
        //                     Question: qobj,
        //                     Region: robj
        //                 });
        //
        //                 return newObj;
        //             });
        //         });
        //     });
        // }));


        debugger;
        dispatch.call("load_choice", undefined, sos_tbl_data, sos_graph_data);
        dispatch.call("load_table", undefined, sos_tbl_data);
        // dispatch.call("load_chart", undefined, sos_graph_data);

    });