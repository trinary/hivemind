
(function() {
  "use strict";
  var socket = io(),
      svg = d3.select("body").append("svg"),
      duration = 30000,
      w = window.innerWidth,
      h = window.innerHeight,
      variance = duration / 4;

  var pos = function(d, r) {
    return [Math.sin(d * Math.PI / 180) * r,
            Math.cos(d * Math.PI / 180) * r];
  };

  svg.attr({
    width: window.innerWidth,
    height: window.innerHeight
  });
  var center = svg.append("g").attr("transform", "translate(" + [w/2,h/2] + ")");


  var radius = (w - h > 0) ? (h / 2 - 50) : (w / 2 - 50);
  var radScale = d3.scale.linear().domain([0,1]).range([25, radius]);

  socket.on('tweet', function(tweet) {
    var posted = new Date(tweet.postedTime);
    var poster = { 
      id: +(tweet.actor.id.split(':')[2]),
      type: 'tweet'
    };
    var mentions = tweet.twitter_entities.user_mentions.map(function(m) {
      return {
        id: +m.id,
        type: 'mention'
      };
    });
    center.append("circle").classed("tweet", true)
      .attr({
        cx: 0,
        cy: 0,
        r: 8
      })
      .transition()
        .duration(duration)
        .attr({
          cx: pos((posted) % duration, radius)[0],
          cy: pos((posted) % duration, radius)[1]
        })
        .remove();
    mentions.forEach(function(m) {
      var mod = (Math.random() - 0.5) * (duration / 4000);
      mod = (mod > 0) ? mod + 10 : mod - 10;
      console.log(mod);
      center.append("path").classed("arc", true)
        .attr({
          d: "M0,0 T0,0"
        })
      .transition()
        .duration(duration)
        .attr({
          d: "M" + pos((posted) % duration, radius)[0] + "," + 
                   pos((posted) % duration, radius)[1] + " " + 
             "T" + pos(((posted) % duration) + mod, radius)[0] + "," + 
                   pos(((posted) % duration) + mod, radius)[1] + " "
        })
      .remove();
      center.append("circle").classed("mention", true)
      .attr({
        cx: 0,
        cy: 0,
        r: 8
      })
      .transition()
        .duration(duration)
        .attr({
          cx: pos(((posted) % duration) + mod, radius)[0],
          cy: pos(((posted) % duration) + mod, radius)[1]
        })
        .remove();
    });
  });

  
}());
