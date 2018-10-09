dispatch.on("load_choice", function (load_data, sos_graph_data, question_info) {

    const drop_box = function drop_box(id_name, variable, start_val) {

        if (variable === "Question") {

                    let question_infox = _.where(question_info, {label_en: start_val[0]})[0].variable_cat_en;
                    let questions_for_cat = _.where(question_info, {variable_cat_en: question_infox});

                    var select_list = _.uniq(_.pluck(questions_for_cat, "label_en")).sort();
        }
        else if (variable === "Category") {
            var select_list = _.uniq(_.pluck(question_info, "variable_cat_en")).sort();
        }
        else {

            var select_list = _.without(_.uniq(_.pluck(load_data, variable)),
                'All organisations',
                'Large (>= 2, 000)',
                'Medium (500 to 1,999)',
                'Small (100 to 499)',
                'Very small (<100)',
                'Not stated').sort();
        }

        if (variable === "DEPT") {
            select_list.splice(0, 0,
                'All organisations',
                'Large (>= 2, 000)',
                'Medium (500 to 1,999)',
                'Small (100 to 499)',
                'Very small (<100)',
                'Not stated'
            );
        }


        const sel_var = d3.select(id_name).selectAll("option").data(select_list);

        sel_var.exit().remove();

        const sel_dept_enter = sel_var.enter().append("option");

        sel_dept_enter.merge(sel_var).attr("value", function (d) {
            return d;
        }).text(function (d) {
            return d;
        });


        d3.select(id_name).property("value", start_val).on("change", function () {

            const current_depts = _.map(d3.select("#sel_dept").property("selectedOptions"), function (x) {
                return x.value;
            });

           if(this.id ==="sel_cat"){

                var current_cat = d3.select("#sel_cat").property("value");

                var current_label = _.filter(question_info, function (row) {
                    return current_cat.includes(row.variable_cat_en);
                })[0]["label_en"];

                var current_q_num = _.filter(question_info, function (row) {
                    return current_cat.includes(row.variable_cat_en);
                })[0]["var_name_e"];


                var current_question = _.uniq(_.pluck(_.filter(load_data, function (row) {
                    return current_q_num.includes(row.Question);
                }),"Question"))[0];

                drop_box("#sel_question", "Question", [current_label]);

            }
            else {

                var current_label = d3.select("#sel_question").property("value");

                var current_q_num = _.filter(question_info, function (row) {
                    return current_label.includes(row.label_en);
                })[0]["var_name_e"];

                var current_question = _.uniq(_.pluck(_.filter(load_data, function (row) {
                    return current_q_num.includes(row.Question);
                }),"Question"))[0];
            }

            var current_fol = d3.select("#sel_fol").property("value");
            var current_reg = d3.select("#sel_reg").property("value");

            var new_TBL_data = _.filter(load_data, function (row) {
                   return current_depts.includes(row.DEPT) && current_question.includes(row.Question) && current_fol.includes(row.FOL)  && current_reg.includes(row.Region);
            });


             var new_graph_data_1 = _.groupBy(_.filter(sos_graph_data[current_fol][current_reg][current_question], function (answer) {
                    return current_depts.includes(answer.final_dept_e);
            }), 'question_value');


            var new_graph_data = _.map(new_graph_data_1, function(value){

                var mapped =_.map(value, dept =>
                    ({
                        [dept.final_dept_e]: dept.shr_w_resp
                    })
                );

                var newObj =  Object.assign({}, ...mapped, {
                    Answer: value[0].question_value
                });

                return newObj;
            });

            var current_q_long = _.filter(question_info, function (row) {
                   return current_question.includes(row.var_name_e);
            })[0]["full_variable_question"];

            d3.select("#quest_div").text(current_q_long);

            dispatch.call("update_table", this, new_TBL_data);
            dispatch.call("update_chart", this, new_graph_data);
        });
    };


    var start_q_long = _.filter(question_info, function (row) {
                            return start_label.includes(row.label_en);
                        })[0]["full_variable_question"];

    d3.select("#quest_div").text(start_q_long);
    drop_box("#sel_cat", "Category", start_cat);
    drop_box("#sel_dept", "DEPT", start_dept);
    drop_box("#sel_question", "Question", start_label);
    drop_box("#sel_fol", "FOL", start_fol);
    drop_box("#sel_reg", "Region", start_reg);

});
