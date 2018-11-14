function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}

var obj_filename = 'uglymonkey.obj';
var skd, ska, sks, sa, sle, kd, ka, ks, a, le;

window.onload = function init(){
	
	var canvas = document.getElementById("webgl");
	skd = document.getElementById("kd");
	ska = document.getElementById("ka");
	sks = document.getElementById("ks");
	sa = document.getElementById("a");
	sle = document.getElementById("le");
	
	kd = skd.value/100;
	ka = ska.value/100;
	ks = sks.value/100;
	a = sa.value/5;
	le = sle.value/100;
	
	skd.addEventListener("input", function(){
		kd = skd.value/100;
		sendcoefficients();
	});
	
	ska.addEventListener("input", function(){
		ka = ska.value/100;
		sendcoefficients();
	});
		
	sks.addEventListener("input", function(){
		ks = sks.value/100;
		sendcoefficients();
	});
	
	sa.addEventListener("input", function(){
		a = sa.value/5;
		sendcoefficients();
	});
	
	sle.addEventListener("input", function(){
		le = sle.value/100;
		sendcoefficients();
	});
	
	function sendcoefficients(){
		gl.uniform1f(gl.getUniformLocation(gl.program, "kd"), kd);
		gl.uniform1f(gl.getUniformLocation(gl.program, "ka"), ka);
		gl.uniform1f(gl.getUniformLocation(gl.program, "ks"), ks);
		gl.uniform1f(gl.getUniformLocation(gl.program, "a"), a);
		gl.uniform1f(gl.getUniformLocation(gl.program, "le"), le);	
	}
	
	var gl = WebGLUtils.setupWebGL(canvas);
	
	if(!gl){
		alert("No Webbu Gee Ellu")
	}
	
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);	
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
		
	gl.program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(gl.program);
	
	gl.program.a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.program.a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
	gl.program.a_Color = gl.getAttribLocation(gl.program, "a_Color");
	gl.program.u_modelMatrix = gl.getUniformLocation(gl.program, "u_modelMatrix");
	gl.program.u_viewMatrix = gl.getUniformLocation(gl.program, "u_viewMatrix");
	gl.program.u_projectionMatrix = gl.getUniformLocation(gl.program, "u_projectionMatrix");
	
	var objdata = initVertexBuffers(gl);
	readOBJFile(obj_filename, gl, objdata, 0.5, true);
	
	var currentAngle = 0.0;
	var projectionMatrix = perspective(45.0, canvas.width/canvas.height, 0.01, 1000.0);
	var modelMatrix = mat4();
	var viewMatrix = mat4();
	
	function draw(){
		render(gl, objdata, currentAngle, projectionMatrix, modelMatrix, viewMatrix);
		//currentAngle += 0.02;
		requestAnimFrame(draw);
	};
	
	sendcoefficients();
	draw();
	
}

function render(gl, objdata, currentAngle, projectionMatrix, modelMatrix, viewMatrix){
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
		// OBJ and all MTLs are available
		console.log("Attempting to assign value to drawingInfo");
		g_drawingInfo = onReadComplete(gl, objdata, g_objDoc);
	}
	if (!g_drawingInfo) {
		console.log("Object data not available");
		return;
	}
	
	//Face culling
	gl.cullFace(gl.BACK);
	
	//Eye rotation
	eye = vec3(0.0, 0.0, 5.0);
	//eye = vec3(5.0*Math.cos(currentAngle), 0.0, -5.0*Math.sin(currentAngle));
	viewMatrix = lookAt(eye, vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));	
	
	//Matrices
	gl.uniformMatrix4fv(gl.program.u_modelMatrix, false, flatten(modelMatrix));
	gl.uniformMatrix4fv(gl.program.u_projectionMatrix, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(gl.program.u_viewMatrix, false, flatten(viewMatrix));
	
	gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------

function initVertexBuffers(gl){
	var o = new Object();
	o.vertexBuffer = createEmptyArrayBuffer(gl, gl.program.a_Position, 3, gl.FLOAT);
	o.normalBuffer = createEmptyArrayBuffer(gl, gl.program.a_Normal, 3, gl.FLOAT); //Index warning
	o.colorBuffer = createEmptyArrayBuffer(gl, gl.program.a_Color, 4, gl.FLOAT); //Index warning
	o.indexBuffer = gl.createBuffer();
	
	return o;
}

function createEmptyArrayBuffer(gl, a_attribute, num, type){
	var buffer = gl.createBuffer();
	
	console.log(a_attribute);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);
	
	return buffer;
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

 function onReadComplete(gl, model, objDoc) {
	// Acquire the vertex coordinates and colors from OBJ file
	var drawingInfo = objDoc.getDrawingInfo();
 
	// Write date into the buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices,gl.STATIC_DRAW);
 
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);
 
	gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);
 
	// Write the indices to the buffer object
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);
	
	return drawingInfo;
 } 

