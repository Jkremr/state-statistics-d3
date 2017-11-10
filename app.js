// Step 0: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;


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
	// if (error) throw error;

	stateData.forEach(function(data){
		data.id = +data.id;
		data.state = +data.state;
		data.abbr = +data.abbr;
		data.poverty = +data.poverty;
		data.age = +data.age;
		data.income = +data.income;
		data.healthcare = +data.healthcare;
		data.obesity = +data.obesity;
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
			return +data[dataCoulmnX] * 0.9
		});

		xMax = d3.max(stateData, function(data){
			return +data[dataCoulmnX] * 1.05
		});

		yMin = d3.min(stateData, function(data){
			return +data[dataCoulmnY] * 0.9
		});

		yMax = d3.max(stateData, function(data){
			return +data[dataCoulmnY] * 1.05
		});
	};

	var currentXAxisLabel = 'poverty';
	var currentYAxisLabel = 'obesity';

	minMaxAxes(currentXAxisLabel, currentYAxisLabel);

	xLinearScale.domain([xMin, xMax]);
	yLinearScale.domain([yMin, yMax]);

	var toolTip = d3.tip()
		.attr('class', 'tooltip')
		.offset([80. -60])
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
			return yLinearScale(+data[currentYAxisLabel])
		})
		.attr('r', '15')
		.attr('fill', '#E75480')
		.on('click', function(data){
			toolTip.show(data);
		})
		.on('mouseout', function(data){
			toolTip.hide(data);
		})

	chart
		.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('class', 'x-axis')
		.call(bottomAxis);

	chart
		.append('g')
		.call(leftAxis);
		
		// Add y-Axis label
	chart
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 0 - margin.left + 40)
		.attr('x', 0 - height / 2)
		.attr('dy', '1em')
		.attr('class', 'axis-text')
		.attr('data-axis-name', currentYAxisLabel)
		.text(currentYAxisLabel);
		
		// Add x-Axis label
	chart
		.append('text')
		.attr(
			"transform",
			"translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
			)			
		.attr('class', 'axis-text active')
		.attr('data-axis-name', currentXAxisLabel)
		.text(currentXAxisLabel);

	chart
		.append('text')
		.attr(
			'transform',
			'translate(' + width / 2 + ' ,' + (height + margin.top + 45) + ")"
			)
		.attr('class', 'axis-text inactive')
		.attr('data-axis-name', 'income')
		.text('Income');

	function labelChange(clickedAxis) {
		d3
			.selectAll('.axis-text')
			.filter('.active')
			.classed('active', false)
			.classed('inactive', true);

		clickedAxis.classed('inactive', false).classed('active', true)
	}

	d3.selectAll('.axis-text').on('click', function(){
		var clickedSelection = d3.select(this);
		var isClickedSelectionInactive = clickedSelection.classed('inactive');
		// console.log('this axis is inactive', isClickedSelectionInactive)

		var clickedAxis = clickedSelection.attr('data-axis-name');

		if (isClickedSelectionInactive){
			console.log(clickedAxis)
			currentXAxisLabel = clickedAxis;
			minMaxAxes(currentXAxisLabel,currentYAxisLabel);
			xLinearScale.domain([xMin, xMax]);
			yLinearScale.domain([yMin, yMax]);

			svg.select('.x-Axis')
				.transition()//.ease(d3.easeElastic)
				//.duration(1800)
				.call(bottomAxis);

			svg.select('.y-Axis')
				.transition()//.ease(d3.easeElastic)
				//.duration(1800)
				.call(leftAxis);

			d3.selectAll('circle').each(function(){
				d3
					.select(this)
					.transition()
					.attr('cx', function(data) {
						return xLinearScale(+data[currentXAxisLabel]);
					})
					.duration(1800);
					console.log(currentXAxisLabel)
				d3
					.select(this)
					.transition()
					.attr('cy', function(data) {
						return yLinearScale(+data[currentYAxisLabel])
					})
					.duration(1800)
			});

			labelChange(clickedSelection);

		}
	})


})