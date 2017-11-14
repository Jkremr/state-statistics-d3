// Step 0: Set up our chart
//= ================================
var svgWidth = 600;
var svgHeight = 400;


var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv('data.csv', function(error, stateData){
	if (error) throw error;

	stateData.forEach(function(data){
		data.id = +data.id;
		data.state = +data.state;
		data.abbr = data.abbr;
		data.income = +data.income;
		data.unemployment = +data.unemployment;
		data.hsgrad = +data.hsgrad;
		data.obesity = +data.obesity;
		data.smokes = +data.smokes;
		data.healthcare = +data.healthcare;

		// data.election2016 = +election2016

	});

	var yLinearScale = d3.scaleLinear().range([height, 0]);
	var xLinearScale = d3.scaleLinear().range([0, width]);

	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	var xMin;
	var xMax;
	var yMin;
	var yMax;

	function minMaxAxes(dataCoulmnX, dataCoulmnY) {
		xMin = d3.min(stateData, function(data){
			return +data[dataCoulmnX] * 0.9;
		});

		xMax = d3.max(stateData, function(data){
			return +data[dataCoulmnX] * 1.05;
		});

		yMin = d3.min(stateData, function(data){
			return +data[dataCoulmnY] * 0.9;
		});

		yMax = d3.max(stateData, function(data){
			return +data[dataCoulmnY] * 1.05;
		});
	}

	var currentXAxisLabel = 'income';
	var currentYAxisLabel = 'obesity';

	minMaxAxes(currentXAxisLabel, currentYAxisLabel);

	xLinearScale.domain([xMin, xMax]);
	yLinearScale.domain([yMin, yMax]);

	var toolTip = d3
		.tip()
		.attr('class', 'tooltip')
		.offset([80, -60])
		.html(function(data){
			var stateName = data.state;
			var demographicInfo = +data[currentXAxisLabel];
			var featureInfo = +data[currentYAxisLabel];
			var stateString = stateName;
		});

	chart.call(toolTip);

	chart
		.selectAll('circle')
		.data(stateData)
		.enter()
		.append('circle')
		.attr('cx', function(data, index){
			return xLinearScale(+data[currentXAxisLabel]);
		})
		.attr('cy', function(data, index){
			return yLinearScale(+data[currentYAxisLabel]);
		})
		.attr('r', '15')
		.attr('fill', '#66CDAA')
		.on("mouseover", function(data) {
		toolTip.show(data);
		})
		.on('mouseout', function(data, index){
			toolTip.hide(data);
		});

	var text = chart
		.selectAll('text')
		.data(stateData)
		.enter()
		.append('text')
	var textLabels = text
		.attr("x", function(data, index) {
			return xLinearScale(+data[currentXAxisLabel])-6;
		})
		.attr("y", function(data, index) {
			return yLinearScale(+data[currentYAxisLabel])+4;
		})
		.text( function (data) {return data.abbr})
		.attr("class","circle-text");

	chart
		.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('class', 'x-axis')
		.call(bottomAxis);

	chart
		.append('g')
		.call(leftAxis);
		
	// Add y-Axis labels for our outcomes data features.
	chart
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 0 - margin.left + 20)
		.attr('x', 0 - height / 2)
		.attr('dy', '1em')
		.attr('class', 'yaxis-text yactive')
		.attr('data-axis-name', 'obesity')
		.text('Obesty');

	chart
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 0 - margin.left + 40)
		.attr('x', 0 - height / 2)
		.attr('dy', '1em')
		.attr('class', 'yaxis-text yinactive')
		.attr('data-axis-name', 'smokes')
		.text('Smokes');

	chart
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 0 - margin.left + 60)
		.attr('x', 0 - height / 2)
		.attr('dy', '1em')
		.attr('class', 'yaxis-text yinactive')
		.attr('data-axis-name', 'healthcare')
		.text('Healthcare');
		
	// Add x-Axis labels for our demographics features.
	chart
		.append('text')
		.attr(
			"transform",
			"translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
			)			
		.attr('class', 'xaxis-text xactive')
		.attr('data-axis-name', 'income')
		.text('Income');

	chart
		.append('text')
		.attr(
			'transform',
			'translate(' + width / 2 + ' ,' + (height + margin.top + 40) + ")"
			)
		.attr('class', 'xaxis-text xinactive')
		.attr('data-axis-name', 'unemployment')
		.text('unemployment');

	chart
		.append('text')
		.attr(
			'transform',
			'translate(' + width / 2 + ' ,' + (height + margin.top + 60) + ")"
			)
		.attr('class', 'xaxis-text xinactive')
		.attr('data-axis-name', 'hsgrad')
		.text('hsgrad');


	function xLabelChange(clickedAxis) {
		d3
		.selectAll('.xaxis-text')
		.filter('.xactive')
		.classed('xactive', false)
		.classed('xinactive', true);

		clickedAxis.classed('xinactive', false).classed('xactive', true);
	}
	function yLabelChange(clickedAxis) {
		d3
		.selectAll('.yaxis-text')
		.filter('.yactive')
		.classed('yactive', false)
		.classed('yinactive', true);

		clickedAxis.classed('yinactive', false).classed('yactive', true);
	}

	d3.selectAll('.yaxis-text').on('click', function(){
		var clickedSelection = d3.select(this);
		var isClickedSelectionInactive = clickedSelection.classed('yinactive');
		// console.log('this axis is inactive', isClickedSelectionInactive)

		var clickedAxis = clickedSelection.attr('data-axis-name');

		if (isClickedSelectionInactive){
			// console.log(clickedAxis)
			currentYAxisLabel = clickedAxis;
			minMaxAxes(currentXAxisLabel,currentYAxisLabel);
			yLinearScale.domain([yMin, yMax]);

			svg.select('.y-axis')
				.transition()
				.duration(1800)
				.call(leftAxis);

			d3.selectAll('circle').each(function(){
				d3
					.select(this)
					.transition()
					.attr('cy', function(data) {
						return yLinearScale(+data[currentYAxisLabel])
					})
					.duration(1800)
			});

			d3.selectAll(".circle-text").each(function(){
				d3
				.select(this)
				.transition()
				.attr("y", function(data, index) {
					return yLinearScale(+data[currentYAxisLabel])+4;
				})
				.duration(1800);
			});

			yLabelChange(clickedSelection);

		}
	})

	d3.selectAll('.xaxis-text').on('click', function(){
		var clickedSelection = d3.select(this);
		var isClickedSelectionInactive = clickedSelection.classed('xinactive');
		// console.log('this axis is inactive', isClickedSelectionInactive)

		var clickedAxis = clickedSelection.attr('data-axis-name');

		if (isClickedSelectionInactive){
			console.log(clickedAxis)
			currentXAxisLabel = clickedAxis;
			minMaxAxes(currentXAxisLabel,currentYAxisLabel);
			xLinearScale.domain([xMin, xMax]);


			svg.select('.x-axis')
				.transition()
				// .duration(1800)
				.call(bottomAxis);

			d3.selectAll('circle').each(function(){

				d3
					.select(this)
					.transition()
					.attr('cx', function(data) {
						return xLinearScale(+data[currentXAxisLabel]);
					})
					.duration(1800);
			});

			d3.selectAll(".circle-text").each(function(){
				d3
				.select(this)
				.transition()
				.attr('x', function(data, index) {
					return xLinearScale(+data[currentXAxisLabel])-6;
				})
				.duration(1800);
			});

			yLabelChange(clickedSelection);

		}
	})

})