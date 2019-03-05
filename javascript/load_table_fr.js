"use strict";

function _toConsumableArray(arr) {
    let i;
    let arr2;
    if (Array.isArray(arr)) {
        for ( i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; }
    else { return Array.from(arr);
    }
}

dispatch.on("load_table", function (tbl_data) {


    let filt_SOS_data = _.filter(tbl_data, function (row) {
        return _.contains(start_dept, row.DEPT) && _.contains(start_Q, row.Question) && _.contains(start_fol, row.FOL) && _.contains(start_reg, row.Region);
    });


    let temp_answer_keys = _.uniq(_.flatten(_.pluck(filt_SOS_data, 'answer_keys')));

    let new_answer_keys = _.sortBy(temp_answer_keys, function(element){

        let rank = _.uniq(_.flatten(_.pluck(filt_SOS_data, 'sorted_keys')));
        return rank[element];

    });

    let columns = ["Séries","DEPT"].concat(_toConsumableArray(new_answer_keys));


    let table = d3.select("#table_div")
                    .append('table')
                    .attr("id", "adv_tbl")
                    .attr("class", "table table-striped table-hover");

    $(document).ready( function () {
        $('#adv_tbl').DataTable({
            "paging": false,
            "searching": false,
            "bInfo" : false
        });
    } );

    table.append("caption").text("Sondage sur la dotation et l’impartialité politique - Résultats");

    let thead = table.append('thead');
    let tbody = table.append('tbody');

    thead.append('tr')
        .attr("class", "active")
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .attr("scope","col")
        .text(function (label) {
            return label === "DEPT" ? "Organisation" : label;
        });

    let rows_grp = tbody.selectAll('tr').data(filt_SOS_data);
    // .data(filt_SOS_data);


    let rows_grp_enter = rows_grp.enter().append('tr');

    rows_grp_enter.merge(rows_grp);

    rows_grp_enter.selectAll('td').data(function (row) {
        return columns.map(function (column) {
            return { column: column, value: row[column], dept: row.DEPT };
        });
    }).enter().append('td')
        .attr("scope",function (d,i) {
            return i === 0 ? "row" : undefined;
        })
        .html(function (d) {
        if (d.column === "Séries") {
            return '<svg width="20" height="20"><title>Couleur - série</title><desc>'+ d.dept + '</desc><rect width="20" height="20"  fill="' + z(d.dept) + '"/> </svg>';
              } else {
            return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
        }
    });

    dispatch.on("update_table", function (d) {

        $('#adv_tbl').DataTable().destroy(); 

        let temp_answer_keys = _.uniq(_.flatten(_.pluck(d, 'answer_keys')));

        let answer_keys_2 = _.sortBy(temp_answer_keys, function(element){
            let rank = _.uniq(_.flatten(_.pluck(d, 'sorted_keys')));
            return rank[element];
        });

        let new_columns = ["Séries","DEPT"].concat(_toConsumableArray(answer_keys_2));

        let table_u = d3.select('table');

        let tbody_u = table_u.select('tbody');

        let thead_u = table_u.select('thead').select('tr');

        let thead_u_th = thead_u.selectAll('th').data(new_columns);

        thead_u_th.exit().remove();

        let thead_u_th_enter = thead_u_th.enter().append('th');

        thead_u_th.merge(thead_u_th_enter).text(function (label) {
            return label === "DEPT" ? "Organisation" : label;
        });

        let rows_grp_u = tbody_u.selectAll('tr').data(d);

        rows_grp_u.exit().remove();

        let rows_grp_enter_u = rows_grp_u.enter().append('tr');

        let new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row) {
            return new_columns.map(function (column) {
                return { column: column, value: row[column], dept: row.DEPT };
            });
        });
        new_tds.exit().remove();

        new_tds
            .attr("scope",function (d,i) {
                return i === 0 ? "row" : undefined;
            })
            .html(function (d) {
                if (d.column === "Séries") {
                    return '<svg width="20" height="20"><title>Couleur - série</title><desc>'+ d.dept + '</desc><rect width="20" height="20"  fill="' + z(d.dept) + '"/> </svg>';
                } else {
                    return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
                }
            });

        new_tds.enter().append('td')
            .attr("scope",function (d,i) {
                return i === 0 ? "row" : undefined;
            })
            .html(function (d) {
                if (d.column === "Séries") {
                    return '<svg width="20" height="20"><title>Couleur - série</title><desc>'+ d.dept + '</desc><rect width="20" height="20"  fill="' + z(d.dept) + '"/> </svg>';
                } else {
                    return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
                }
            });
            
        $('#adv_tbl').DataTable({
                "paging": false,
                "searching": false,
                "bInfo" : false
        });   
    });
});
