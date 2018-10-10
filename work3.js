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
		
		
var vertices2 = [
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, 1)
];
		
		
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);	 
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);

var vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(vPosition);


	
var colors = [
vec3(1.0, 0.0, 0.0),
vec3(0.0, 1.0, 0.0),
vec3(0.0, 0.0, 1.0)
];		

var colorsArray = [ ];
for(var ind = 0; ind < 3; ++ind) {

colorsArray.push(colors[ind]);
}		

var cbuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,cbuffer);	 
gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

var vColor = gl.getAttribLocation(program, "vColor");
gl.vertexAttribPointer(vColor,3,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(vColor);
		
render();
}		
	
function render()
{
	
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0,3);
}