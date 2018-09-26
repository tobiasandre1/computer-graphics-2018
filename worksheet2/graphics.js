var index = 0;
var triangleIndices;
var pointIndices;
var circleIndices;
var letteredIndices;
var vertexCircle = 100;

/**
* @param {Element} canvas. The canvas element to create a context from.
* @return {WebGLRenderingContext} The created context.
*/
function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}

window.onload = function init(){
	
		canvas = document.getElementById("webgl");
	
		gl = setupWebGL(canvas);
	
		if(!gl){
			alert("No Webbu Gee Ellu")
		}
	
		gl.viewport(0,0,canvas.width,canvas.height);
		gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);	//Background color
		
		program = initShaders(gl, "vertex-shader", "fragment-shader"); //Shader initialization
		gl.useProgram(program);
		
		
		var vBuffer = gl.createBuffer(); //Vertex buffer creation
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 20000,gl.STATIC_DRAW); //Max 10000 vector 2s
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		var cBuffer = gl.createBuffer(); //Color buffer creation
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 40000,gl.STATIC_DRAW); //Max 10000 vector 4s
		
		var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);
		
		//Variable to store bounding client, used to know where mouse cursor was when click happened
		var bound;
		
		//Html elements used to determine which type of shape and what color to draw
		var selector = document.getElementById("selector");
		
		var rslider = document.getElementById("rslide");
		var gslider = document.getElementById("gslide");
		var bslider = document.getElementById("bslide");
		
		//Variables to store calculated position vector and color vectors.
		var tpos;
		var tcol;

		//Global arrays to keep track of which indexes belong to which shapes
		triangleIndices = [];
		pointIndices = [];
		circleIndices = [];
		
		//Arrays to keep track of necessary points for shape drawing until ready to put entire shape into the Buffers
		var triangleVectors = [];
		var triangleColors = [];
		
		var circleVectors = [];
		var circleColors = [];
		var radius;
		
		var resetTriangles = true;
		var resetCircles = true;
		
		
		letteredIndices = [];
		
		//Made function to add a point to the array. Every point in the triangle and circle need to run this function again.
		var addPoint = function(letter, pos, col){
			letteredIndices.push(letter);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(pos));
				
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*index, flatten(col));
				
			index++;
		}
		
		//Onclick event on canvas initiates drawing
		canvas.addEventListener("click", function() {
			
			bound = event.target.getBoundingClientRect();
			
			tpos = vec2(	-1 + 2*(event.clientX-bound.left)/canvas.width,
						-1 + 2*(canvas.height-(event.clientY-bound.top))/canvas.height);
						
			tcol = vec4(rslider.value, gslider.value, bslider.value, 1.0);
			
			resetTriangles = true;
			resetCircles = true;
			
			if(selector.value == "point"){
				
				//pointIndices.push(index);
				addPoint("p", tpos, tcol);
				
			}
			
			else if(selector.value == "triangle"){
				triangleVectors.push(tpos);
				triangleColors.push(tcol);
					
				if(triangleVectors.length == 3){
					//triangleIndices.push(index); //Add index to list so we can know which indices to draw triangles at
					
					for(var i = 0; i<3; i++){
						addPoint("t", triangleVectors[i], triangleColors[i])
					}
					
				} else {
					resetTriangles = false;
				}
			}
			
			else if(selector.value == "circle"){
				circleVectors.push(tpos);
				circleColors.push(tcol);
				
				if(circleVectors.length == 2){
					radius = Math.sqrt(Math.pow(circleVectors[1][0]-circleVectors[0][0], 2) + Math.pow(circleVectors[1][1]-circleVectors[0][1], 2));
					//alert(radius);
					
					//Add center as point in circle
					circleIndices.push(index);
					addPoint("c", circleVectors[0], circleColors[0]);
					
					
					for(var i = 0; i<vertexCircle; i++){
						//circleIndices.push(index);
						
						tpos = vec2(radius * Math.cos((i / vertexCircle) * 2.0 * Math.PI)+circleVectors[0][0], radius * Math.sin((i / vertexCircle) * 2.0 * Math.PI)+circleVectors[0][1])
						
						addPoint("c", tpos, tcol);
						
					}
					
					tpos = vec2(radius * Math.cos(((vertexCircle+1) / vertexCircle) * 2.0 * Math.PI)+circleVectors[0][0], radius * Math.sin(((vertexCircle+1) / vertexCircle) * 2.0 * Math.PI)+circleVectors[0][1])
						
					addPoint("c", tpos, tcol);
					
					
				} else {
					resetCircles = false;
				}
				
			}
			
			//By default, the triangle array and the circle arrays are cleared if it's not a situation where we specifically tell them not to clear.
			if(resetTriangles){
				triangleVectors = [];
				triangleColors = [];
			}
			if(resetCircles){
				circleVectors = [];
				circleColors = [];
			}
		
		});

		
		//Clearbutton
		var clearButton = document.getElementById("clear");
		
		clearButton.addEventListener("mousedown", function() {
			index = 0;
			letteredIndices = [];
			render();
		});
	
		render();
	}


	function render(){		
		gl.clear(gl.COLOR_BUFFER_BIT);
		if(index > 0){
			var j = 0;
			
			for(var i = 0; i<letteredIndices.length;){
				if(letteredIndices[i] == "p"){
					while(i+j < letteredIndices.length && letteredIndices[i+j] == "p"){
						j++;
					}
					
					gl.drawArrays(gl.POINTS, i,j);
					i = i+j;
					j = 0;
				} else if(letteredIndices[i] == "t"){
					gl.drawArrays(gl.TRIANGLES, i,3);
					i = i+3;
				} else if(letteredIndices[i] == "c"){
					gl.drawArrays(gl.TRIANGLE_FAN, i, 2+vertexCircle);
					i = i+2+vertexCircle;
				}
			}
			
		}
		window.requestAnimFrame(render, canvas);
	}
	
	
	/* OLD RENDER FUNCTION
			var j;
			var dist;
			
			for(var i = 0; i < pointIndices.length;){
				
				//Optimization to make sure that drawarrays isn't run for each point, but instead every interval of point indices in the buffer
				j = 0;
				dist = 0;
				while(dist == 0){
					j++;
					//If the array is out of bounds or if the next point index is not the neighbour of the previous, then the distance is j
					//We either encounter a jump in the point intervals, or j reaches the end of the array
					if(i+j >= pointIndices.length || pointIndices[i+j] - pointIndices[i] != j){
						dist = j;
					}
					
				}
				
				gl.drawArrays(gl.POINTS, pointIndices[i],dist);
				i = i + dist;
			}
			for(var i = 0; i<triangleIndices.length; i++){
				gl.drawArrays(gl.TRIANGLES, triangleIndices[i],3);
			}
			//alert(index);
			//gl.drawArrays(gl.POINTS, 0, index);
			
			//gl.drawArrays (gl.TYPE of render, start index, end index/step/how many indices to move forward)?
			*/