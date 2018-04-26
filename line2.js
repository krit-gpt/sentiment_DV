
var margin2 = {top2: 30, right2: 40, bottom2: 20, left2: 200},
    width2 = 700 - margin2.left2 - margin2.right2,
    height2 = 400 - margin2.top2 - margin2.bottom2;

var dimensions2 = [
  {
    name: "name",
    scale: d3.scale.ordinal().rangePoints([0, height2]),
    type: String
  },
  {
    name: "January",
    scale: d3.scale.linear().range([0, height2]),
    type: Number
  },
  {
    name: "February",
    scale: d3.scale.linear().range([height2, 0]),
    type: Number
  },
  {
    name: "March",
    scale: d3.scale.sqrt().range([height2, 0]),
    type: Number
  },
  {
    name: "April",
    scale: d3.scale.linear().range([height2, 0]),
    type: Number
  }
];

var x2 = d3.scale.ordinal()
    .domain(dimensions2.map(function(d) { return d.name; }))
    .rangePoints([0, width2]);

var line2 = d3.svg.line()
    .defined(function(d) { return !isNaN(d[1]); });

var yAxis2 = d3.svg.axis()
    .orient("left");

var svg2 = d3.select("#svg1")
    .attr("width2", width2 + margin2.left2 + margin2.right2)
    .attr("height2", height2 + margin2.top2 + margin2.bottom2)
  .append("g")
    .attr("transform", "translate(" + margin2.left2 + "," + margin2.top2 + ")");

var dimension2 = svg2.selectAll(".dimension2")
    .data(dimensions2)
  .enter().append("g")
    .attr("class", "dimension2")
    .attr("transform", function(d) { return "translate(" + x2(d.name) + ")"; });

d3.tsv("projections2.tsv", function(error, data2) {
  if (error) throw error;

  dimensions2.forEach(function(dimension2) {
    dimension2.scale.domain(dimension2.type === Number
        ? d3.extent(data2, function(d) { return +d[dimension2.name]; })
        : data2.map(function(d) { return d[dimension2.name]; }).sort());
  });

  svg2.append("g")
      .attr("class", "background2")
    .selectAll("path")
      .data(data2)
    .enter().append("path")
      .attr("d", draw2);

  svg2.append("g")
      .attr("class", "foreground2")
    .selectAll("path")
      .data(data2)
    .enter().append("path")
      .attr("d", draw2);

  dimension2.append("g")
      .attr("class", "axis2")
      .each(function(d) { d3.select(this).call(yAxis2.scale(d.scale)); })
    .append("text")
      .attr("class", "title2")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d.name; });

  // Rebind the axis data to simplify mouseover.
  svg2.select(".axis").selectAll("text:not(.title)")
      .attr("class", "label")
      .data(data2, function(d) { return d.name || d; });

  var projection = svg2.selectAll(".axis text,.background2 path,.foreground2 path")
      .on("mouseover", mouseover)
      //.on("mouseout", mouseout);

  function mouseover(d) {
    svg2.classed("active", true);
    projection.classed("inactive", function(p) { return p !== d; });
    projection.filter(function(p) { return p === d; }).each(moveToFront2);
  }

  // function mouseout(d) {
  //   svg.classed("active", false);
  //   projection.classed("inactive", false);
  // }

  function moveToFront2() {
    this.parentNode.appendChild(this);
  }
});

function draw2(d) {
  return line2(dimensions2.map(function(dimension2) {
    return [x2(dimension2.name), dimension2.scale(d[dimension2.name])];
  }));
}
