"use strict";

function _toConsumableArray(arr) {
    let i;
    let arr2;
    if (Array.isArray(arr)) {
        for (i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }
    else {
        return Array.from(arr);
    }
}

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

dispatch.on("load_choice", function (load_data, sos_graph_data, question_info) {

    let drop_box = function drop_box(id_name, variable, start_val) {

        let select_list;

        if (variable === "Question") {

            let question_infox = _.where(question_info, { label_fr: start_val[0] })[0].variable_cat_fr;
            let questions_for_cat = _.where(question_info, { variable_cat_fr: question_infox });

            select_list = _.uniq(_.pluck(questions_for_cat, "label_fr")).sort();
        } else if (variable === "Category") {
            select_list = _.uniq(_.pluck(question_info, "variable_cat_fr")).sort();
        } else {

            select_list = _.without(_.uniq(_.pluck(load_data, variable)), 'Toutes les organisations', 'Grande (>= 2 000)', 'Moyenne (500 à 1 999)', 'Petite (100 à 499)', 'Très petite (< 100)').sort();
        }

        if (variable === "DEPT") {
            select_list.splice(0, 0, 'Toutes les organisations', 'Grande (>= 2 000)', 'Moyenne (500 à 1 999)', 'Petite (100 à 499)', 'Très petite (< 100)');
        }

        let sel_var = d3.select(id_name).selectAll("option").data(select_list);

        sel_var.exit().remove();

        let sel_dept_enter = sel_var.enter().append("option");

        sel_dept_enter.merge(sel_var).attr("value", function (d) {
            return d;
        }).text(function (d) {
            return d;
        });

        d3.select(id_name).property("value", start_val).on("change", function () {

            // var current_depts = _.map(d3.select("#sel_dept").property("selectedOptions"), function (x) {
            //     return x.value;
            // });

            let selectedDeptArray = [];
            let selObj = document.getElementById('sel_dept');
            let i;
            let current_question;
            let count = 0;
            for (i=0; i<selObj.options.length; i++) {
                if (selObj.options[i].selected) {
                    selectedDeptArray[count] = selObj.options[i].value;
                    count++;
                }
            }

            let current_depts = selectedDeptArray;

            if (this.id === "sel_cat") {

                let current_cat = d3.select("#sel_cat").property("value");

                let current_label = _.filter(question_info, function (row) {
                    return _.contains([current_cat], row.variable_cat_fr);
                })[0]["label_fr"];

                let current_q_num = _.filter(question_info, function (row) {
                    return _.contains([current_cat], row.variable_cat_fr);
                })[0]["var_name_f"];

                current_question = _.uniq(_.pluck(_.filter(load_data, function (row) {
                    return _.contains([current_q_num], row.Question);
                }), "Question"))[0];

                drop_box("#sel_question", "Question", [current_label]);
            } else {

                let current_label = d3.select("#sel_question").property("value");

                let current_q_num = _.filter(question_info, function (row) {
                    return _.contains([current_label], row.label_fr);
                })[0]["var_name_f"];

                current_question = _.uniq(_.pluck(_.filter(load_data, function (row) {
                    return _.contains([current_q_num], row.Question);
                }), "Question"))[0];
            }

            let current_fol = d3.select("#sel_fol").property("value");
            let current_reg = d3.select("#sel_reg").property("value");

            let new_TBL_data = _.filter(load_data, function (row) {
                return _.contains(current_depts, row.DEPT) && _.contains([current_question], row.Question) && _.contains([current_fol], row.FOL) && _.contains([current_reg], row.Region);
            });


            if(new_TBL_data.length == 0) {
                d3.select("#no_response")
                  .style("display","block");
                d3.select("#table_div")
                  .style("display","none");
                d3.select("#no_response_msg")
                  .text("Aucun résultats de sondage trouvés correspondants aux filtres sélectionnés.");
            } else {
                d3.select("#table_div")
                  .style("display","block");
                d3.select("#no_response")
                  .style("display","none");

                if (current_depts.length > 1){
                
                    let available_depts = [];

                    for (i = 0; i < new_TBL_data.length ; i++) {
                        if (!_.contains(available_depts, new_TBL_data[i].DEPT)) {
                            available_depts.push(new_TBL_data[i].DEPT);
                        }
                    }
                    let nodata_depts = _.difference(current_depts, available_depts);

                    if (nodata_depts.length > 0) {
                        d3.select("#no_response")
                          .style("display","block");
                        d3.select("#no_response_msg")
                          .text("Les organisations suivantes n'ont pas de résultats correspondants aux filtres sélectionnés: " + nodata_depts);
                    }
                } 
            }
            
            if (current_depts.length > 1) {

                let available_depts = [];

                for (i = 0; i < new_TBL_data.length ; i++) {
                    if (!_.contains(available_depts, new_TBL_data[i].DEPT)) {
                        available_depts.push(new_TBL_data[i].DEPT);
                    }
                }
                let nodata_depts = _.difference(current_depts, available_depts);

                if (nodata_depts.length > 0) {
                    d3.select("#no_response")
                      .style("display","block");
                }
            }

            let new_graph_data_1 = _.groupBy(_.filter(sos_graph_data[current_fol][current_reg][current_question], function (answer) {
                return _.contains(current_depts, answer.final_dept_f);
            }), 'question_value');


            let new_graph_data = _.map(new_graph_data_1, function (value) {

                let mapped = _.map(value, function (dept) {
                    return _defineProperty({}, dept.final_dept_f, dept.shr_w_resp);
                });

                let tempx1 =  _.extend.apply(null, mapped);
                return _.extend(tempx1 , {
                    Answer: value[0].question_value,
                    Sorter: value[0].sorter
                })

                //return newObj;
            });

            let current_q_long = _.filter(question_info, function (row) {
                return _.contains([current_question], row.var_name_f);
            })[0]["full_variable_question_fr"];

            d3.select("#quest_div").text(current_q_long);


            dispatch.call("update_table", this, new_TBL_data);
            dispatch.call("update_chart", this, new_graph_data);
        });
    };

    let start_q_long = _.filter(question_info, function (row) {
        return _.contains(start_label, row.label_fr);
    })[0]["full_variable_question_fr"];

    d3.select("#quest_div").text(start_q_long);
    drop_box("#sel_cat", "Category", start_cat);
    drop_box("#sel_dept", "DEPT", start_dept);
    drop_box("#sel_question", "Question", start_label);
    drop_box("#sel_fol", "FOL", start_fol);
    drop_box("#sel_reg", "Region", start_reg);

});