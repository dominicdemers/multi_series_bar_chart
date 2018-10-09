           const rows = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];

           let csvContent = "data:text/csv;charset=utf-8,";

           rows.forEach(function(rowArray){
               let row = rowArray.join(",");
               csvContent += row + "\r\n";
           });



           var encodedUri = encodeURI(csvContent);
           // var link = document.createElement("a");
           d3.select("#exp_data")
                    .attr("href", encodedUri)
           // link.setAttribute("download", "my_data.csv");
           debugger;
           // link.innerHTML= "Click Here to download";
           // document.body.appendChild(link); // Required for FF

//            link.click(); // This will download the data file named "my_data.csv".