/*
    Code sample for CSCI 2408 Computer Graphics 
    (c)2024 by Silla Ibrahim 

    DISCLAIMER: All code examples we will look at are quick hacks intended to present working prototypes.
    Hence they do not follow best practice of programming or software engineering.    
*/
var canvas;
var context;
var fileopen;
var model;


window.onload = init;
window.onkeydown = onKeyDown;

class Object{

    #vertices;
    vertices;
    faces;
    fileReader;
    onloadend;
    scaleFactor;
    rotateY;
    
    constructor(){
        // attributes initialization
        this.vertices = new Array();
        this.faces = new Array();
        this.#vertices = new Array();
        this.fileReader = new FileReader();
        this.scaleFactor = 1;
        this.rotateY =0;
        //adding event listener on fileReader if loading the file content finishes.
        this.fileReader.onloadend = this.#onLoadEnd; 
    }

    #onLoadEnd = (e)=>{
        //getting lines from the overall text read
        var lines = e.target.result.split('\n');
        //clear vertices and faces
        this.vertices = [];
        this.faces =[];
        //processing lines based on either it is vertex or face
        for(let i=0; i < lines.length; i++){

            let parts = lines[i].split(' ');

            switch(parts[0]){

                case 'v': // if vertex always size of part is 4
                    this.vertices.push([Number(parts[1]), Number(parts[2]), Number(parts[3])]);
                    break;
                case 'f': // if face size is variable
                    let face= [];
                    for(let j=1; j < parts.length; j++){

                        face.push(Number(parts[j])-1); // decrease by 1 to match the real index in vertices array
                    }
                    this.faces.push(face);
                    break;
            }

        }

        //call back function when everything is loaded successfully

        if(typeof this.onloadend === 'function')
        {
            this.onloadend();
        }

    }

    DrawOnCanvas(context){
        //clear the screen and transformed vertices array
        context.clearRect(0,0, context.canvas.width, context.canvas.height);
        this.#vertices =[];
        //center offsets
        let offsetX = context.canvas.width/2;
        let offsetY = context.canvas.height/2;

        //transformation on the vertices
        for(let i=0; i < this.vertices.length; i++){

            let x = this.vertices[i][0];
            let y = this.vertices[i][1];
            let z = this.vertices[i][2];

            
            //scaling of vertices
            x *= this.scaleFactor;
            y *= this.scaleFactor;
            z *= this.scaleFactor;

            //rotation around y
            x = x*Math.cos(this.rotateY) - z*Math.sin(this.rotateY);
            z = x*Math.sin(this.rotateY) + z*Math.cos(this.rotateY);
            
            // translation on vertices to center it on the screen 
            x += offsetX;
            y += offsetY;

            this.#vertices.push([x , y , z]);
        }

        for(let i= 0 ; i <this.faces.length; i++){

            let face = this.faces[i];

            context.beginPath();

            context.moveTo(this.#vertices[face[0]][0], context.canvas.height-this.#vertices[face[0]][1]); // flipping

            for(let j=1; j < face.length; j++){

                let v = this.#vertices[face[j]];

                context.lineTo(v[0], context.canvas.height-v[1]);
            }
            context.stroke();
        }
    }

    LoadFromFile(file){
        this.fileReader.readAsText(file);
    }
}


// Main program section

function init() {
    console.log("init... Begin");
    // Get reference to the file input
    fileopen = document.getElementById("file-open");
    //Set a listener for the selected file change event
    fileopen.onchange = onChange;
    // Get reference to the button
    button = document.getElementById("proc-button");
    button.onclick = processImage;
    //declare the model 
    model = new Object();
    model.onloadend = onLoadEnd;
    // Get reference to the 2D context of the canvas
    canvas = document.getElementById("gl-canvas");
    context = canvas.getContext("2d");
    console.log("init... End");
}

function onLoadEnd(){
    model.DrawOnCanvas(context);
}

function onChange(e) {
    console.log("onChange... Begin");
    // Get the name of the selected file
    const files = fileopen.files;
    // Get the file name extension (pop removes the last element in the array)
    fileext = files[0].name.split('.').pop().toLowerCase();
    if (fileext == "obj") {
       model.LoadFromFile(files[0]);
    }
    console.log("onChange... End");
}

function onKeyDown(e){
    let key = e.key;
    
    switch(key){
        case '=': // scaleUp
            model.scaleFactor *=1.1;
            model.DrawOnCanvas(context);
            break;
        case '-': //scaleDown
            model.scaleFactor /=1.1;
            model.DrawOnCanvas(context);
            break;
        case 'ArrowRight': // rotate
            model.rotateY +=0.1;
            model.DrawOnCanvas(context);
            break;
        case 'ArrowLeft':
            model.rotateY -=0.1;
            model.DrawOnCanvas(context);
            break;
    }
}

function processImage() {
    console.log("Processing... Begin")
    // Get image data for all the canvas
    const imgdata = context.getImageData(0, 0, canvas.width, canvas.height);
    // Get the array containing the pixel data in the RGBA order
    const data = imgdata.data;
    for (var i = 0; i < data.length; i += 4) {
        // Manipulating colors (inverting)
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
    }
    context.putImageData(imgdata, 0, 0);
    console.log("Processing... End")
}
