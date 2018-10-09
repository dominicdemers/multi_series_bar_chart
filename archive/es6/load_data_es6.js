
var dispatch = d3.dispatch("load_choice", "load_table", "update_table", "load_chart", "update_chart");


var start_dept = ["All organisations"];
var start_reg = ["All regions"];
var start_fol = ["All official languages"];
var start_Q = ["ADV_05_e"];
var start_label = ["How long been a staffing advisor in federal public service"];
var start_cat = ["Staffing advisors"];

var fmt_pct = d3.format(".1%");
var formatPercent = d3.format(".0%");

var context = new (window.AudioContext || window.webkitAudioContext)();
var oscillator = context.createOscillator();
oscillator.start();

var z = d3.scaleOrdinal(d3.schemeCategory20);

function test_func(error, var_info, sos_tbl_data) {


    var context = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = context.createOscillator();
    oscillator.start();

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
            // Label: group[0].final_label_en,
            answer_keys : ans_keys
        });
        return newObj;
    });


    dispatch.call("load_choice", undefined, new_table_data, sos_graph_data, var_info);
    dispatch.call("load_table", undefined, new_table_data);
    dispatch.call("load_chart", undefined, sos_graph_data);

}
function init() {

    d3.queue()
        .defer(d3.csv, 'csv/VARIABLES_FOR_D3.csv')
        .defer(d3.csv, 'csv/SNPS_FINAL_EN.csv')
        .await(test_func);//only function name is needed
}

init()

