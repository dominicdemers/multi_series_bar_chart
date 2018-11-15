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

let dispatch = d3.dispatch("load_choice", "load_table", "update_table", "load_chart", "update_chart");

let start_dept = ["Toutes les organisations"];
let start_reg = ["Toutes les régions"];
let start_fol = ["Toutes les langues officielles"];
let start_Q = ["ADV_05_f"];
let start_label = ["Depuis combien temps travaillez-vous conseiller en dotation FPF (ADV_05)"];
let start_cat = ["Conseiller en dotation"];

let fmt_pct = d3.format(".1%");
let formatPercent = d3.format(".0%");

    // if (typeof window.AudioContext !== "undefined") {
    //
    //     var context = new window.AudioContext;
    //     var oscillator = context.createOscillator();
    //     oscillator.start();
    //
    //  } else if (typeof window.webkitAudioContext !== "undefined") {
    //     var context =  new window.webkitAudioContext;
    //     var oscillator = context.createOscillator();
    //     oscillator.start();
    // } else {
    //
    // }

let z = d3.scaleOrdinal(d3.schemeCategory20);

function test_func(error, var_info, sos_tbl_data) {

    // if (typeof window.AudioContext !== "undefined") {
    //
    //     var context = new window.AudioContext;
    //     var oscillator = context.createOscillator();
    //     oscillator.start();
    //
    // } else if (typeof window.webkitAudioContext !== "undefined") {
    //     var context = new window.webkitAudioContext;
    //     var oscillator = context.createOscillator();
    //     oscillator.start();
    // } else {
    //
    // }

    if (error){
        console.log("Error on data load");
    }

    let sos_graph_data = _.chain(sos_tbl_data).groupBy('FOL_f').mapObject(function (fol) {
        return _.groupBy(fol, 'Region_f');
    }).mapObject(function (fol) {
        return _.mapObject(fol, function (reg) {
            return _.groupBy(reg, 'question_name');
        });
    }).value();

    let groups = _.groupBy(sos_tbl_data, function (value) {
        return value.FOL_f + '#' + value.Region_f + '#' + value.question_name + '#' + value.final_dept_f;
    });

    let new_table_data = _.map(groups, function (group) {

        let mapped = _.map(group, function (ans) {
            return _defineProperty({}, ans.question_value, ans.shr_w_resp);
        });


        let ans_keys = _.uniq(_.map(group, function (key) {
            return key.question_value;
        }));


        let newObj2 =  _.extend.apply(null, mapped);

        return _.extend(newObj2, {
            Region: group[0].Region_f,
            DEPT: group[0].final_dept_f,
            FOL: group[0].FOL_f,
            Question: group[0].question_name,
            answer_keys : ans_keys
        });


        //return newObj3;
    });

    dispatch.call("load_choice", undefined, new_table_data, sos_graph_data, var_info);
    dispatch.call("load_table", undefined, new_table_data);
    dispatch.call("load_chart", undefined, sos_graph_data);

}
function init() {
    d3.queue()
        .defer(d3.csv, 'csv/VARIABLES_FOR_D3.csv')
        .defer(d3.csv, 'csv/SNPS_FINAL_FR.csv')
        .await(test_func); //only function name is needed
}

init();
