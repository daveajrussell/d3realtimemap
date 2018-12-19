function getProjection() {
    return d3.geo.mercator()
        .scale(130)
        .center([0, 0]);
}

function draw() {
    var svg = d3.select("body")
        .append("svg")
        .attr("width", 960)
        .attr("height", 450)
        .append('g')
        .attr('class', 'map');

    var projection = getProjection();
    var path = d3.geo.path().projection(projection);

    queue()
        .defer(d3.json, "src/world_countries.json")
        .await(ready);

    function ready(error, data) {
        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", '#82BC42')
            .style('stroke', 'white')
            .style('stroke-width', 0.5)
            .style("opacity", 0.8);

        svg.append("path")
            .datum(topojson.mesh(data.features, function (a, b) { return a.id !== b.id; }))
            .attr("class", "names")
            .attr("d", path);
    }
}

function ping(coords) {
    var projection = getProjection();

    var point = d3.select('svg')
        .selectAll('circle')
        .data([...coords])
        .enter()
        .append('circle')
        .attr('fill-opacity', 0.5)
        .attr("cx", function (d) { return projection(d)[0]; })
        .attr("cy", function (d) { return projection(d)[1]; });

    point.attr({
        'r': 1,
        'opacity': 1e-6,
        'fill-opacity': 0.3,
        'fill': '#EC0089',
        'stroke': '#fff',
        'stroke-opacity': 1
    })
        .transition()
        .delay((d) => Math.floor((Math.random() * 1000) + 0))
        .duration(500)
        .ease('cubic-in-out')
        .attr({
            'fill': '#EC0089',
            'opacity': 1,
            'r': 60,
            'stroke-opacity': 0.4,
            'stroke-width': '1px',
            'stroke': '#361'
        })
        .each('end', function () {
            var dot = d3.select(this);

            dot.transition()
                .duration(800)
                .attr({
                    'fill': '#EC0089',
                    'opacity': 0.9,
                    'fill-opacity': 0.9,
                    'stroke-width': '1px',
                    'stroke': '#361',
                    'r': 2.2
                });
        })
};