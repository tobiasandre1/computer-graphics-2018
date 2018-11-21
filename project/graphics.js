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
	
	gl.program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(gl.program);
	
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	
	var data = new Object();
	
	data.rotation = 0;
	data.rotationMatrix = mat4();
	data.pitch = 0;
	data.yaw = 0;
	data.roll = 0;
	
	
	//Data
	data.vertices = [
		vec3(-0.5, -0.5, -0.5),
		vec3(-0.5, 0.5, -0.5),
		vec3(0.5, 0.5, -0.5),
		vec3(0.5, -0.5, -0.5),
		vec3(-0.5, -0.5, 0.5),
		vec3(-0.5, 0.5, 0.5),
		vec3(0.5, 0.5, 0.5),
		vec3(0.5, -0.5, 0.5)
	];
	
	data.colors = [
		0,0,0, 
		0,1,1, 
		0,1,1, 
		0,0,0,
		0,0,0, 
		0,1,1, 
		0,1,1, 
		0,0,0
	];
	
	
	data.indices = [
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
	
	console.log(data);
	console.log(flatten(data.vertices));
	
	//Buffers
	gl.program.a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.program.a_Color = gl.getAttribLocation(gl.program, "a_Color");
	
	var buffers = initVertexBuffers(gl);
	
	//Position and color data
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(data.vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(data.colors), gl.STATIC_DRAW);
	
	//Indices for draw elements
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(data.indices), gl.STATIC_DRAW);

	var matrices = makeMatrices(data);
	
	//Draw all the things
	function draw(){
		render(gl, data, matrices);
		requestAnimFrame(draw);
	}
	draw();
	
}


function render(gl, data, matrices){		
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//Face culling
	gl.cullFace(gl.FRONT);
	
	//Rotation
	data.rotation += 0.5;
	data.rotationMatrix = rotateX(data.rotation);
	
	matrices.view = lookAt(vec3(5.0,5.0,5.0), vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));
	gl.uniformMatrix4fv(gl.program.u_view, false, flatten(matrices.view));
	
	
	/*
	//Matrices
	gl.uniformMatrix4fv(gl.program.u_projectionMatrix, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(gl.program.u_viewMatrix, false, flatten(viewMatrix));*/
	
	var ctm;
	for(var i = 0; i<matrices.modelarray.length; i++){
		ctm = mult(data.rotationMatrix, matrices.modelarray[i]);
		gl.uniformMatrix4fv(gl.program.u_model, false, flatten(ctm));
		gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_BYTE, 0);
	}
	
}
	
//----------------------------------------------------------

function initVertexBuffers(gl){
	var o = new Object();
	o.vertexBuffer = createEmptyArrayBuffer(gl, gl.program.a_Position, 3, gl.FLOAT);
	//o.normalBuffer = createEmptyArrayBuffer(gl, gl.program.a_Normal, 3, gl.FLOAT); //Index warning
	o.colorBuffer = createEmptyArrayBuffer(gl, gl.program.a_Color, 3, gl.FLOAT); //Index warning
	o.indexBuffer = gl.createBuffer();
	
	return o;
}

function createEmptyArrayBuffer(gl, a_attribute, num, type){
	var buffer = gl.createBuffer();
	
	//console.log(a_attribute);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);
	
	return buffer;
}

function makeMatrices(data){
	//Matrices (model for each cube/view/projections)
	var matrices = new Object();
	gl.program.u_projection = gl.getUniformLocation(gl.program,"u_projection");
	matrices.projection = perspective(45.0, canvas.width/canvas.height, 0.01, 1000.0);
	gl.uniformMatrix4fv(gl.program.u_projection, false, flatten(matrices.projection));
	
	gl.program.u_view = gl.getUniformLocation(gl.program,"u_view");
	matrices.view = lookAt(vec3(5.0,5.0,5.0), vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));
	gl.uniformMatrix4fv(gl.program.u_view, false, flatten(matrices.view));
	
	gl.program.u_model = gl.getUniformLocation(gl.program,"u_model");
	matrices.models = new Object();
	matrices.models.body = mat4(2,0,0,0,
								0,0.2,0,0,
								0,0,0.2,0,
								0,0,0,1);
	matrices.models.wing = mat4(0.3,0,0,0.15,
								0,0.04,0,-0.05,
								0,0,1.7,0,
								0,0,0,1.0);
	
	matrices.modelarray = [matrices.models.body, matrices.models.wing];
	
	return matrices;
}

	