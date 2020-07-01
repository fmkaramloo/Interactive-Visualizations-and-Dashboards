// Filter and display sample Metdata based on selection.
function buildMetaData(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        //filter the data for the desired sample data
        var array = metadata.filter(obj => obj.id == sample);
        var result = array[0];
        // console.log(result);
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
   
 // BONUS: Build the Gauge Chart
    buildGauge(result.wfreq);

    })
};
// Build out all of our charts.
function buildChart(sample) {


    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        console.log(samples);
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        console.log(result.otu_ids);
   // var plotData = `/samples/${sample}`;
    //Build a Bubble Chart using the sample data    
    //d3.json(plotData).then(function (data) {
        var x_axis = result.otu_ids;
        var y_axis = result.sample_values;
        var size = result.sample_values;
        var color = result.otu_ids;
        var texts = result.otu_labels;

        var bubble = {
            x: x_axis,
            y: y_axis,
            text: texts,
            mode: `markers`,
            marker: {
                size: size,
                color: color
            }
        };

        var data = [bubble];
        var layout = {
            title: "Belly Button Bacteria",
            xaxis: { title: "OTU ID" }
        };
        Plotly.newPlot("bubble", data, layout);
    

        // Build a bar Chart
        // console.log(result.otu_ids);
        var values = result.sample_values.slice(0, 10).reverse();
        var labels = result.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var display = result.otu_labels.slice(0, 10).reverse();

        var trace = [{
            x: values,
            y: labels,
            text: display,
            marker: {
                color: 'purple'
            },
            type: "bar",
            orientation: "h",
        }];
        // create data variable
        // var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",            
            margin: {
                t: 30,
                l: 150
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", trace, layout);
    })
} 


// Init dashboard.
function init() {
    // Grab ref to the dropdown selector.
    var selection = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var names = data.names;
        names.forEach((name) => {
            selection.append("option").text(name).property("value", name);
        });
        // Use the first sample from the list to build the initial chart/plots.
        // console.log(names);
        var first = names[0];
        buildChart(first);
        buildMetaData(first);
    })
};

// Reload dashboard with updated sample that's selected.
function optionChanged(newSample) {
    // Use buildCharts and buildMetaDat to reload with newly filterd sample data.
    buildChart(newSample);
    buildMetaData(newSample);
};

init();

