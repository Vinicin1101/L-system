let len;
let sentence;

class Controls {
    static move(controls) {
      function mousePressed(e) {
        controls.viewPos.isDragging = true;
        controls.viewPos.prevX = e.clientX;
        controls.viewPos.prevY = e.clientY;
      }
  
      function mouseDragged(e) {
        const {prevX, prevY, isDragging} = controls.viewPos;
        if(!isDragging) return;
  
        const pos = {x: e.clientX, y: e.clientY};
        const dx = pos.x - prevX;
        const dy = pos.y - prevY;
  
        if(prevX || prevY) {
          controls.view.x += dx;
          controls.view.y += dy;
          controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y
        }
      }
  
      function mouseReleased(e) {
        controls.viewPos.isDragging = false;
        controls.viewPos.prevX = null;
        controls.viewPos.prevY = null;
      }
   
      return {
        mousePressed, 
        mouseDragged, 
        mouseReleased
      }
    }
  
    static zoom(controls) {
      // function calcPos(x, y, zoom) {
      //   const newX = width - (width * zoom - x);
      //   const newY = height - (height * zoom - y);
      //   return {x: newX, y: newY}
      // }
  
      function worldZoom(e) {
        const {x, y, deltaY} = e;
        const direction = deltaY > 0 ? -1 : 1;
        const factor = 0.05;
        const zoom = 1 * direction * factor;
  
        const wx = (x-controls.view.x)/(width*controls.view.zoom);
        const wy = (y-controls.view.y)/(height*controls.view.zoom);
        
        controls.view.x -= wx*width*zoom;
        controls.view.y -= wy*height*zoom;
        controls.view.zoom += zoom;
      }
  
      return {worldZoom}
    }
}

const controls = {
    view: {x: 0, y: 0, zoom: 1},
    viewPos: { prevX: null,  prevY: null,  isDragging: false },
}

let sys = [
    {
        name: "Lévy C Curve",
        axiom: "F",
        angle: Math.PI / 2, 
        iteration: 6,
        lineLength: 5,
        rules: [
            {
                a: "X",
                b: "FX+"
            },
            {
                a: "F",
                b: "FX-"
            }
        ],
    },
    {   
        name: "Sierpinski triangle",
        axiom: "F-X-X",
        angle: (2*Math.PI) / 3, 
        iteration: 5,
        lineLength: 20,
        rules: [
            {
                a: "F",
                b: "F-X+F+X-F"
            },
            {
                a: "X",
                b: "XX"
            }
        ],
    },
    {   
        name: "Sierpinski arrowhead curve",
        axiom: "F",
        angle: Math.PI / 3, 
        iteration: 7,
        lineLength: 5,
        rules: [
            {
                a: "F",
                b: "X-F-X"
            },
            {
                a: "X",
                b: "F+X+F"
            }
        ],
    }
]

function generate(selected){
    var next = "";
    var rules = sys[selected].rules;

    for(var i = 0; i < sentence.length; i++){
        var current = sentence.charAt(i);
        var found = false;
        for (let j = 0; j < rules.length; j++) {
            if(current == rules[j].a){
                next += rules[j].b;
                found = true;
                break;
            }
        }
        if(!found) {
            next += current;
        }
    }
    sentence = next;
}

function setup(){
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e));
    background(15, 10, 15);

    options = createDiv("<h2>Options</h2>");
    options.addClass("options");

    iterLabel = createDiv("Iterations");
    iterSlide = createSlider(0, 20, 8);
    options.child(iterLabel);
    options.child(iterSlide);
    
    lineLabel = createDiv("Line length");
    lineSlide = createSlider(0, 100, 5);
    options.child(lineLabel);
    options.child(lineSlide);

    colorLabel = createDiv("Line color");
    colorPicker = createColorPicker("white");
    options.child(colorLabel);
    options.child(colorPicker);

    
    weightLabel = createDiv("Line weight");
    lineWeight = createSlider(1, 100, 1);
    options.child(weightLabel);
    options.child(lineWeight);
    
    selectSys = createSelect();

    for (let i = 0; i < sys.length; i++) {
        selectSys.option(sys[i].name, i)
    }

    selectSys.selected(sys[0].name)
    selectSys.changed(() => {
	    lineSlide.value(sys[selectSys.selected()].lineLenght);
	    iterSlide.value(sys[selectSys.selected()].iteration);
    });
}

function draw(){
    translate(controls.view.x, controls.view.y);
    scale(controls.view.zoom)
    rotate(-Math.PI / 2);
    stroke(colorPicker.value());
    strokeWeight(lineWeight.value());

    lineLabel.html(`Line length: ${lineSlide.value()}px`);
    iterLabel.html(`Iterations: ${iterSlide.value()} <b>CAUTION!</b>`);
    weightLabel.html(`Line weight: ${lineWeight.value()}`);
    colorLabel.html(`Color: ${colorPicker.value()}`);
    sys[selectSys.selected()].iteration = iterSlide.value();

    clear()    
    background(15, 10, 15);

    sentence = sys[selectSys.selected()].axiom
    for (var gen = 0; gen < sys[selectSys.selected()].iteration; gen++) {
        generate(selectSys.selected());
    }
    turtle(selectSys.selected())

}

function turtle(selected) {
    const angle = sys[selected].angle;
    len = lineSlide.value();

    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);
        if (current == "F" || current == "X") {
            line(0, 0, 0, -len);
            translate(0, -len);
        }else if (current == "+"){
            rotate(-angle);
        }else if (current == "-"){
            rotate(angle);
        } else if (current == "["){
            push();
        }else if (current == "]"){
            pop();
        }
    }
}

window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)