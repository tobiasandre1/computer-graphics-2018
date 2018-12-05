function setupWebGL(canvas) {
    return WebGLUtils.setupWebGL(canvas);
}
var g_objDoc = null;
var g_drawingInfo = null;
var model;		
var gl;

		
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
		program.vNormal = gl.getAttribLocation(program, "vNormal");
		program.vColor = gl.getAttribLocation(program, "vColor");
		

		var model = initVertexBuffers(gl, program);
		
		
		readOBJFile('../torus.obj', gl, model, 0.01, true);
	
		

		function initVertexBuffers(gl, program){
			var o = new Object();
			o.vertexBuffer = createEmptyArrayBuffer(gl,program.vPosition,3,gl.FLOAT);
			o.normalBuffer = createEmptyArrayBuffer(gl,program.vNormal,3,gl.FLOAT);
			o.colorBuffer = createEmptyArrayBuffer(gl,program.vColor,3,gl.FLOAT);
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
		
		// OBJ File has been read completely
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
 
  g_drawingInfo= drawingInfo;
 }
	
		
	render(); 
}
		
function render(){
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
 // OBJ and all MTLs are available
 g_drawingInfo = onReadComplete(gl, model, g_objDoc);
 }
 if (!g_drawingInfo) return;
gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length,gl.UNSIGNED_SHORT, 0);
requestAnimFrame(render);
}



	
	