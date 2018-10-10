var theta;
var thetaLoc;
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
		
		
var vertices = [
vec2(0, 1),
vec2(1, 0),
vec2(-1, 0),
vec2(0, -1)
];


	
indices = [0,1,2,3,4];		
		
var bufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);


var Index_Buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);



var vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(vPosition);
		
theta = 0.3;
thetaLoc = gl.getUniformLocation(program, "theta");


		
	render();

}		


function render()
{

	
gl.clear(gl.COLOR_BUFFER_BIT);
theta += 0.01;
gl.uniform1f(thetaLoc, theta);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

requestAnimFrame(render);
}








