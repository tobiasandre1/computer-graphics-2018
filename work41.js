var index = 0;
var theta = 2.0;
var modelViewMatrix, ctm;
var indices, vertices, pointsArray;
var subs;

var iso = mat4(1.732050808/2.449489743,0,-1.732050808/2.449489743,0,
				1/2.449489743,2/2.449489743,1/2.449489743,0,
				1.414213562/2.449489743,-1.414213562/2.449489743,1.414213562/2.449489743,0,
				0,0,0,1
				);

var threePoint = mat4(	0.5,0,0,0,
						0,0.5,0,0,
						0,0,0.5,0,
						0,0,1/2.4142,1.0);					
	
var twoPoint = mat4(	1.0,0,0,0,
						0,1.0,0,0,
						0,1/2.4142,1.0,0,
						0,0,0,1.0);	

var onePoint = mat4(	1.0,0,0,0,
						0,1.0,0,0,
						0,0,0,0,
						0,0,-0.5,1.0);							
				
var mvs = [iso, onePoint, twoPoint, threePoint];

var look, translate, scale, ort, pin, projection, temp;

var selected = 1;

var showClassic = true;

/**
* @param {Element} canvas. The canvas element to create a context from.
* @return {WebGLRenderingContext} The created context.
*/
function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}

window.onload = function init(){
	
		subs = 0;
		document.getElementById("inc").addEventListener("mousedown", function() {
			if(subs<10){
				subs += 1;
			}
			pointsArray = [];
			tetrahedron(va, vb, vc, vd, subs);
		});
		
		document.getElementById("dec").addEventListener("mousedown", function() {
			if(subs>0){
				subs -= 1;
			}
			pointsArray = [];
			tetrahedron(va, vb, vc, vd, subs);
		});
	
		canvas = document.getElementById("webgl");
	
		gl = WebGLUtils.setupWebGL(canvas);
	
		if(!gl){
			alert("No Webbu Gee Ellu")
		}
	
		gl.viewport(0,0,canvas.width,canvas.height);
		gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);	
		
		program = initShaders(gl, "vertex-shader", "fragment-shader");
		gl.useProgram(program);
		
		var va = vec4(0.0, 0.0, -1.0, 1);
		var vb = vec4(0.0, 0.942809, 0.333333, 1);
		var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
		var vd = vec4(0.816497, -0.471405, 0.333333, 1);
		
		pointsArray = [];
		
		tetrahedron(va, vb, vc, vd, subs);
		
		/*
		pointsArray.push(va);
		pointsArray.push(vb);
		pointsArray.push(vc);
		pointsArray.push(vd);
		index += 4;*/
		
		vertices = [
			vec3(0.0, 0.0, 0.0),
			vec3(0.0, 1.0, 0.0),
			vec3(1.0, 1.0, 0.0),
			vec3(1.0, 0.0, 0.0),
			vec3(0.0, 0.0, 1.0),
			vec3(0.0, 1.0, 1.0),
			vec3(1.0, 1.0, 1.0),
			vec3(1.0, 0.0, 1.0)
		];
		
		var colors = [
			0,0,0, 
			0,1,1, 
			0,1,1, 
			0,0,0,
			0,0,0, 
			0,1,1, 
			0,1,1, 
			0,0,0];
		
		indices = new Uint8Array(index);
		for(var i=0; i<indices.length; i++){
			indices[i] = i;
		}
		
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		var iBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
		
		
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
		
		ort = ortho(-1.0, 1.0, -1.0, 1.0, 0.01, 1000.0);	
		pin = perspective(45.0, canvas.width/canvas.height, 0.01, 1000.0);
			
		render();
	}

	function triangle(a, b, c){
			pointsArray.push(c);
			pointsArray.push(b);
			pointsArray.push(a);
			index += 3;
		}
		
	function divideTriangle(a, b, c, count)
	{
		if (count > 0) {
			var ab = normalize(mix(a, b, 0.5), true);
			var ac = normalize(mix(a, c, 0.5), true);
			var bc = normalize(mix(b, c, 0.5), true);
			divideTriangle(a, ab, ac, count - 1);
			divideTriangle(ab, b, bc, count - 1);
			divideTriangle(bc, c, ac, count - 1);
			divideTriangle(ab, bc, ac, count - 1);
		}
		else {	
			triangle(a, b, c);
		}
	}
		
	function tetrahedron(a, b, c, d, n)
	{
		divideTriangle(a, b, c, n);
		divideTriangle(d, c, b, n);
		divideTriangle(a, d, b, n);
		divideTriangle(a, c, d, n);
	}

	function render(){		
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		look = lookAt(vec3(5.0,0.0,0.0), vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));
		projection = mult(pin, look);
		
		theta += 0.01
			
		yrot = mat4(Math.cos(theta),0,Math.sin(theta),0,
					0,1,0,0,
					-Math.sin(theta),0,Math.cos(theta),0,
					0,0,0,1);
			
		
			
		ctm = mat4();
		ctm = mult(ctm, projection);
		ctm = mult(ctm, yrot);
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
		gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
			
		/*
		ctm = mult(ctm, mvs[2]);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
		gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0);
		
		ctm = mult(ctm, mvs[3]);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
		gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_BYTE, 0);*/
		
		
		requestAnimFrame(render);
	}
	