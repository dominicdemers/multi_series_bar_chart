dispatch.on("load_table", function (tbl_data) {

    // var columns = _.without(sos_tbl_data.columns, "question", "tenure");

    // var answer_keys = _.uniq(_.pluck(tbl_data, "Answer"));
    // var new_dept_keys = _.uniq(_.pluck(tbl_data, "DEPT"));
    // var new_fol_keys = _.uniq(_.pluck(tbl_data, "FOL"));
    // var new_reg_keys = _.uniq(_.pluck(tbl_data, "Region"));
    // var new_question_keys = _.uniq(_.pluck(tbl_data, "Question"));



    const filt_SOS_data = _.filter(tbl_data, function (row) {
        return start_dept.includes(row.DEPT) && start_Q.includes(row.Question) && start_fol.includes(row.FOL) && start_reg.includes(row.Region);
    });


    const new_answer_keys = _.uniq(_.flatten(_.pluck(filt_SOS_data, 'answer_keys')));

    const columns = ["DEPT", "Series",...new_answer_keys];

    const table = d3.select("#table_div")
        .append('table')
        .attr("id", "adv_tbl")
        .attr("class", "adv_tbl");

    const thead = table.append('thead');
    const tbody = table.append('tbody');

    thead.append('tr').selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (label) {
            return (label === "DEPT") ? "" : label;
        });

    const rows_grp = tbody
        .selectAll('tr')
        .data(filt_SOS_data);
    // .data(filt_SOS_data);


    const rows_grp_enter = rows_grp.enter().append('tr');

    rows_grp_enter.merge(rows_grp);

    rows_grp_enter.
    selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column], dept: row.DEPT };
            });
        }).enter()
        .append('td')
        .html(function (d) {
            if (d.column === "Series") {
                return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';
            } else {
                return isNaN(d.value) ? d.value : d.column === "total" ?  d.value :  fmt_pct(d.value);
            }
        });

    const rows = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];

    debugger;
    let csvContent = "data:text/csv;charset=utf-8,";


    rows.forEach(function(rowArray){
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);

    d3.select("#exp_data")
        .attr("href", encodedUri)
        .attr("download", "my_data.csv")
    ;

    dispatch.on("update_table", function (d) {

        const answer_keys_2 = _.uniq(_.flatten(_.pluck(d, 'answer_keys')));

        const new_columns = ["DEPT", "Series",...answer_keys_2];

        const table_u = d3.select('table');

        const tbody_u = table_u.select('tbody');

        const thead_u = table_u.select('thead').select('tr');

        const thead_u_th = thead_u.selectAll('th').data(new_columns);

        thead_u_th.exit().remove();

        const thead_u_th_enter = thead_u_th.enter().append('th');

        thead_u_th.merge(thead_u_th_enter)
            .text(function (label) {
                return (label === "DEPT") ? "" : label;
            });

        const rows_grp_u = tbody_u.selectAll('tr').data(d);

        rows_grp_u.exit().remove();

        const rows_grp_enter_u = rows_grp_u.enter().append('tr');

        const new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row) {
            return new_columns.map(function (column) {
                return { column: column, value: row[column], dept: row.DEPT };
            });
        });
        new_tds.exit().remove();

        new_tds.html(function (d) {

            if (d.column === "Series") {
                return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';
            } else {
                return isNaN(d.value) ?  d.value : d.column === "total" ?  d.value : fmt_pct(d.value);
            }
        });

        new_tds.enter().append('td').html(function (d) {

            if (d.column === "Series") {
                return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';
            } else {
                return isNaN(d.value) ?  d.value : d.column === "total" ?  d.value :  fmt_pct(d.value);
            }
        });


        // const rows = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
        //
        // let csvContent = "data:text/csv;charset=utf-8,";
        //
        // rows.forEach(function(rowArray){
        //     let row = rowArray.join(",");
        //     csvContent += row + "\r\n";
        // });
        //
        // d3.select("#exp_data")
        //     .attr("href", encodedUri)
        //     .attr("download", "my_data.csv")
        // ;



    });
});
