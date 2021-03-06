var theta = [0, 0, 0];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = [];
var modelViewMatrix;
var ctm;

var look = mat4();


var per = perspective(45, 1, 0.001, 1000);			
					
var lookOne = lookAt( vec3(2,0,0), vec3(0,0,0), vec3(0,1,0) );
var lookTwo = lookAt( vec3(2,2,0), vec3(0,0,0), vec3(0,1,0) );
var lookThree = lookAt( vec3(2,2,2), vec3(0,0,0), vec3(0,1,0) );


window.onload = function init()
{
	canvas = document.getElementById("gl-canvas");
		
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl) {alert("WebGL isn't available");}
		
	gl.viewport(0,0,canvas.width, canvas.height);
	gl.clearColor(0.3921,0.5843,0.9294,1.0);

	program = initShaders(gl,"vertex-shader", "fragment-shader");
	gl.useProgram(program);
	
	vertices = [
	
	vec3(-0.5, -0.5, -0.5),
	vec3(-0.5, 0.5, -0.5),
	vec3(0.5, 0.5, -0.5),
	vec3(0.5, -0.5, -0.5),
	vec3(-0.5, -0.5, 0.5),
	vec3(-0.5, 0.5, 0.5),
	vec3(0.5, 0.5, 0.5),
	vec3(0.5, -0.5, 0.5)
	];

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
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);	
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);
	
	var vPositionLocationId = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPositionLocationId,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPositionLocationId);
	
	

	
	var a = document.getElementById("ButtonX")
	a.addEventListener("click", function() {look = lookOne; }, false);
	var b = document.getElementById("ButtonY")
	b.addEventListener("click", function() { look = lookTwo; }, false);
	var c = document.getElementById("ButtonZ")
	c.addEventListener("click", function() {look = lookThree; }, false);

		
	modelViewMatrix = mat4();
	modelViewMatrix = mult(modelViewMatrix, rotateX(theta[xAxis]));
	modelViewMatrix = mult(modelViewMatrix, rotateY(theta[yAxis]));
	modelViewMatrix = mult(modelViewMatrix, rotateZ(theta[zAxis]));

	var mBuffer = gl.createBuffer();	
	gl.bindBuffer(gl.ARRAY_BUFFER,mBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(modelViewMatrix), gl.STATIC_DRAW);
	
	modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix")
	
	
	
	
render();
}		
	
	
function render()
{
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


ctm = per;
ctm = mult(ctm, look);
theta[axis] += 1.0;
ctm = mult(ctm, rotateX(theta[xAxis]));
ctm = mult(ctm, rotateY(theta[yAxis]));
ctm = mult(ctm, rotateZ(theta[zAxis]));

gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
gl.drawElements(gl.LINE_LOOP, indices.length,gl.UNSIGNED_BYTE, 0);

requestAnimFrame(render);
}