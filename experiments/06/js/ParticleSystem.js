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
	var _particles_max = 100;
	var _particle_radius = 15;
	
	var _repellers = [];
	var _repeller_radius = 100;
	
	var _attractors = [];
	var _attractor_radius = 500;
	
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
			for(var j = 0; j < _repellers.length; j++)
			{
				_particles[i].applyRepulsionForce(Vector.create([_repellers[j].getPosition().x, _repellers[j].getPosition().y, 0]), _repeller_radius, 0.65);
			}
			
			for(var j = 0; j < _attractors.length; j++)
			{
				_particles[i].applyAttractionForce(Vector.create([_attractors[j].getPosition().x, _attractors[j].getPosition().y, 0]), _attractor_radius, .005);
			}
			
			_particles[i].applyRepulsionForce(Vector.create([_mouse.x, _mouse.y, 0]), _repeller_radius, 0.65);
			
			if(_particles[i].getPosition().y > _size.height)
			{
				_particles[i].setPosition(Math.random() * _size.width, 0, 0);
			}
			
			if(_particles[i].getPosition().x > _size.width)
			{
				_particles[i].setPosition(Math.random() * _size.width, _particles[i].getPosition().x, 0);
			}
			
			_particles[i].applyForce(
				Vector.create(
					[
						0,
						_particles[i].map_range(
							_particles[i].position.distanceFrom(
								Vector.create(
									[
										_particles[i].getPosition().x,
										_size.height, 
										0
									]
								)
							),
							0,
							_size.height,
							1,
							0.2
						),
						0
					]
				)
			);
			
			_particles[i].addDampening(0.8);
			_particles[i].update();
			
			if(_particles[i].getVelocity() != null)
			{
				var collided = false;
				
				if(_particles[i].getPosition().x - _particle_radius < 0)
				{
					if(_particles[i].getVelocity().x < 0)
					{
						_particles[i].setVelocity(_particles[i].getVelocity().x * -1, _particles[i].getVelocity().y, _particles[i].getVelocity().z);
						collided = true;
					}
				}
				
				if(_particles[i].getPosition().x + _particle_radius > _size.width)
				{
					if(_particles[i].getVelocity().x > 0)
					{
						_particles[i].setVelocity(_particles[i].getVelocity().x * -1, _particles[i].getVelocity().y, _particles[i].getVelocity().z);
						collided = true;
					}
				}
				
				if(_particles[i].getPosition().y - _particle_radius < 0)
				{								
					if(_particles[i].getVelocity().y < 0)
					{
						_particles[i].setVelocity(_particles[i].getVelocity().x, _particles[i].getVelocity().y * -1, _particles[i].getVelocity().z);
						collided = true;
					}
				}
				
				if(_particles[i].getPosition().y + _particle_radius > _size.height)
				{
					if(_particles[i].getVelocity().y > 0)
					{
						_particles[i].setVelocity(_particles[i].getVelocity().x, _particles[i].getVelocity().y * -2, _particles[i].getVelocity().z);
						collided = true;
					}
				}
			}
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
		
		var i = _repellers.length;
		
		while(i--)
		{
			var px = ~~ (_repellers[i].getPosition().x + 0.5);
			var py = ~~ (_repellers[i].getPosition().y + 0.5);
			
			_ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
			_ctx.beginPath();
			_ctx.arc(px, py, 4, 0, Math.PI * 2, true);
			_ctx.closePath();
			_ctx.fill();
		}
		
		var i = _attractors.length;
		
		while(i--)
		{
			var px = ~~ (_attractors[i].getPosition().x + 0.5);
			var py = ~~ (_attractors[i].getPosition().y + 0.5);
			
			_ctx.fillStyle = 'rgba(0, 102, 255, 1)';
			_ctx.beginPath();
			_ctx.arc(px, py, 4, 0, Math.PI * 2, true);
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
		var index = _repellers.length;
		_repellers[index] = new Particle();
		_repellers[index].initialize(x, y);
	}
	
	function addAttractor(x, y)
	{
		var index = _attractors.length;
		_attractors[index] = new Particle();
		_attractors[index].initialize(x, y);
	}
};