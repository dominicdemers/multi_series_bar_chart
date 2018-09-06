

var z = d3.scaleOrdinal(d3.schemeCategory20);

var dispatch = d3.dispatch("load_choice", "load_table", "update_table", "load_chart", "update_chart");

var start_dept = ["All organisations"];
var start_reg = ["All regions"];
var start_fol = ["All official languages"];
var start_Q = ["ALL_05A_e"];
var start_label = ["ALL: Extent agree: Staffing activities transparent (ALL_05A_e )"];
var fmt_pct = d3.format(".1%");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var context = new (window.AudioContext || window.webkitAudioContext)();
var oscillator = context.createOscillator();
oscillator.start();

var formatPercent = d3.format(".0%");
var formatThousand = d3.format(",");

// function test_func(error, temp1, temp2) {
//     console.log(temp1)
//     console.log(temp2)
//     debugger;
// }
// function init() {
//
//     d3.queue()
//         .defer(d3.csv, 'csv/raw_data.csv')
//         .defer(d3.csv, 'csv/SNPS_2018.csv')
//         .await(test_func);//only function name is needed
// }
//
// init()


function test_func(error, temp1, temp2) {
    console.log(temp1)
    console.log(temp2)
    debugger;
}
function init() {

    d3.queue()
        .defer(d3.csv, 'csv/raw_data.csv')
        .defer(d3.csv, 'csv/SNPS_FINAL_EN.csv')
        .await(test_func);//only function name is needed
}

init()


d3.csv("csv/SNPS_FINAL_EN.csv")
    .row(function(i) {
        i.total_respondants = +i.total_respondants;
        i.total_w_resp = +i.total_w_resp;
        i.shr_w_resp = +i.shr_w_resp;
        return i;
    })
    .get(function(error, rows) {

        sos_tbl_data = rows;// Now you can assign it

        let sos_graph_data = _.chain(sos_tbl_data)
            .groupBy('FOL_e')
            .mapObject(fol => _.groupBy(fol, 'Region_e'))
            .mapObject(fol => _.mapObject(fol, reg => _.groupBy(reg, 'question_name')))
            .value();

        var groups = _.groupBy(sos_tbl_data, function(value){
            return value.FOL_e + '#' + value.Region_e +  '#' + value.question_name + '#' + value.final_dept_e ;
        });


        var new_table_data = _.map(groups, function(group){

            var mapped =_.map(group, ans =>
                ({
                    [ans.question_value]: ans.shr_w_resp
                })
            );

            var ans_keys = _.uniq(_.map(group, function(key){ return key.question_value; }));

            var newObj =  Object.assign({}, ...mapped, {
                Region: group[0].Region_e,
                DEPT: group[0].final_dept_e,
                FOL: group[0].FOL_e,
                Question: group[0].question_name,
                Label: group[0].final_label_en,
                answer_keys : ans_keys
               });
            return newObj;
        });

        dispatch.call("load_choice", undefined, new_table_data, sos_graph_data);
        dispatch.call("load_table", undefined, new_table_data);
        dispatch.call("load_chart", undefined, sos_graph_data);

    });