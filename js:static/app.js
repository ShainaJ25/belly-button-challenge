// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    const result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {

      // Create a text string for each key-value pair
      const textString = `${key.toUpperCase()}: ${value}`;
      
      // Append an HTML tag (h6) with the text string to the panel
      PANEL.append("h6").text(textString);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    const result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
      }
  }];
    const bubbleLayout = {
      title: {
      text: "Bacteria Cultures Per Sample",
      },
      margin: { t: 35, l: 65 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number Of Bacteria" },
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

     // For the Bar Chart, map the otu_ids to a list of strings for your yticks
     const top10Indices = sample_values
     .map((value, index) => [value, index]) // Pair each value with its index
     .sort((a, b) => b[0] - a[0]) // Sort by value in descending order
     .slice(0, 10) // Get the top 10
     .map(pair => pair[1]); // Extract the indices of the top 10

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const yticks = top10Indices.map(index => `OTU ${otu_ids[index]}`).reverse();
    const barData = [{
      y: yticks,
      x: top10Indices.map(index => sample_values[index]).reverse(),
      text: top10Indices.map(index => otu_labels[index]).reverse(),
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: {
        text: "Top 10 Bacteria Cultures Found",
        x: 0.05 
      },
      margin: { t: 35, l: 65 },
      xaxis: { 
        title: "Number of Bacteria", 
    },
};
    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
