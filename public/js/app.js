(() => {
  'use strict';
  var socket = io(),
      svg = d3.select('body').append('svg'),
      duration = 60000,
      w = window.innerWidth,
      h = window.innerHeight,
      variance = duration / 1000;

  var pos = (d, r) => {
    return [Math.cos(d) * r,
            Math.sin(d) * r];
  };

  svg.attr({
    width: window.innerWidth,
    height: window.innerHeight
  });
  var center = svg.append('g').attr('transform', 'translate(' + [w/2,h/2] + ')');


  var radius = (w - h > 0) ? (h / 2 - 50) : (w / 2 - 50);
  var radScale = d3.scale.linear().domain([0,60]).range([0, 2 * Math.PI]);

  socket.on('tweet', (tweet) => {
    var posted = new Date(tweet.postedTime),
        tweetPos = pos(posted % duration, radius),
        poster = { 
          id: +(tweet.actor.id.split(':')[2]),
          type: 'tweet'
        },
        mentions = tweet.twitter_entities.user_mentions.map((m) => {
          return {
            id: +m.id,
            type: 'mention'
          };
        });

    console.log(posted % duration);
    center.append('circle').classed('tweet', true)
      .attr({
        cx: 0,
        cy: 0,
        r: 8
      })
      .transition()
        .duration(duration)
        .attr({
          cx: tweetPos[0],
          cy: tweetPos[1]
        })
        .remove();
    mentions.forEach((m) => {
      var mod = (Math.random() - 0.5) * variance,
          mentionPos = pos((posted % duration) + (mod > 0) ? mod + 20 : mod - 10, radius);

      center.append('path').classed('arc', true)
        .attr('d', 'M0,0 T0,0' )
      .transition()
        .duration(duration)
        .attr({
          d: 'M' + tweetPos[0] + ',' + 
                   tweetPos[1] + ' ' + 
             'T' + pos(((posted) % duration) + mod, radius)[0] + ',' + 
                   pos(((posted) % duration) + mod, radius)[1] + ' '
        })
      .remove();
      center.append('circle').classed('mention', true)
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
