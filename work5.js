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
		
		
var vertices = [];
    var vertexCount = 100;
    var radius = 0.2;
    for (var i = 0; i < vertexCount; i++)
    {

        vertices.push(radius * Math.cos((i / vertexCount) * 2.0 * Math.PI));

        vertices.push(radius * Math.sin((i / vertexCount) * 2.0 * Math.PI));

    }
    vertices.push(vertices[0]);
    vertices.push(vertices[1]);

	
	
		
var bufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);


var vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(vPosition);
		
theta = 0.0;
thetaLoc = gl.getUniformLocation(program, "theta");
		
	
	
	render();

	
}		


function render()
{

gl.clear(gl.COLOR_BUFFER_BIT);
theta += 0.001;
gl.uniform1f(thetaLoc, theta);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 100);

requestAnimFrame(render);	



}








