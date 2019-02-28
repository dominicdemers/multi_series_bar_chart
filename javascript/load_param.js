// File to load text parameters in the program
//This is here that the code will detect if we are on the french or english page

console.log("Language of Page:")
console.log(document.documentElement.lang)


// load data:

//     let start_dept = ["All organisations"];
//     let start_reg = ["All regions"];
//     let start_fol = ["All official languages"];
//     let start_Q = ["ADV_05_e"];
//     let start_label = ["How long been a staffing advisor in federal public service (ADV_05)"];
//     let start_cat = ["Staffing advisors"];
//
//
// let sos_graph_data = _.chain(sos_tbl_data).groupBy('FOL_e').mapObject(function (fol) {
//     return _.groupBy(fol, 'Region_e');
// }).mapObject(function (fol) {
//     return _.mapObject(fol, function (reg) {
//         return _.groupBy(reg, 'question_name');
//     });
// }).value();
//
//
// return _.extend(newObj2, {
//     Region: group[0].Region_e,
//     DEPT: group[0].final_dept_e,
//     FOL: group[0].FOL_e,
//     Question: group[0].question_name,
//     answer_keys : ans_keys,
//     sorted_keys : sorted_keys
// });
//
// }
// function init() {
//     d3.queue()
//         .defer(d3.csv, 'csv/VARIABLES_FOR_D3.csv')
//         .defer(d3.csv, 'csv/SNPS_FINAL_EN.csv')
//         .await(test_func); //only function name is needed
// }

// load_choice:
// let question_infox = _.where(question_info, { label_en: start_val[0] })[0].variable_cat_en;
// let questions_for_cat = _.where(question_info, { variable_cat_en: question_infox });
//
// select_list = _.uniq(_.pluck(questions_for_cat, "label_en")).sort();
// } else if (variable === "Category") {
//     select_list = _.uniq(_.pluck(question_info, "variable_cat_en")).sort();
// } else {
//
//     select_list = _.without(_.uniq(_.pluck(load_data, variable)), 'All organisations', 'Large (>= 2, 000)', 'Medium (500 to 1,999)', 'Small (100 to 499)', 'Very small (<100)' ).sort();
// }
//
// if (variable === "DEPT") {
//     select_list.splice(0, 0, 'All organisations', 'Large (>= 2, 000)', 'Medium (500 to 1,999)', 'Small (100 to 499)', 'Very small (<100)');
// }

// let current_label = _.filter(question_info, function (row) {
//     return _.contains([current_cat], row.variable_cat_en);
// })[0]["label_en"];
//
// let current_q_num = _.filter(question_info, function (row) {
//     return _.contains([current_cat], row.variable_cat_en);
// })[0]["var_name_e"];
//
// current_question = _.uniq(_.pluck(_.filter(load_data, function (row) {
//     return _.contains([current_q_num], row.Question);
// }), "Question"))[0];
//
// drop_box("#sel_question", "Question", [current_label]);

// } else {
//
//     let current_label = d3.select("#sel_question").property("value");
//
//     let current_q_num = _.filter(question_info, function (row) {
//         return _.contains([current_label], row.label_en);
//     })[0]["var_name_e"];
//
//
//     if(new_TBL_data.length == 0) {
//         d3.select("#no_response")
//             .style("display","block");
//         d3.select("#table_div")
//             .style("display","none");
//         d3.select("#no_response_msg")
//             .text("There is no survey data matching the selected filters.");
//
//     .text("The following selected oganizations have no matching data from the selected filters: " + nodata_depts);
//
//         let new_chart_data_1 = _.groupBy(_.filter(chart_data[start_fol][start_reg][start_Q], function (answer) {
//             return _.contains(new_depts, answer.final_dept_e);
//         }), 'question_value');
//
//
//         let mapped = _.map(value, function (dept) {
//             return _defineProperty({}, dept.final_dept_e, dept.shr_w_resp);
//         });
//
//
//         // Loat table:
//         table.append("caption").text("Staffing and Non-Partisanship Survey - Results");