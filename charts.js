

// Call json data in and populate dropdown 
// masterFunction to populate dashboard

d3.json("samples.json").then(function(incomingData) {
    
  //Populate the dropdown
  d3.select("#selDataset")
      .selectAll("option")
      .data(incomingData.names)
      .enter()
      .append("option")
      .text(d=>d)
      .attr("value",d=>d);

  masterFunction(d3.select("#selDataset").property("value"));
});


// Deliverable 1 Bar Chart
function barChart(x,y,text) {
  var data = [{
      type: 'bar',
      x: x,
      y: y,
      text: text,
      orientation: 'h'
  }];

  var layout = {
      title: "Top 10 OTUs"
    };

  Plotly.newPlot('bar', data, layout);
}

// Deliverable 2 bubble chart
function bubbleChart(x,y,text) {
  var data = [{
      x: x,
      y: y,
      text: text,
      mode: 'markers',
      marker: {
        size: y,
        color: x.map(value=>value)
      }
  }];
  var layout = {
      title: "OTU Values",
      xaxis: {
          title: {
            text: 'OTU ID',
          }
      }
  };
  Plotly.newPlot('bubble', data, layout);
}

// Deliverable 3 Gauge Chart
function gaugeChart(num) {
  
  var data = [
  {
      domain: { x: [0, 1], y: [0, 1] },
      value: num,
      title: "Weekly Belly Button Washing Frequency",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
          axis: { range: [null, 10]},
          bar: { color: "green" },
          steps: [
              { range: [0, 2], color: "blue" },
              { range: [2, 4], color: "green" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "brown" },
              { range: [8, 10], color: "grey" },
          ],
      }
  }];
  Plotly.newPlot('gauge', data);
}

function Meta(data) {
  var div = d3.select("#sample-metadata");
  div.html("")
  var list = div.append("ul");
  Object.entries(data).forEach(([key, value]) => {
      list.append("li").text(key + ": " + value);
   });
}

// masterFunction executes each function so dashboard populates

function masterFunction(value) {
  d3.json("./data/samples.json").then(function(incomingData) {
      var metadata = incomingData.metadata.filter(data => data.id ==value);
      console.log(metadata);

      var sample = incomingData.samples.filter(data => data.id ==value);
      console.log(sample);

      barChart(sample[0].sample_values.slice(0,10).reverse(),sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),sample[0].otu_labels.slice(0,10).reverse());
      bubbleChart(sample[0].otu_ids,sample[0].sample_values,sample[0].otu_labels);
      gaugeChart(metadata[0].wfreq);
      Meta(metadata[0]);
  });


}
