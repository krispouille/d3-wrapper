/**
 * D3JS WRAPPER
 * @author cjemba
 * @todo handle keys like svg#id.class1.class2
 * @todo handle overriding of styles
 *
 * includes :
 * - draw(json, parent) to easily build svg 
 * - remove(selection) to easily remove an element
 *
 * example :
 * var chart = d3.wrapper;
 * chart.draw({
 *  svg:{
 *      width:100,
 *      height:100,
 *      border: '1px solid #ccc',
 *      click: function(){
 *          chart.draw({
 *              style:'border:1px solid #ccc'
 *          }, this);
 *      },
 *      'rect.left':{
 *          width:'50%',
 *          fill: '#c30'
 *      },
 *      'rect.right':{
 *          width:'50%',
 *          fill: '#39c'
 *      }
 *  }
 * },'body');
 *
 * chart.remove('svg');
 */
(function(d3){
    // helpers
    var getPrototype = function(item){
        return Object.prototype.toString.call(item);
    };
    var isObject = function(item){
        return getPrototype(item)=='[object Object]';
    };
    var isString   = function(item){
        return getPrototype(item)=='[object String]';
    };
    var isArray = function(item){
        return getPrototype(item)=='[object Array]';
    };
    var isFunction = function(item){
        return getPrototype(item)=='[object Function]';
    };

    // attrs/tags/styles/events ... to handle during parsing
    var tags   = /^(svg|line|g|rect|circle|text|path|arc)$/g;
    var styles = /^(border|cursor)$/g;
    var events = /^(click|mouseover|mouseout|mousemove)$/g;

    // function called recursively to build svg
    var draw   = function(obj, parent){
        var root = parent;
        // loop on potential tags
        for(tag in obj){
            var element = obj[tag];
            var fullTag = tag;
            // handle keys => svg.chart g.test
            var spaces = tag.split(' ');
            if(spaces.length>1) tag = spaces.pop();
            var parts = tag.split('.');
            tag = parts.shift();

            // tags
            if(tag.match(tags) && isObject(element)){
                // if "bind" in the coming element, withdraw it and bind data
                if(element.bind){
                    var template = {}; 
                    template[fullTag] = element;
                    var data = template[fullTag]['bind'];
                    delete template[fullTag]['bind'];
                    draw(template, parent.selectAll(fullTag).data(data).enter());
                }
                // if "transition" in the coming event, withdraw it and apply transition
                else if(element.transition!==undefined){
                    var template = {}; 
                    template[fullTag] = element;
                    var transition = template[fullTag]['transition'];
                    delete template[fullTag]['transition'];
                    draw(template, transition ? d3.selectAll(fullTag).transition() : parent.transition());
                }
                // if no reserved words, call recursively draw() to handle the next sub-element
                else{
                    // no container/target => do a selection
                    if(parent===undefined) {
                        root = d3.selectAll(fullTag);
                    }
                    else if(parent.append){
                        root = parent.append(tag);
                        if(element.name){
                            var setter = {}; 
                            setter[element.name] = root;
                            delete element.name;
                            d3.wrapper.set(setter);
                        }
                        if(parts.length) root.attr('class', parts.join(' '));
                    }
                    draw(element, root);
                }
            }
            // styles
            else if(tag.match(styles)){
                parent.style(tag, element);
            }
            // events
            else if(tag.match(events)){
                parent.on(tag, element);
            }
            // attributes or specific actions
            else{
                if(tag=='each')          parent.each(element);
                else if(tag=='text')     parent.text(element);
                else if(tag=='delay')    root.delay(element);
                else if(tag=='duration') root.duration(element);
                else                     parent.attr(tag, element);
            }
        }
    };
    var options = {};
    d3.wrapper = {
        draw: function(skel, target){
            var container = target===undefined ? target : isArray(target) ? target : d3.select(target);
            draw(skel, container);
            return this;
        },
        remove: function(element){
            !isArray(element) ? d3.selectAll(element).remove() : element.remove();
            return this;
        },
        set: function(settings){
            for(key in settings) options[key] = settings[key];
            return this;
        },
        get: function(key){
            if(arguments.length==0) return options;
            return options[key];
        }
    }
}(d3));
