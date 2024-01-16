const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const axiom = "F";
let sentence = axiom;
let len = 50;
let angle = Math.PI / 6;

const rules = [];
rules[0] = {
    a: "F",
    b: "FF+[+F-F-F]-[-F+F+F]"
};

function setup(){
    createCanvas(WIDTH, HEIGHT);
    background(15, 10, 15);
    angle = radians(30)
    
    for (let gen = 0; gen < 4; gen++) {
        generate();
    }
    
    draw();
    turtle();
}

function draw(){
    translate(Number.parseInt(WIDTH / 2), HEIGHT);
    var r = 255;
    var g = 50;
    var b = 95;
    stroke(Number.parseInt((r)), Number.parseInt((g)), Number.parseInt((b)), len);
}

function turtle() {
    len *= .3;

    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);
        if (current == "F") {
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

function generate(){
    var next = "";
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