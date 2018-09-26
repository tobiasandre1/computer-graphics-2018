var index = 0;
var triangleIndices;
var pointIndices;

window.onload = function init(){
	
		canvas = document.getElementById("webgl");
	
		gl = WebGLUtils.setupWebGL(canvas);
	
		if(!gl){
			alert("No Webbu Gee Ellu")
		}
	
		gl.viewport(0,0,canvas.width,canvas.height);
		gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);	
		
		program = initShaders(gl, "vertex-shader", "fragment-shader");
		gl.useProgram(program);
		
		
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 2000,gl.STATIC_DRAW); //Max 1000 elements
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		var cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, 4000,gl.STATIC_DRAW); //Max 1000 elements
		
		var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);
		
		var bound;
		
		var selector = document.getElementById("selector");
		
		var rslider = document.getElementById("rslide");
		var gslider = document.getElementById("gslide");
		var bslider = document.getElementById("bslide");
		
		var tpos;
		var tcol;

		triangleIndices = [];
		pointIndices = [];
		
		var triangleVectors = [];
		var triangleColors = [];
		
		canvas.addEventListener("click", function() {
			
			bound = event.target.getBoundingClientRect();
			
			tpos = vec2(	-1 + 2*(event.clientX-bound.left)/canvas.width,
						-1 + 2*(canvas.height-(event.clientY-bound.top))/canvas.height);
						
			tcol = vec4(rslider.value, gslider.value, bslider.value, 1.0);
			
			if(selector.value == "point"){
				
				pointIndices.push(index);
				
				gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
				gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(tpos));
				
				gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
				gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*index, flatten(tcol));
				
				triangleVectors = [];
				triangleColors = [];
				
				index++;
				
			}
			
			if(selector.value == "triangle"){
				triangleVectors.push(tpos);
				triangleColors.push(tcol);
					
				if(triangleVectors.length == 3){
					//alert("draw");
					triangleIndices.push(index); //Add index to list so we can know which indices to draw triangles at
					
					for(var i = 0; i<3; i++){
						gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
						gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(triangleVectors[i]));
						
						gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
						gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*index, flatten(triangleColors[i]));
						
						index++;
					}
					
					//alert(triangleIndices);
					
					triangleVectors = [];
					triangleColors = [];
					
				}
			}
		
		});

		
		//Clearbutton
		var clearButton = document.getElementById("clear");
		
		clearButton.addEventListener("mousedown", function() {
			index = 0;
			render();
		});
	
		render();
	}


	function render(){		
		gl.clear(gl.COLOR_BUFFER_BIT);
		if(index > 0){
			
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
		}
		window.requestAnimFrame(render, canvas);
	}