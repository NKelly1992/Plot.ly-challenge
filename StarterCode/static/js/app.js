
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  };

function buildCharts(sample) {
    // Use the D3 library to read in samples.json
    d3.json("samples.json").then(function(data) {
        console.log(data);   
    var samples = data.samples;
    var resultsArray = samples.filter(sampledata => sampledata.id == sample);
    var result = resultsArray[0];

    console.log(result);

    var otuIDs = result.otu_ids;
    var sample_values = result.sample_values;
    var sampleText = result.otu_labels;

    // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    var barData = {
        x: sample_values.slice(0, 10).reverse(),
        y: otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        text: sampleText.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
    };

    var barLayout = {
        title: "Top 10 Bacterias Found in Subject",
        color: "#1f77b4",
        margin: { t:30, l:150}
    };

    Plotly.newPlot("bar", [barData], barLayout)

    // Create a bubble chart that displays each sample
    var bubbleData = {
        x: otuIDs,
        y: sample_values,
        text: sampleText,
        mode: "markers",
        marker: {
            color: otuIDs,
            size: sample_values,
        }
    };

    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t:0 },
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
        margin: { t:30 }
    };

    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

    });
};

// buildCharts(1510)

// Display each key-value pair from the metadata JSON object somewhere on the page.
function buildMetaData(sample) {
    //Extract the information
    d3.json("samples.json").then(function(data) {
            console.log(data);
        var metaData = data.metadata;
        var resultsArray = metaData.filter(sampledata => sampledata.id == sample);
        var results = resultsArray[0];
            console.log(results);
        //Occupy the demographics panel with the metadata information
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(results).forEach(([key, value]) => 
        panel.append("h6").text(`${key}: ${value}`))
})};


function init() {
    var selector = d3.select("#selDataset");
    
    // Populate the select options with the sample names from the data set
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    
      // Use the first sample as the default plot
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetaData(firstSample);
    });


};

// Update all of the plots any time that a new sample is selected
function UpdateSample(newSample) {
buildCharts(newSample);
buildMetaData(newSample);};

    
init();
