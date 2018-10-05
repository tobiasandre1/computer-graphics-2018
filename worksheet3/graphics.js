var index = 0;
var modelViewMatrix;
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
		
		program = initShaders(gl, "vertex-shader", "fragment-shader");
		gl.useProgram(program);
		
		var points = [];
		
		var vertices = [
			vec4(-0.5, -0.5, 0.5, 1.0),
			vec4(-0.5, 0.5, 0.5, 1.0),
			vec4(0.5, 0.5, 0.5, 1.0),
			vec4(0.5, -0.5, 0.5, 1.0),
			vec4(-0.5, -0.5, -0.5, 1.0),
			vec4(-0.5, 0.5, -0.5, 1.0),
			vec4(0.5, 0.5, -0.5, 1.0),
			vec4(0.5, -0.5, -0.5, 1.0)
		];
		
		var vertexColors = [
			[ 0.0, 0.0, 0.0, 1.0 ], // black
			[ 1.0, 0.0, 0.0, 1.0 ], // red
			[ 1.0, 1.0, 0.0, 1.0 ], // yellow
			[ 0.0, 1.0, 0.0, 1.0 ], // green
			[ 0.0, 0.0, 1.0, 1.0 ], // blue
			[ 1.0, 0.0, 1.0, 1.0 ], // magenta
			[ 1.0, 1.0, 1.0, 1.0 ], // white
			[ 0.0, 1.0, 1.0, 1.0 ] // cyan
		];
		
		//Faces is a 2-dimensional array of positions, consisting of 24 vertices
		var faces = new Array(24);
		
		var numVertices = 36; //36 because we can only draw triangles, not squares. Therefore each face is 6 vertices
		var points = [ ]; //2d array for points
		var colors = [ ]; //2d array for colors
		
		function quad(a, b, c, d) //Vertex parameters
		{
			var indices = [ a, b, c, a, c, d ]; //Draw two triangles for the face
			for (var i = 0; i < indices.length; ++i) {
				points.push(vertices[indices[i]]);
				colors.push(vertexColors[indices[i]]);
				index++;
				
			}
		}	
		
		function colorCube()
		{
			quad(1, 0, 3, 2);
			quad(2, 3, 7, 6);
			quad(3, 0, 4, 7);
			quad(6, 5, 1, 2);
			quad(4, 5, 6, 7);
			quad(5, 4, 0, 1);
		}
			
		colorCube();	
		
		var translation = [0.5,0.5,0.5, 0.0];
		var uTranslation = gl.getUniformLocation(program, "uTranslation");
		gl.uniform4f(uTranslation, translation[0], translation[1], translation[2], translation[3]);
		var uniform = gl.getUniform(program, uTranslation);
		console.log(uniform);
		
			
		var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);
		
		var cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
		
		var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);
		
		var R = mat4();
		var ctm = mat4();
		var thetaX = Math.acos(3.0/Math.sqrt(14.0));
		var thetaY = Math.sqrt(13.0/14.0);
		var d = vec3(4.0, 5.0, 6.0);
		R = mult(R, rotateX(thetaX));
		R = mult(R, rotateY(thetaY));
		R = mult(R, rotateZ(-45.0));
		R = mult(R, rotateY(-thetaY));
		R = mult(R, rotateX(-thetaX));
		ctm = translate(ctm, d);
		ctm = mult(ctm, R);
		ctm = translate(ctm, negate(d));
		
		var uModelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");
		gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(ctm));
		
			
		render();
	}


	function render(){		
		gl.clear(gl.COLOR_BUFFER_BIT);
		if(index > 0){
			gl.drawArrays(gl.LINES, 0,index)
		}
		window.requestAnimFrame(render, canvas);
	}
	