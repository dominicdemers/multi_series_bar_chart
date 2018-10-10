"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

dispatch.on("load_table", function (tbl_data) {

    var filt_SOS_data = _.filter(tbl_data, function (row) {
        return _.contains(start_dept, row.DEPT) && _.contains(start_Q, row.Question) && _.contains(start_fol, row.FOL) && _.contains(start_reg, row.Region);
    });

    var new_answer_keys = _.uniq(_.flatten(_.pluck(filt_SOS_data, 'answer_keys')));

    var columns = ["DEPT", "Series"].concat(_toConsumableArray(new_answer_keys));

    var table = d3.select("#table_div")
                    .append('table')
                    .attr("id", "adv_tbl")
                    .attr("class", "table table-condensed");

    var thead = table.append('thead');
    var tbody = table.append('tbody');

    thead
        .append('tr')
        .attr("class", "active")
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (label) {
            return label === "DEPT" ? "" : label;
        });

    var rows_grp = tbody.selectAll('tr').data(filt_SOS_data);
    // .data(filt_SOS_data);


    var rows_grp_enter = rows_grp.enter().append('tr');

    rows_grp_enter.merge(rows_grp);

    rows_grp_enter.selectAll('td').data(function (row) {
        return columns.map(function (column) {
            return { column: column, value: row[column], dept: row.DEPT };
        });
    }).enter().append('td').html(function (d) {
        if (d.column === "Series") {
            return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';
        } else {
            return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
        }
    });

    dispatch.on("update_table", function (d) {

        var answer_keys_2 = _.uniq(_.flatten(_.pluck(d, 'answer_keys')));

        var new_columns = ["DEPT", "Series"].concat(_toConsumableArray(answer_keys_2));

        var table_u = d3.select('table');

        var tbody_u = table_u.select('tbody');

        var thead_u = table_u.select('thead').select('tr');

        var thead_u_th = thead_u.selectAll('th').data(new_columns);

        thead_u_th.exit().remove();

        var thead_u_th_enter = thead_u_th.enter().append('th');

        thead_u_th.merge(thead_u_th_enter).text(function (label) {
            return label === "DEPT" ? "" : label;
        });

        var rows_grp_u = tbody_u.selectAll('tr').data(d);

        rows_grp_u.exit().remove();

        var rows_grp_enter_u = rows_grp_u.enter().append('tr');

        var new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row) {
            return new_columns.map(function (column) {
                return { column: column, value: row[column], dept: row.DEPT };
            });
        });
        new_tds.exit().remove();

        new_tds.html(function (d) {

            if (d.column === "Series") {
                return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';
            } else {
                return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
            }
        });

        new_tds.enter().append('td').html(function (d) {

            if (d.column === "Series") {
                return '<svg width="20" height="20"><rect width="20" height="20"  fill="' + z(d.dept) + '"/></svg>';
            } else {
                return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
            }
        });
    });
});
