const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let len;
let sentence;

const sys = [
    {
        name: "Lévy C Curve",
        axiom: "F",
        angle: Math.PI / 2, 
        iteration: 11,
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
        iteration: 4,
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
        iteration: 6,
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
    createCanvas(WIDTH, HEIGHT);
    background(15, 10, 15);

    selectSys = createSelect();
    for (let i = 0; i < sys.length; i++) {
        selectSys.option(sys[i].name, i)
    }

    selectSys.changed(() => {
        clear()
        background(15, 10, 15);
        sentence = sys[selectSys.selected()].axiom
        for (var gen = 0; gen < sys[selectSys.selected()].iteration; gen++) {
            generate(selectSys.selected());
        }
        turtle(selectSys.selected());
    });
}

function draw(){
    translate(Number.parseInt(WIDTH / 2), HEIGHT / 2);
    rotate(-Math.PI / 2);
    var r = 255;
    var g = 50;
    var b = 95;
    stroke(Number.parseInt((r)), Number.parseInt((g)), Number.parseInt((b)));
}

function turtle(selected) {
    console.log(sys[selected]);
    const angle = sys[selected].angle;
    len = sys[selected].lineLength;

    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);
        if (current == "F" || current == "X") {
            line(0, 0, 0, -len);
            translate(0, -len);
        }else if (current == "+"){
            rotate(angle);
        }else if (current == "-"){
            rotate(-angle);
        } else if (current == "["){
            push();
        }else if (current == "]"){
            pop();
        }
    }
}