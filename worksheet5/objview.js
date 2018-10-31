var program;

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
	
	program.a_Position = gl.getAttribLocation(program, 'a_Position');
	program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
	program.a_Color = gl.getAttribLocation(program, 'a_Color');

	var objdata = initVertexBuffers(gl, program);
	
	readOBJFile('uglymonkey.obj', gl, objdata, 60, true);
	
	var currentAngle = 0.0;
	var projection = perspective(45.0, canvas.width/canvas.height, 0.01, 1000.0);
	var model = mat4();
	var view = vec3();
	render(gl, program, objdata, currentAngle, projection, model, view);
	
}

function initVertexBuffers(gl, program){
	var o = new Object();
	o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
	o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
	o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
	o.indexBuffer = gl.createBuffer();
	
	return o;
}

function readOBJFile(filename, gl, model, scale, reverse){
	var request = new XMLHttpRequest();
	
	request.onreadystatechange = function(){
		if (request.readyState === 4 && request.status !== 404){
			onReadOBJFile(request.responseText, filename, gl, model, scale, reverse);
		}
	}
	request.open('GET', filename, true);
	request.send();
}

var g_objDoc = null;
var g_drawingInfo = null;

function onReadOBJFile(fileString, fileName, gl, o, scale, reverse){
	var objDoc = new OBJDoc(fileName);
	var result = objDoc.parse(fileString, scale, reverse);
	if(!result){
		g_objDoc = null; g_drawingInfo = null;
		console.log("Somebody toucha my spaghett. Also OBJ file parsing error.");
		return;
	}
	g_objDoc = objDoc;
}

function createEmptyArrayBuffer(gl, a_attribute, num, type){
	var buffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);
	
	return buffer;
}

function render(gl, program, objdata, currentAngle, projection, model, view){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//Face culling
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	
	//Eye rotation
	eye = vec3(5*Math.cos(currentAngle), 0.0, -5*Math.sin(currentAngle));
	view = lookAt(eye, vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));	
	currentAngle += 0.02;
	
	//Modelview matrix
	ctm = model;
	ctm = mult(ctm, view);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
	gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
			
	requestAnimFrame(render);
}