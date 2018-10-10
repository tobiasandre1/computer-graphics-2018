var index =0;
var index2 = 0;
var points = [];	
var triangles = []; 
//var circles =[];
//var vBuffer;
//var tBuffer;
window.onload = function init()
{
	canvas = document.getElementById("gl-canvas");
		
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl) {
		alert("WebGL isn't available");
	}
		
	gl.viewport(0,0,canvas.width, canvas.height);
	gl.clearColor(0.3921,0.5843,0.9294,1.0);

	program = initShaders(gl,"vertex-shader", "fragment-shader");
	gl.useProgram(program);
		
	

	// Create space in buffer for position
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 10000, gl.STATIC_DRAW);
	
	// Create space in buffer for triangle
	var tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 10000, gl.STATIC_DRAW);
	
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);
	
	
	// Create space in buffer for color
	var cBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,cBufferId);	 
	gl.bufferData(gl.ARRAY_BUFFER, 100000, gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vColor);	
	
	
	
	
	var bound;

	points = [];
	var addPoint = document.getElementById("addPoint");
	addPoint.addEventListener("click", function() {
		
		canvas.addEventListener("click", function() {
			bound = event.target.getBoundingClientRect();
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			var t = vec2(-1 + 2*(event.clientX-bound.left)/canvas.width,-1 + 2*(canvas.height-(event.clientY-bound.top))/canvas.height);
			
			points.push(t);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
			
			index++;
				
		});
		
		
		
		
	});	

	triangles = []; 
	var addTriangle = document.getElementById("addTriangle");
	addTriangle.addEventListener("click", function() {
		
		canvas.addEventListener("click", function() {
			bound = event.target.getBoundingClientRect();
			
			gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
			var T = vec2(-1 + 2*(event.clientX-bound.left)/canvas.width,-1 + 2*(canvas.height-(event.clientY-bound.top))/canvas.height);
			
			triangles.push(T);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW);
			
			index2++;

		});	
	});	
	/*
	circles = []; 
	var addCircle = document.getElementById("addCircle");
	addPoint.addEventListener("click", function() {
		
		canvas.addEventListener("click", function() {
			bound = event.target.getBoundingClientRect();
			
			gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
			var T = vec2(-1 + 2*(event.clientX-bound.left)/canvas.width,-1 + 2*(canvas.height-(event.clientY-bound.top))/canvas.height);
			
			triangles.push(T);
			gl.bufferData(gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW);
			
			index++;

		});	
	});			

	*/
		
		
	var myButton = document.getElementById("clearButton");
	myButton.addEventListener("click", function() {
		triangles = [];
		points = [];
		addPoint = [];
		addTriangle = [];
		index = 0;
		index2 = 0;
		render();
	});	
	
	
	
	
	var cIndex = 0;
	var colors = [
	vec4(0.0, 0.0, 0.0, 1.0), // black
	vec4(1.0, 0.0, 0.0, 1.0), // red
	vec4(1.0, 1.0, 0.0, 1.0), // yellow
	vec4(0.0, 1.0, 0.0, 1.0), // green
	vec4(0.0, 0.0, 1.0, 1.0), // blue
	vec4(1.0, 0.0, 1.0, 1.0), // magenta
	vec4(0.0, 1.0, 1.0, 1.0), // cyan
	vec4(1.0, 1.0, 1.0, 1.0)  // white
	];
	



	
	var m = document.getElementById("mymenu");
	m.addEventListener("click", function() { 
		cIndex = m.selectedIndex; 
	});


	
render();
}		
	

	
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	
	if(index>0){
	gl.drawArrays(gl.POINTS, 0, index);
	}
	
	if(index2>0){
	gl.drawArrays(gl.TRIANGLES, 0, index2);
	}
	
	
	
	window.requestAnimFrame(render, canvas);
}




