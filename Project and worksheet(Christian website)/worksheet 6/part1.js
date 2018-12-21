function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}

//var skd, ska, sks, sa, sle, kd, ka, ks, a, le;

window.onload = function init(){
	
	var canvas = document.getElementById("webgl");	
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
	
	//Data
	var drawinginfo = new Object();
	
	drawinginfo.vertices = [
		vec3(-4, -1, -1), 
		vec3(4, -1, -1), 
		vec3(4, -1, -21),
		vec3(-4, -1, -21)
	];
	
	drawinginfo.indices = [];
	
	//Texturing
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	var texSize = 64;
	var numRows = 8;
	var numCols = 8;
	var myTexels = new Uint8Array(4*texSize*texSize);
	for (var i = 0; i < texSize; ++i) {
		for (var j = 0; j < texSize; ++j) {
			var patchx = Math.floor(i/(texSize/numRows));
			var patchy = Math.floor(j/(texSize/numCols));
			
			var c = (patchx%2 !== patchy%2 ? 255 : 0);
			
			myTexels[4*i*texSize+4*j] = c;
			myTexels[4*i*texSize+4*j+1] = c;
			myTexels[4*i*texSize+4*j+2] = c;
			myTexels[4*i*texSize+4*j+3] = 255;
		}
	}
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);
	
	drawinginfo.texCoordsArray = [];
	drawinginfo.texCoord = [
		 vec2(-1.5, 0.0), 
		 vec2(2.5, 0.0), 
		 vec2(2.5, 10.0),
		 vec2(-1.5, 10.0)
	];
	
	function quad(a, b, c, d, drawinginfo)
	{
		//0,1,2,0,2,3
		//a,b,c,a,c,d
		
		drawinginfo.indices.push(a);
		drawinginfo.indices.push(b);
		drawinginfo.indices.push(c);
		drawinginfo.indices.push(a);
		drawinginfo.indices.push(c);
		drawinginfo.indices.push(d);
		
		drawinginfo.texCoordsArray.push(drawinginfo.texCoord[0]);
		drawinginfo.texCoordsArray.push(drawinginfo.texCoord[1]);
		drawinginfo.texCoordsArray.push(drawinginfo.texCoord[2]);
		drawinginfo.texCoordsArray.push(drawinginfo.texCoord[0]);
		drawinginfo.texCoordsArray.push(drawinginfo.texCoord[2]);
		drawinginfo.texCoordsArray.push(drawinginfo.texCoord[3]);
		
	}
	
	quad(0,1,2,3,drawinginfo);
	
	//Buffer initialization
	gl.program.a_Position = gl.getAttribLocation(gl.program, "a_Position");
	//gl.program.a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
	//gl.program.a_Color = gl.getAttribLocation(gl.program, "a_Color");
	gl.program.a_Tex = gl.getAttribLocation(gl.program, "a_Tex");
	
	gl.program.u_modelMatrix = gl.getUniformLocation(gl.program, "u_modelMatrix");
	gl.program.u_viewMatrix = gl.getUniformLocation(gl.program, "u_viewMatrix");
	gl.program.u_projectionMatrix = gl.getUniformLocation(gl.program, "u_projectionMatrix");
	
	gl.uniform1i(gl.getUniformLocation(gl.program, "u_texMap"), 0);
	
	var buffers = initVertexBuffers(gl);
	buffers.textureBuffer = createEmptyArrayBuffer(gl, gl.program.a_Tex, 2, gl.FLOAT);
	
	// Write date into the buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(drawinginfo.vertices),gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(drawinginfo.texCoordsArray),gl.STATIC_DRAW);
	
	// Write the indices to the buffer object
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(drawinginfo.indices), gl.STATIC_DRAW);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	
	
	//Projection / rotation variables
	var currentAngle = 0.0;
	var projectionMatrix = perspective(90.0, canvas.width/canvas.height, 0.01, 1000.0);
	var modelMatrix = mat4();
	var viewMatrix = mat4();
	
	
	function draw(){
		render(gl, drawinginfo, currentAngle, projectionMatrix, modelMatrix, viewMatrix);
		//currentAngle += 0.02;
		requestAnimFrame(draw);
	};
	//console.log(drawinginfo.indices.length);
	draw();
	
}

function render(gl, drawinginfo, currentAngle, projectionMatrix, modelMatrix, viewMatrix){
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//Face culling
	gl.cullFace(gl.BACK);
	
	//Eye rotation
	eye = vec3(0.0, 0.0, 1.0);
	//eye = vec3(5.0*Math.cos(currentAngle), 0.0, -5.0*Math.sin(currentAngle));
	viewMatrix = lookAt(eye, vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));	
	
	//Matrices
	gl.uniformMatrix4fv(gl.program.u_modelMatrix, false, flatten(modelMatrix));
	gl.uniformMatrix4fv(gl.program.u_projectionMatrix, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(gl.program.u_viewMatrix, false, flatten(viewMatrix));

	gl.drawElements(gl.TRIANGLES, drawinginfo.indices.length, gl.UNSIGNED_BYTE, 0);
}

//----------------------------------------------------------

function initVertexBuffers(gl){
	var o = new Object();
	o.vertexBuffer = createEmptyArrayBuffer(gl, gl.program.a_Position, 3, gl.FLOAT);
	//o.normalBuffer = createEmptyArrayBuffer(gl, gl.program.a_Normal, 3, gl.FLOAT); //Index warning
	//o.colorBuffer = createEmptyArrayBuffer(gl, gl.program.a_Color, 4, gl.FLOAT); //Index warning
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


