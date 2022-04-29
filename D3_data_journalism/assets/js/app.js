// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

     // Append SVG element
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read CSV
  d3.csv("assets/data/data.csv").then(function(csvData) {
    // parse data
    csvData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;

        console.log(data)
  });

    // create scales
    var xScale = d3.scaleLinear()
        .domain([d3.min(csvData, d => d.poverty)/1.08, d3.max(csvData, d => d.poverty) * 1.08])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(csvData, d => d.healthcare)/1.25, d3.max(csvData, d => d.healthcare) * 1.08])
        .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).ticks(6);

    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

     chartGroup.append("g")
        .call(yAxis);

    // axes labels: x & y
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("class", "aText")
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("class", "aText")
        .text("Lacks Healthcare (%)");

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(csvData)
        .enter();

      circlesGroup
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "13")
        .text(d => d.abbr);
        
    // label circles   
      circlesGroup
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("font-size", "10")
        .text(d => d.abbr);

    // tooltips
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.abbr}<br>Healthcare: ${d.healthcare}%<br>Poverty: ${d.poverty}%`);
        });

      // Create the tooltip in chartGroup
      chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circleCsGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })

      // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
          toolTip.hide(d);
        });
    }).catch(function(error) {
      console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
