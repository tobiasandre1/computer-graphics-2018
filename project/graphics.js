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
	
	data.rotspeed = 1.0/50.0;
	data.rotx = 0;
	data.roty = 0;
	data.rotz = 0;
	data.rotationMatrix = mat4();
	data.flightvals = [0, 0, 0]; //Pitch,Roll,Yaw
	
	
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
		0.1,0,0, 
		0,1,1, 
		0,1,1, 
		0.1,0,0,
		0.1,0,0, 
		0,1,1, 
		0,1,1, 
		0.1,0,0
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
	
	
	data.normals = calculate_normals(data.indices, data.vertices)
	console.log(data);
	//console.log(flatten(data.vertices));
	
	//Buffers
	gl.program.a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.program.a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
	gl.program.a_Color = gl.getAttribLocation(gl.program, "a_Color");
	
	var buffers = initVertexBuffers(gl);
	
	//Position and color data
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(data.vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(data.colors), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(data.normals), gl.STATIC_DRAW);
	
	//Indices for draw elements
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(data.indices), gl.STATIC_DRAW);

	
	//Matrices
	var matrices = makeMatrices(data);
	
	
	//Inputs
	var input = new Object();
	input.pitch = document.getElementById("pitch");
	input.roll = document.getElementById("roll");
	input.yaw = document.getElementById("yaw");
	input.allinputs = [input.pitch, input.roll, input.yaw];
	
	for(var i=0; i<input.allinputs.length; i++){
		input.allinputs[i].addEventListener("input", move(i));
	}
	
	function move(i){
		return function(){
			data.flightvals[i] = (input.allinputs[i].value-50);
			matrices = makeMatrices(data);
		}
	}
	
	var le, ka, kd, ks, a;
	//sendcoefficients(le, ka, kd, ks, a);
	sendcoefficients(0.9,0.6,1.0,0.6,0.9);
	
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
	data.rotx += -data.flightvals[1]*data.rotspeed;
	data.roty += -data.flightvals[2]*data.rotspeed;
	data.rotz += -data.flightvals[0]*data.rotspeed;
	
	matrices.view = lookAt(vec3(5.0,5.0,5.0), vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));
	
	matrices.ctm = mat4();
	matrices.ctm = mult(matrices.ctm, rotateX(data.rotx));
	matrices.ctm = mult(matrices.ctm, rotateY(data.roty));
	matrices.ctm = mult(matrices.ctm, rotateZ(data.rotz));
	
	//matrices.view = mult(matrices.view , matrices.ctm);
	
	gl.uniformMatrix4fv(gl.program.u_view, false, flatten(matrices.view));
	
	
	/*
	//Matrices
	gl.uniformMatrix4fv(gl.program.u_projectionMatrix, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(gl.program.u_viewMatrix, false, flatten(viewMatrix));*/
	
	for(var i = 0; i<matrices.modelarray.length; i++){
		gl.uniformMatrix4fv(gl.program.u_model, false, flatten(mult(matrices.ctm, matrices.modelarray[i])));
		gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_BYTE, 0);
	}
	
}
	
//----------------------------------------------------------

function initVertexBuffers(gl){
	var o = new Object();
	o.vertexBuffer = createEmptyArrayBuffer(gl, gl.program.a_Position, 3, gl.FLOAT);
	o.normalBuffer = createEmptyArrayBuffer(gl, gl.program.a_Normal, 3, gl.FLOAT); //Index warning
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
	matrices.flapwidth = 0.2;
	matrices.flapheight = 0.04;
	
	matrices.models.body = mat4(2,0,0,0,
								0,0.2,0,0,
								0,0,0.2,0,
								0,0,0,1);
	matrices.models.wing = mat4(0.3,0,0,0.15,
								0,0.04,0,-0.05,
								0,0,1.7,0,
								0,0,0,1.0);
	matrices.models.flap = mat4(matrices.flapwidth,0,0,0,
								0,matrices.flapheight,0,0,
								0,0,0.5,0,
								0,0,0,1.0);
	
	matrices.models.backwing = mat4(0.25,0,0,-0.874,
									0,0.04,0,-0.05,
									0,0,1,0,
									0,0,0,1);
									
	matrices.models.elevatorflap = mat4(0.15,0,0,0,
									0,0.04,0,0,
									0,0,0.3,0,
									0,0,0,1);
									
	matrices.models.rudder = mat4(0.3,0,0,-0.849,
									0,0.4,0,0.25,
									0,0,0.04,0,
									0,0,0,1);
	
	matrices.models.rudderflap = mat4(0.08,0,0,0,
									0,0.3,0,0.0,
									0,0,0.04,0,
									0,0,0,1);
	
	
	
	
	
	matrices.modelarray = [
			matrices.models.body, 
			matrices.models.wing, 
			matrices.models.backwing,
			matrices.models.rudder,
			rotting(data, 1, 1, matrices.models.flap, 'Z', matrices.flapwidth, translate(0, -0.05, 0.5)),
			rotting(data, 1, -1, matrices.models.flap, 'Z', matrices.flapwidth, translate(0, -0.05, -0.5)),
			rotting(data, 0, 1, matrices.models.elevatorflap, 'Z', matrices.flapwidth, translate(-0.95, -0.05, 0.3)),
			rotting(data, 0, 1, matrices.models.elevatorflap, 'Z', matrices.flapwidth, translate(-0.95, -0.05, -0.3)),
			rotting(data, 2, 1, matrices.models.rudderflap, 'Y', matrices.flapwidth, translate(-0.94, 0.275, 0))
			
		];
	
	return matrices;
}

function rotting(data, fv, mod, matrix, axis, width, offset){
	var result;
	var theta = data.flightvals[fv]*mod;
	if(axis == 'Z'){
		result = mult(translate(-width/2,0,0),rotateZ(theta));
		result = mult(result, matrix);
		result = mult(translate(width/2,0,0), result);
		result = mult(translate(-Math.cos(radians(theta))*width/2, Math.sin(radians(theta))*width/2,0),result);
		result = mult(offset, result);
	}
	else if(axis == 'Y'){
		result = mult(translate(-width/2,0,0),rotateY(theta));
		result = mult(result, matrix);
		result = mult(translate(width/2,0,0), result);
		result = mult(translate(-Math.cos(radians(theta))*width/2, 0,-Math.sin(radians(theta))*width/2),result);
		result = mult(offset, result);
	}
	
	return result;
}	

function sendcoefficients(le, ka, kd, ks, a){
	gl.uniform1f(gl.getUniformLocation(gl.program, "kd"), kd);
	gl.uniform1f(gl.getUniformLocation(gl.program, "ka"), ka);
	gl.uniform1f(gl.getUniformLocation(gl.program, "ks"), ks);
	gl.uniform1f(gl.getUniformLocation(gl.program, "a"), a);
	gl.uniform1f(gl.getUniformLocation(gl.program, "le"), le);	
}

function calculate_normals(indices,vertices){
	var normalsArray = [];
	var temp = {};
	for(var i = 0; i < indices.length; i += 3){
		//Skal være 0 i sidste koordinat hvis 4d ellers fejl
		//console.log(i);
		a = vertices[indices[i]];
		b = vertices[indices[i+1]];
		c = vertices[indices[i+2]];
		
		one = vectoradd(b,a,-1);
		two = vectoradd(c,a,-1);
		
		n = cross(one, two);
		//console.log(n);
		
		normalsArray.push(n);
		normalsArray.push(n);
		normalsArray.push(n);
		
		
		for(var j=0; j<3; j++){
			if(temp[indices[i+j]] == null){
				temp[indices[i+j]] = vec3(0,0,0);
			}
			temp[indices[i+j]] = vectoradd(temp[indices[i+j]], n, 1); 
		}
		
		/*
		normalsArray.push(a[0], a[1], a[2]);
		normalsArray.push(b[0], b[1], b[2]);
		normalsArray.push(c[0], c[1], c[2]);*/
	}
	
	for(var i = 0; i<indices.length; i++){
		normalsArray.push(temp[indices[i]]);
	}
	
	//console.log(temp);
	return normalsArray;
}

function vectoradd(a,b,mod){
	var result = vec3(b[0]+mod*a[0], b[1]+mod*a[1], b[2]+mod*a[2]);
	return result;
}

function vectordiv(a,mod){
	var result = vec3(a[0]/mod, a[1]/mod, a[2]/mod);
	return result;
}