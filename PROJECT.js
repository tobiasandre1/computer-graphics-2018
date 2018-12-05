var theta = [0, 0, 90];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = [];
var modelViewMatrix;
var ctm;

var iso = mat4(1.732050808/2.449489743,0,-1.732050808/2.449489743,0,
				1/2.449489743,2/2.449489743,1/2.449489743,0,
				1.414213562/2.449489743,-1.414213562/2.449489743,1.414213562/2.449489743,0,
				0,0,0,1
				);
var aileron = function(theta1,theta2,theta3){
var wing = mat4(0.3,0,0,0,
				0,0.03,0,0,
				0,0,1.5,0,
				0,0,0,1);
				
var body = mat4(1.8,0,0,0,
				0,0.2,0,0,
				0,0,0.2,0,
				0,0,0,1);
				
var backWing = 	mat4(0.2,0,0,0.8,
					0,0.03,0,0,
					0,0,0.9,0,
					0,0,0,1);

var horizontalsta = mat4(0.3,0,0,0.75,
						0,0.3,0,0.2,
						0,0,0.03,0,
						0.0,0.0,0,1);				

var aileronLeft = mult(mat4(Math.cos(-theta1), -Math.sin(-theta1),0		,0.18,
						Math.sin(-theta1)	 ,	Math.cos(-theta1),0		,0,
						0					 ,0					,1		,0.5,
						0					 ,0					,0		,1),				
						mat4(0.18,0,0,0.06,
						0,0.03,0,0,
						0,0,0.3,0,
						0,0,0,1));
				
var aileronRigth = mult(mat4(Math.cos(theta1), -Math.sin(theta1),0		,0.16,
						Math.sin(theta1)	 ,	Math.cos(theta1),0		,0,
						0					 ,0					,1		,-0.5,
						0					 ,0					,0		,1),				
						mat4(0.18,0,0,0.075,
							0,0.03,0,0,
							0,0,0.3,0,
							0,0,0,1));
					
var elevatorLeft = mult(mat4(Math.cos(theta3), -Math.sin(theta3),0		,0.91,
						Math.sin(theta3)	 ,	Math.cos(theta3),0		,0,
						0					 ,0					,1		,0.275,
						0					 ,0					,0		,1),
					mat4(0.1	,0		,0		,0.032,
						0		,0.03	,0		,0,
						0		,0		,0.25	,0,
						0		,0		,0		,1));
			
var elevatorRigth = mult(mat4(Math.cos(theta3), -Math.sin(theta3),0		,0.91,
						Math.sin(theta3)	 ,	Math.cos(theta3),0		,0,
						0					 ,0					,1		,-0.275,
						0					 ,0					,0		,1),
					mat4(0.10	,0		,0		,0.032,
						0		,0.03	,0		,0,
						0		,0		,0.25	,0,
						0		,0		,0		,1));
					
						
var rudder = 	mult(mat4(Math.cos(theta2)	,0	,Math.sin(theta2)				,0.88,
							0						,1	,0						,0.225,
							-Math.sin(theta2)	,0	,Math.cos(theta2)			,0,
							0						,0	,0						,1),
							mat4(0.08,0,0,0.04,
								0,0.2,0,0,
								0,0,0.05,0,
								0,0,0,1)
						);
						
var parts = [body,wing,backWing,horizontalsta,aileronLeft,aileronRigth,elevatorLeft,elevatorRigth,rudder];
return parts;
}

Math.sin()

var rotatet1 = function(theta1, theta2, theta3){
	mat4(Math.cos(theta2)*Math.cos(theta3), -Math.cos(theta2)*Math.sin(theta3) ,Math.sin(theta2) ,0,
		Math.sin(theta1)*Math.sin(theta2)*Math.cos(theta3)+Math.cos(theta1)*Math.sin(theta3)	,-Math.sin(theta1)*Math.sin(theta2)*Math.sin(theta3)+Math.cos(theta1)+Math.cos(theta3), -Math.sin(theta1)*Math.cos(theta2), 0,
		-Math.cos(theta1)*Math.sin(theta2)*Math.cos(theta3)+Math.sin(theta1)*Math.sin(theta3) , Math.cos(theta1)*Math.sin(theta2)*Math.sin(theta3) + Math.sin(theta1)*Math.cos(theta3), Math.cos(theta1)*Math.cos(theta2),0,
		0,	0,	0,	1)
	
	
	return rotate1;
}



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
	
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	
	vertices = [
	vec3(-0.5, -0.5, 0.5),
	vec3(-0.5, 0.5, 0.5),
	vec3(0.5, 0.5, 0.5),
	vec3(0.5, -0.5, 0.5),
	vec3(-0.5, -0.5, -0.5),
	vec3(-0.5, 0.5, -0.5),
	vec3(0.5, 0.5, -0.5),
	vec3(0.5, -0.5, -0.5)
	
	];

	indices = [
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
	
	var vBuffer = gl.createBuffer();	
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);	
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);
	
	var vPositionLocationId = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPositionLocationId,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPositionLocationId);
	
	
	
	var colors = [
vec3(1.0, 0.0, 0.0,1),
vec3(0.0, 1.0, 0.0,1),
vec3(0.0, 0.0, 1.0,1),
vec3(0.0, 0.0, 1.0,1),
vec3(0.0, 0.0, 1.0,1),
vec3(0.0, 0.0, 1.0,1),
vec3(0.0, 0.0, 1.0,1),
vec3(0.0, 0.0, 1.0,1)
];		

 colorsArray = [ ];
for(var ind = 0; ind < 8; ++ind) {

colorsArray.push(colors[ind]);
}		

var cbuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,cbuffer);	 
gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

	
fColorLoc = gl.getUniformLocation(program, "fColor");
	

var vColor = gl.getAttribLocation(program, "vColor");
gl.vertexAttribPointer(vColor,1,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(vColor);	
	


		
	
	
		
	modelViewMatrix = mat4();
	modelViewMatrix = mult(modelViewMatrix, rotateX(theta[xAxis]));
	modelViewMatrix = mult(modelViewMatrix, rotateY(theta[yAxis]));
	modelViewMatrix = mult(modelViewMatrix, rotateZ(theta[zAxis]));

	var mBuffer = gl.createBuffer();	
	gl.bindBuffer(gl.ARRAY_BUFFER,mBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(modelViewMatrix), gl.STATIC_DRAW);
	
	modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix")
	
	

render();
}		
	
	
function render()
{
	gl.cullFace(gl.BACK);
		var reset = document.getElementById("ButtonX")
		reset.addEventListener("click", function() {theta = [0,0,0];}, false);
		
		angleX = document.getElementById("angleX");
		var angleXinter = angleX.value;
		angleX.addEventListener("input", function(){
			angleXinter = angleX.value;
		});	
		angleY = document.getElementById("angleY");
		var angleYinter = angleY.value;
		angleY.addEventListener("input", function(){
			angleYinter = angleY.value;
		});	
		angleZ = document.getElementById("angleZ");
		var angleZinter = angleZ.value;
		angleZ.addEventListener("input", function(){
			angleZinter = angleZ.value;
		});	
	
	
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
theta[xAxis] += angleXinter/5;
theta[yAxis] += angleYinter/5;
theta[zAxis] += angleZinter/5;
ctm = rotateX(theta[xAxis]);
ctm = mult(ctm, rotateY(theta[yAxis]));
ctm1 = mult(ctm, rotateZ(theta[zAxis]));
for(var j = 0; j<aileron(theta[xAxis],theta[yAxis],theta[zAxis]).length;j++){
ctm = ctm1;
ctm = mult(ctm1,aileron(angleXinter/5,angleYinter/5,angleZinter/5)[j]);

gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
gl.uniform4fv(fColorLoc, flatten(colorsArray));
gl.drawElements(gl.TRIANGLE_STRIP, indices.length,gl.UNSIGNED_BYTE, 0);

}



requestAnimFrame(render);
}