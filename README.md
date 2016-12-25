# mouse.js
A simple js mouse interface

## Example
```JavaScript
TODO
```

## Functions

### .on(eventName, eventDetails)
#### Core 'eventDetails':
```JavaScript
{
  "fixX":int, // 'fixed' x (offset inside viewport)
  "fixY":int, // 'fixed' y (offset inside viewport)
  "absX":int, // 'absolute' x (offset inside page)
  "absY":int, // 'absolute' y (offset inside page)
  "relX":int, // 'relative' x (offset inside elem)
  "relY":int, // 'relative' y (offset inside elem)
  "keys":{
    "alt":bool,  // Was alt pressed
    "ctrl":bool, // Was ctrl pressed
    "shift":bool // Was shift pressed
  },
  "target":<DOM> // DOM element
}
```
###.blockContext(Nullable boolean)
- true - blocks context menu
- false - unblocks context menu
- null - toggles context menu blocking

## Events
### Mouse Buttons 
#### Additional 'eventDetails'
- 'button'

#### Events
- mouseDown
- mouseUp
- mouseClick

### Left Mouse Button
#### Events
- leftDown
- leftUp
- leftClick

### Middle Mouse Button
#### Events
- middleDown
- middleUp
- middleClick

### Right Mouse Button
#### Events
- rightDown
- rightUp
- rightClick

### Scroll Wheel
#### Additional 'eventDetails'
- 'velocity'

#### Events
- scroll
- scrollDown
- scrollUp

### Mouse motion
#### Events
- move

### Non Bubbling 'Border Patrol'
#### Events
- enter
- leave

### Bubbling 'Border Patrol'
#### Events
- arrive
- depart
