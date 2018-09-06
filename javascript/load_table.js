dispatch.on("load_table", function (tbl_data, columns) {

    // var columns = _.without(sos_tbl_data.columns, "question", "tenure");

    // var answer_keys = _.uniq(_.pluck(tbl_data, "Answer"));
    // var new_dept_keys = _.uniq(_.pluck(tbl_data, "DEPT"));
    // var new_fol_keys = _.uniq(_.pluck(tbl_data, "FOL"));
    // var new_reg_keys = _.uniq(_.pluck(tbl_data, "Region"));
    // var new_question_keys = _.uniq(_.pluck(tbl_data, "Question"));


    var filt_SOS_data = _.filter(tbl_data, function (row, i) {
        return start_dept.includes(row.DEPT) && start_Q.includes(row.Question) && start_fol.includes(row.FOL) && start_reg.includes(row.Region);
    });


    var new_answer_keys = _.uniq(_.flatten(_.pluck(filt_SOS_data, 'answer_keys')))

    var columns = ["DEPT", "Series",...new_answer_keys];

    var table = d3.select("#tbl_div")
            .append('table')
            .attr("id", "adv_tbl")
            .attr("class", "adv_tbl");

    var thead = table.append('thead');
    var tbody = table.append('tbody');

    thead.append('tr').selectAll('th')
            .data(columns)
            .enter()
            .append('th')
            .text(function (label) {
                return (label === "DEPT") ? "" : label;
                });

    var rows_grp = tbody
                    .selectAll('tr')
                    .data(filt_SOS_data);
                    // .data(filt_SOS_data);


    var rows_grp_enter = rows_grp.enter().append('tr');

    rows_grp_enter.merge(rows_grp);

    rows_grp_enter.
                selectAll('td')
                .data(function (row) {
                    return columns.map(function (column) {
                             return { column: column, value: row[column], dept: row.DEPT };
                    });
                }).enter()
                .append('td')
                .html(function (d, i) {
                    if (d.column === "Series") {
                        return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';
                    } else {
                        return isNaN(d.value) ? d.value : d.column === "total" ?  d.value :  fmt_pct(d.value);
                    }
                });

    dispatch.on("update_table", function (d) {

        var answer_keys_2 = _.uniq(_.flatten(_.pluck(d, 'answer_keys')))

        var new_columns = ["DEPT", "Series",...answer_keys_2];

        var table_u = d3.select('table');

        var tbody_u = table_u.select('tbody');

        var thead_u = table_u.select('thead').select('tr');

        var thead_u_th = thead_u.selectAll('th').data(new_columns)

        thead_u_th.exit().remove();

        var thead_u_th_enter = thead_u_th.enter().append('th')

        thead_u_th.merge(thead_u_th_enter)
            .text(function (label) {
                return (label === "DEPT") ? "" : label;
            });

        var rows_grp_u = tbody_u.selectAll('tr').data(d);

        rows_grp_u.exit().remove();

        var rows_grp_enter_u = rows_grp_u.enter().append('tr');

        var new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row, i) {
            return new_columns.map(function (column) {
                return { column: column, value: row[column], dept: row.DEPT };
            });
        });
        new_tds.exit().remove()

        new_tds.html(function (d, i) {

            if (d.column === "Series") {
                  return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';
            } else {
                return isNaN(d.value) ?  d.value : d.column === "total" ?  d.value : fmt_pct(d.value);
            }
        });

        new_tds.enter().append('td').html(function (d) {

            if (d.column === "Series") {
                return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';;
            } else {
                return isNaN(d.value) ?  d.value : d.column === "total" ?  d.value :  fmt_pct(d.value);
            }
        });


    });
});
