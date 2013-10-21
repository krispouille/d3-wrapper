# D3 JS Wrapper #

This is a JSON approach to build D3js graphs.

## Why JSON ? ##

Let's see on an example. Normally, here is how, the D3 API wants us to create our svgs, charts, etc. :

```javascript

var svg = d3.select('body')
            .append('svg').
            .attr('width', 100)
            .attr('height', 100);
            .style('border','1px solid #ccc');

var rect1 = svg.append('rect')
               .attr('fill','#39c')
               .style('stroke', '#000') 
               .attr('width', 25)
               .attr('height',25)

var circle = svg.append('circle')
                .attr('r',12)
               .attr('fill','#fff')
               .style('stroke', '#000') 
               .attr('transform','translate(20, 20)');

var rect2 = svg.append('rect')
               .attr('fill','#c30')
               .style('stroke', '#000') 
               .attr('width', 25)
               .attr('height',25)
               .attr('transform','translate(20, 20)');
```

Using the wrapper, you would do something like this :

```javascript

d3.wrapper.draw({
    svg:{
        width:100,
        height:100,
        border:'1px solid #ccc',
        'rect.blue':{
            fill: '#39c',
            stroke: '#000',
            width:25,
            height:25
        },
        circle:{
            r:12,
            fill:'#fff',
            stroke:'#000',
            transform: 'translate(20, 20)'
        },
        'rect.red':{
            fill: '#c30',
            stroke: '#000',
            width:25,
            height:25,
            transform: 'translate(20, 20)'
        }
    }
},'body');
```

As you can see, using json, you write less, and it is easier to read. The only thing I had to take into account 
is that yout can't write a JSON with two same keys on the same level. On my example, I can't do this :

```javascript
...
svg:{
    rect:{...},
    circle:{...},
    rect:{...}
}
...
```

So to avoid having two same keys, I just make them different in a way by adding a class (or an ID).
