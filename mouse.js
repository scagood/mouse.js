/** Events:
 *  - mouseDown
 *  - mouseUp
 *  - mouseClick
 * 
 *  - leftDown
 *  - leftUp
 *  - leftClick
 * 
 *  - middleDown
 *  - middleUp
 *  - middleClick
 * 
 *  - rightDown
 *  - rightUp
 *  - rightClick
 * 
 *  - scroll
 *  - scrollDown
 *  - scrollUp
 * 
 *  - move
 * 
 *  - enter
 *  - leave
 * 
 *  - arrive
 *  - depart
**/
/** Common eventDetails:
 *  {
 *    "fixX":int, // 'fixed' x (offset inside viewport)
 *    "fixY":int, // 'fixed' y (offset inside viewport)
 *    "absX":int, // 'absolute' x (offset inside page)
 *    "absY":int, // 'absolute' y (offset inside page)
 *    "relX":int, // 'relative' x (offset inside elem)
 *    "relY":int, // 'relative' y (offset inside elem)
 *    "keys":{
 *      "alt":bool,  // Was alt pressed
 *      "ctrl":bool, // Was ctrl pressed
 *      "shift":bool // Was shift pressed
 *    },
 *    "target":<DOM> // DOM element
 *  }
**/
/** Functions:
 *  .on(eventName, eventDetails);
 *  .blockContext(Nullable boolean)
 *   - true - blocks context menu
 *   - false - unblocks context menu
 *   - null - toggles context menu blocking
**/
var mouse = function (elem) {
    elem = typeof elem === 'undefined' ? document.body : elem;
    // Events
    var triggers = {};
    function fire (event, params) {
        var i;
        if (triggers[event]) {
            for (i in triggers[event]) {
                triggers[event][i].apply(null, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
    function on (event, callback) {
        if (!triggers[event]) {
            triggers[event] = [];
        }
        triggers[event].push(callback);
    }
    this.on = on;
    
    // Utility
    function mergeObj(in1, in2){
        var a;
        var out = {};
        for (a in in1) {
            if (({}).hasOwnProperty.call(in1, a)) {
                out[a] = in1[a];
            }
        }
        for (a in in2) {
            if (({}).hasOwnProperty.call(in2, a)) {
                out[a] = in2[a];
            }
        }
        return out;
    }
    
    // Get correct coordinates
    function fixedCoords (e) {
        e = e || window.event;
        
        return {
            fixX: e.clientX,
            fixY: e.clientY
        };
    }
    function absoluteCoords (e) {
        e = e || window.event;
        
        var x = e.pageX;
        var y = e.pageY;
        
        // Define pageX & pageY if they're not defined
        if (typeof x === undefined) {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        }
        if (typeof y === undefined) {
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        
        return {
            absX: x,
            absY: y
        };
    }
    function relativeCoords (e) {
        e = e || window.event;
        var bb;
        
        // Compensate for border
        var target = e.target || e.srcElement;
        var style = target.currentStyle || window.getComputedStyle(target, null);
        var borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
        var borderTopWidth = parseInt(style['borderTopWidth'], 10);
        
        // Compensate for elem's location
        bb = elem.getBoundingClientRect();
        return {
            relX: e.clientX - bb.left - borderLeftWidth,
            relY: e.clientY - bb.top - borderTopWidth
        };
    }
    
    // Context Menu
    var contextBlocked = false;
    function blockContext(e) {
        fire('contextBlocked');
        e.preventDefault();
    }
    this.blockContext = function (enabled) {
        function contextOn () {
            elem.removeEventListener('contextmenu', blockContext);
            contextBlocked = false;
        }
        function contextOff () {
            elem.addEventListener('contextmenu', blockContext);
            contextBlocked = true;
        }
        if (typeof enabled === 'boolean') {
            if (enabled === true) {
                contextOff();
            } else {
                contextOn();
            }
        } else {
            if (contextBlocked === true) {
                contextOn();
            } else {
                contextOff();
            }
        }
    }
    
    // Key modifiers and mouse button detection
    var btnIds = {
        0: 'left',
        1: 'middle',
        2: 'right'
    }
    function keyDetect (e) {
        e = e || window.event;
        return {
            keys: {
                alt: e.altKey,
                ctrl: e.ctrlKey,
                shift: e.shiftKey
            }
        };
    }
    function btnDetect (e) {
        e = e || window.event;
        var btn = 0;
        if (typeof e.which !== 'undefined') {
            btn = e.which - 1
        } else if (typeof e.button !== 'undefined') {
            btn = e.button;
        } else if (typeof e.buttons !== 'undefined') {
            btn = {
                1: 0,
                2: 2,
                4: 1
            }[e.buttons];
        } else {
            btn = -1;
        }
        
        // -1 => unknown
        //  0 => left
        //  1 => middle
        //  2 => right
        
        return btn;
    }
    
    // Infomation compile
    function mouseInfo(e) {
        info = {};
        info = mergeObj(info, fixedCoords(e));
        info = mergeObj(info, absoluteCoords(e));
        info = mergeObj(info, relativeCoords(e));
        info = mergeObj(info, keyDetect(e));
        
        info.target = e.target;
        info.preventDefault = e.preventDefault;
        
        return info;
    }
    
    // Clicking Functions
    function up(e) {
        var info = mouseInfo(e);
        var btn = btnDetect(e);
        
        fire(btnIds[btn] + 'Up', info);
        fire(btnIds[btn] + 'Click', info);
        
        info.button = btn;
        fire('mouseUp', info);
    }
    function down(e) {
        var info = mouseInfo(e);
        var btn = btnDetect(e);
        
        fire(btnIds[btn] + 'Down', info);
        
        info.button = btn;
        fire('mouseDown', info);
    }
    
    // Scrolling Function
    function wheel(e) {
        e = e || window.event;
        var info = mouseInfo(e);
        if (e.wheelDelta) {
            delta = e.wheelDelta/120;
            if (window.opera)
                delta = -delta;
        } else if (e.detail) {
            delta = -e.detail / 3;
        }
        if (delta) {
            info.velocity = delta;            
            fire('scroll', info)
            if (delta < 0) {
                info.velocity = -delta;
                fire('scrollDown', info)
            } else {
                fire('scrollUp', info)
            }
        }
    }
    
    // Move Function
    function move(e) {
        fire('move', mouseInfo(e));
    }
    
    // Non Bubbling Border Patrol Function
    function enter(e) {
        fire('enter', mouseInfo(e));
    }
    function leave(e) {
        fire('leave', mouseInfo(e));
    }
    
    // Bubbling Border Patrol Function
    function arrive(e) {
        fire('arrive', mouseInfo(e));
    }
    function depart(e) {
        fire('depart', mouseInfo(e));
    }
    
    // Clicking Events
    elem.addEventListener('mouseup', up, false);
    elem.addEventListener('mousedown', down, false);
    
    // Scrolling Events
    elem.addEventListener('mousewheel', wheel, false);
    elem.addEventListener('DOMMouseScroll', wheel, false);
    
    // Moving Events
    elem.addEventListener('mousemove', move, false);
    
    // Non Bubbling Border Patrol Function
    elem.addEventListener('mouseenter', enter, false);
    elem.addEventListener('mouseleave', leave, false);
    
    // Bubbling Border Patrol Function
    elem.addEventListener('mouseover', arrive, false);
    elem.addEventListener('mouseout', depart, false);
}
