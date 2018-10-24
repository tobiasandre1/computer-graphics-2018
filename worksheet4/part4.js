var modelViewMatrix, ctm;
var vertices, pointsArray, normalsArray;
var subs;
var look, translate, scale, ort, pin, projection, temp;
var kd, ka, ks, a, le;
var slider;

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
	
		canvas = document.getElementById("webgl");
	
		gl = WebGLUtils.setupWebGL(canvas);
	
		if(!gl){
			alert("No Webbu Gee Ellu")
		}
	
		gl.viewport(0,0,canvas.width,canvas.height);
		gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);	
		
		program = initShaders(gl, "vertex-shader", "fragment-shader");
		gl.useProgram(program);
		
		var va = vec4(0.0, 0.0, 1.0, 1);
		var vb = vec4(0.0, 0.942809, -0.333333, 1);
		var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
		var vd = vec4(0.816497, -0.471405, -0.333333, 1);
		
		pointsArray = [];
		normalsArray = [];
		subs = 5;
		tetrahedron(va, vb, vc, vd, subs);
		
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		var vNBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vNBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
		
		var vNormal = gl.getAttribLocation(program, "vNormal");
		gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vNormal);
		
		
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, mat4());
		
		var mBuffer = gl.createBuffer();	
		gl.bindBuffer(gl.ARRAY_BUFFER,mBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(modelViewMatrix), gl.STATIC_DRAW);
		
		modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix")
		
		ort = ortho(-1.0, 1.0, -1.0, 1.0, 0.01, 1000.0);	
		pin = perspective(45.0, canvas.width/canvas.height, 0.01, 1000.0);
		
		document.getElementById("inc").addEventListener("mousedown", function() {
			if(subs<10){
				subs += 1;
			}
			pointsArray = [];
			normalsArray = [];
			tetrahedron(va, vb, vc, vd, subs);
			restart(vBuffer, vNBuffer);
		});
		
		document.getElementById("dec").addEventListener("mousedown", function() {
			if(subs>0){
				subs -= 1;
			}
			pointsArray = [];
			normalsArray = [];
			tetrahedron(va, vb, vc, vd, subs);
			restart(vBuffer, vNBuffer);
		});
		
		document.getElementById("kd").addEventListener("input", function(){
			kd = document.getElementById("kd").value/100;
		});
		
		document.getElementById("ka").addEventListener("input", function(){
			ka = document.getElementById("ka").value/100;
		});
			
		document.getElementById("ks").addEventListener("input", function(){
			ks = document.getElementById("ks").value/100;
		});
		
		document.getElementById("a").addEventListener("input", function(){
			a = document.getElementById("a").value;
		});
		
		document.getElementById("le").addEventListener("input", function(){
			le = document.getElementById("le").value;
		});

		
		render();
	}

	function triangle(a, b, c){
			pointsArray.push(a);
			pointsArray.push(b);
			pointsArray.push(c);
			
			//Skal være 0 i sidste koordinat ellers fejl
			normalsArray.push(vec4(a[0], a[1], a[2], 0.0));
			normalsArray.push(vec4(b[0], b[1], b[2], 0.0));
			normalsArray.push(vec4(c[0], c[1], c[2], 0.0));
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
	
	function restart(vBuffer, vNBuffer){
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vNBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
	}
	
	function sendcoefficients(){
		
	}

	var theta = 0.0;
	function render(){		
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		
		look = lookAt(vec3(5.0,0.0,0.0), vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));
		projection = mult(pin, look);
			
		theta += 0.05
			
		yrot = mat4(Math.cos(theta),0,Math.sin(theta),0,
					0,1,0,0,
					-Math.sin(theta),0,Math.cos(theta),0,
					0,0,0,1);
		
		ctm = mat4();
		ctm = mult(ctm, projection);
		ctm = mult(ctm, yrot);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
		gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
		
		
		requestAnimFrame(render);
	}
	