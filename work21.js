var index =0;
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
	
	var addPoint = document.getElementById("addPoint");
	addPoint.addEventListener("click", function() {
		
		canvas.addEventListener("click", function() {
			bound = event.target.getBoundingClientRect();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			var t = vec2(-1 + 2*(event.clientX-bound.left)/canvas.width,-1 + 2*(canvas.height-(event.clientY-bound.top))/canvas.height);
			gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(t));
			gl.bindBuffer(gl.ARRAY_BUFFER,cBufferId);	 
			gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*index, flatten(colors[cIndex]));	
			index++;
		
		});
		
	});	

	
	
	
	
	
	
	
	var addTri = document.getElementById("addTriangle");
	addTri.addEventListener("click", function() {
		

		

			canvas.addEventListener("click", function() {
				bound = event.target.getBoundingClientRect();
				gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
				var t = vec2(-1 + 2*(event.clientX-bound.left)/canvas.width,-1 + 2*(canvas.height-(event.clientY-bound.top))/canvas.height);
				gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(t));
				index++;
				
				
				var colorsArray = [ ];
				for(var index = 0; index < 3; ++ind) {
					triangleArray.push(t);
				}
			});

		
	});		
		
		
		
		
		
		
		
		
	
	
		
		
	var myButton = document.getElementById("clearButton");
	myButton.addEventListener("click", function() {
		index = 0; 
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
	window.requestAnimFrame(render, canvas);
}




