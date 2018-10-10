window.onload = function init()
{
		canvas = document.getElementById("gl-canvas");
		
		gl = WebGLUtils.setupWebGL(canvas);
		if(!gl) {
			alert("WebGL isn't available");
		}
		
		gl.viewport(0,0,canvas.width, canvas.height);
		gl.clearColor(0.3921,0.5843,0.9294,1.0);

		program = initShaders(gl,"vertex-shader", "fragment-shader");
		gl.useProgram(program);
		
		
var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER,buffer);	
	
	var vertices2 = [
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, 1)
	];
	

gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);


		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
		gl.enableVertexAttribArray(vPosition);
render();
}		
	
function render()
{
	
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS, 0, 3);
}