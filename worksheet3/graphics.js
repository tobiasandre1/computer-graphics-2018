var index = 0;
var theta = 1.0;
var modelViewMatrix, ctm;
var indices, vertices;

var iso = mat4(1.732050808/2.449489743,0,-1.732050808/2.449489743,0,
				1/2.449489743,2/2.449489743,1/2.449489743,0,
				1.414213562/2.449489743,-1.414213562/2.449489743,1.414213562/2.449489743,0,
				0,0,0,1
				);
				
var twoPoint = mat4(	1.0,0,0,0,
						0,1.0,0,0,
						0,0,1.0,0,
						0,0,1/2.4142,1.0);				
				
var mvs = [iso, mult(twoPoint, iso)];
var selected = 1;

/**
* @param {Element} canvas. The canvas element to create a context from.
* @return {WebGLRenderingContext} The created context.
*/
function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}

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
		
		vertices = [
			vec3(-0.5, -0.5, 0.5),
			vec3(-0.5, 0.5, 0.5),
			vec3(0.5, 0.5, 0.5),
			vec3(0.5, -0.5, 0.5),
			vec3(-0.5, -0.5, -0.5),
			vec3(-0.5, 0.5, -0.5),
			vec3(0.5, 0.5, -0.5),
			vec3(0.5, -0.5, -0.5)
		];
		
		var colors = [
			0,0,0, 
			0,0,0, 
			0,1,0, 
			1,0,1,
			0,0,1, 
			1,0,0, 
			0,1,0, 
			1,0,1];
		
		indices = [
			1, 0, 3,
			3, 2, 1,
			2, 3, 7,
			7, 6, 2,
			3, 0, 4,
			4, 7, 3,
			6, 5, 1,
			1, 2, 6,
			4, 5, 6,
			6, 7, 4,
			5, 4, 0,
			0, 1, 5
		];
			
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		var iBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);
		
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, mat4());
		
		var mBuffer = gl.createBuffer();	
		gl.bindBuffer(gl.ARRAY_BUFFER,mBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(modelViewMatrix), gl.STATIC_DRAW);
		
		modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix")
		
		var cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
		
		var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);
		
		document.getElementById("iso").onclick = function(){
			selected = 0;
		}
		
		document.getElementById("pin").onclick = function(){
			selected = 1;
		}
		
			
		render();
	}


	function render(){		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		ctm = mat4();
		ctm = mult(ctm, mvs[selected]);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
		gl.drawElements(gl.TRIANGLE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0);
		requestAnimFrame(render);
	}
	