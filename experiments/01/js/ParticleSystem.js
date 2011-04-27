// shim layer with setTimeout fallback, see
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (
	function()
	{
  		return  window.requestAnimationFrame || 
          	window.webkitRequestAnimationFrame || 
         	window.mozRequestAnimationFrame    || 
          	window.oRequestAnimationFrame      || 
          	window.msRequestAnimationFrame     || 
          	function(/* function */ callback, /* DOMElement */ element)
          	{
				window.setTimeout(callback, 1000 / 60);
          	};
	}
)();

var ParticleSystem = function()
{
	// private vars
	var _self = this;
	var _size = {width: 800, height: 600};
	var _ctx = document.getElementById('canvas').getContext('2d');
	var _mouse = {x: _size.width / 2, y: _size.height / 2, over: false};
	
	var _particles = [];
	var _particles_max = 200;
	var _particle_radius = 15;
	
	var _repeller_radius = 100;
	
	// public vars
	_self.run = true;
	
	// public functions
	_self.start = function()
	{
		_self.run();
	}
	
	_self.run = function()
	{
		requestAnimFrame( _self.run );
		update();
		draw();
	}
	
	_self.updateSize = function(size)
	{
		_size = size;
	}
	
	_self.mouseClicked = function(event)
	{
		_mouse.x = event.pageX;
		_mouse.y = event.pageY;
	}
	
	_self.mouseMoved = function(event)
	{
		_mouse.x = event.pageX;
		_mouse.y = event.pageY;
	}
	
	_self.mouseEntered = function(event)
	{
		_mouse.over = true;
	}
	
	_self.mouseLeft = function(event)
	{
		_mouse.over = false;
	}
	
	// private functions
	function update()
	{
		for(var i = 0; i < _particles_max - _particles.length; i++)
		{
			addParticle(_size.width / 2 + Math.random(), _size.height / 2 + Math.random());
		}
		
		_particles.sort(
			function(a, b)
			{
				return a.getPosition().x - b.getPosition().x ;
			}
		);
				
		//	particle / particle interaction
		
		for(var i = 0; i < _particles.length; i++)
		{
			var j = i - 1; 
			
			while(j >= 0)
			{
				if(Math.abs(_particles[j].getPosition().x - _particles[i].getPosition().x) > _particle_radius)
				{
					j =- 1;
				}
				
				else
				{
					_particles[i].applyParticleRepulsion(_particles[j], _particle_radius, 1.1);
					j--;
				}
			};
		}
		
		//	add global forces and update particles
		
		var i = _particles.length;
		
		while(i--)
		{
			_particles[i].applyAttractionForce(Vector.create([_size.width / 2, _size.height / 2, 0]), 3000, .005);
			_particles[i].applyRepulsionForce(Vector.create([_mouse.x, _mouse.y, 0]), _repeller_radius, 0.65);
			_particles[i].addDampening(0.8);
			_particles[i].update();
		}
	}
	
	function draw()
	{
		//clear background (some opacity for traces)
		_ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
		_ctx.fillRect(0, 0, _size.width, _size.height);
		
		//draw particles
		var i = _particles.length;
		
		while(i--)
		{
			var px = ~~ (_particles[i].getPosition().x + 0.5);
			var py = ~~ (_particles[i].getPosition().y + 0.5);
			
			_ctx.fillStyle = 'rgba(0, 0, 0, 0.75 )';
			_ctx.beginPath();
			_ctx.arc(px, py, 2, 0, Math.PI * 2, true);
			_ctx.closePath();
			_ctx.fill();
		}
	}

	function addParticle(x, y)
	{
		var index = _particles.length;
		_particles[index] = new Particle();
		_particles[index].initialize(x, y);
	}
	
	function addReppeller(x, y)
	{
		var index = _particles.length;
		_repellers[index] = new Particle();
		_repellers[index].initialize(x, y);
	}
};