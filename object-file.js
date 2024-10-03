/*
    Code sample for CSCI 2408 Computer Graphics 
    (c)2022-24 by Araz Yusubov 
    DISCLAIMER: All code examples we will look at are quick hacks intended to present working prototypes.
    Hence they do not follow best practice of programming or software engineering.    
*/
var canvas;
var context;
var fileopen;

window.onload = init;

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
    // Get reference to the 2D context of the canvas
    canvas = document.getElementById("gl-canvas");
    context = canvas.getContext("2d");
    console.log("init... End");
}

function onChange(e) {
    console.log("onChange... Begin");
    // Get the name of the selected file
    const files = fileopen.files;
    // Get the file name extension (pop removes the last element in the array)
    fileext = files[0].name.split('.').pop().toLowerCase();
    if (fileext == "obj") {
        
    }
    console.log("onChange... End");
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