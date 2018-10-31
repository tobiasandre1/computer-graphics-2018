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
		
}