$(document).ready(
	function()
	{
		var app;
		$(window).resize(resized);
		init();
		
		function init()
		{
			$('body').prepend('<canvas id="canvas" width="960" height="450">sorry but your browser doesn\'t support the canvas tag.</canvas>');
			$('#canvas').attr(getCanvasSize());
			
			_app = new ParticleSimulation();
			_app.updateSize(getCanvasSize())
			_app.start();
		}
			
		function getCanvasSize()
		{
			return {width: $(window).width(), height: $(window).height()};
		}
		
		function resized()
		{
			$('#canvas').attr(getCanvasSize());
		}
	}
);