function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);


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
		
	
		
		program.vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		program.vNormal = gl.getAttribLocation(program, "vNormal");
		gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vNormal);
		
		program.vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);
		
		var model = initVertexBuffers(gl, program);
		
		readOBJFile('../torus.obj', gl, model, 60, true);

		
		function initVertexBuffer(gl, program){
			var o = new object();
			o.vertexBuffer = createEmptyBuffer(gl,program.vPosition,3,gl.FLOAT);
			o.normalBuffer = createEmptyBuffer(gl,program.vNormal,3,gl.FLOAT);
			o.colorBuffer = createEmptyBuffer(gl,program.vColor,3,gl.FLOAT);
			
			o.indexBuffer = gl.createBuffer();
		return o;
		}
		
		
		function createEmptyArrayBuffer(gl,vattribute, num, type){
			var buffer = gl.createBuffer();
			
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(vattribute,num,type,false,0,0);
			gl.enableVertexAttribArray(vattribute);
			
			return buffer;
		}
		
		function readOBJFile(fileName,gl,model,scale,reverse){
			var request = new XMLHttpRequest();
			
			request.onreadystatechange = function() {
				if (request.readyState === 4 && request.status !== 404) {
					onReadOBJFile(request.responseText, fileName, gl, model, scale, reverse);
				}
			}
			
			request.open('GET', fileName,true);
			request.send();
		}
		
		var g_objDoc = null;
		var g_drawingInfo = null;
		
		
		function onReadOBJFile(fileString, fileName, gl, o, scale,reverse) {
			var objDoc = new OBJDoc(fileName);
			var result = objDoc.parse(fileString, scale, reverse);
			
			if(!result){
				g_objDoc.parse(fileString,scale,reverse);
				console.log("OBJ file parsing error.");
				return;
			}
		g_objDoc = objDoc;
		}
		
		render();
	}


	var theta = 0.0;
	function render(){		
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		
		gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
		
		
		requestAnimFrame(render);
	}
	