var ParticleSimulation = function()
{
	// private
	var _self = this;
	var _particles = [];
	var _size = {width: 800, height: 600};
	var _ctx = document.getElementById('canvas').getContext('2d');
	var particles_max = 50;
	
	// public
	
	_self.run = true;
	
	// public functions
	_self.start = function()
	{
		_self.run();
	}
	
	_self.run = function()
	{
		if(_self.run)
		{
			setTimeout(
				function()
				{
					update();
					draw();
					_self.run();
				}
			);
		}
	}	
	
	_self.updateSize = function(size)
	{
		_size = size;
	}
	
	// private functions
	function update()
	{
		for(var i = 0; i < particles_max - _particles.length; i++)
		{
			addParticle(_size.width / 2 + Math.random(), _size.height / 2 + Math.random());
		}
		
		console.log()
		
		_particles.sort(
			function(a, b)
			{
				return a.getPosition().x - b.getPosition().x ;
			}
		);
				
		//Particle/Particle interaction
		var particles_count = _particles.length;
		var particle_radius = 25;
		
		for(var i = 0; i < particles_count; i++)
		{
			
			var j = i - 1; 
			
			while(j >= 0)
			{
				if(Math.abs(_particles[j].getPosition().x - _particles[i].getPosition().x) > particle_radius)
				{
					j =- 1;
				}
				
				else
				{
					_particles[i].applyParticleRepulsion(_particles[j], particle_radius, 1.1);
					j--;
				}
			};
		}
		
		//Add global forces and update particles
		
		var i = _particles.length;
		
		while(i--)
		{
			_particles[i].applyAttractionForce(Vector.create([_size.width / 2, _size.height / 2,0]), 3000, .005);

			//_self.particles[i].applyRepulsionForce(Vector.create([this.mousePos.x, this.mousePos.y, 0]), 100, 0.75);
			_particles[i].addDampening(0.8);
			_particles[i].update();
		}
	}
	
	function draw()
	{
		//Clear BG
		_ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
		_ctx.fillRect(0, 0, _size.width, _size.height);
		
		//Draw Attractor
/*
		var i=this.food.length; 
		while(i--)
		{
			this.ctx.fillStyle = "rgba(255,100,0,1)";
			this.ctx.beginPath();
			this.ctx.arc(this.food[i].getPos().x, this.food[i].getPos().y, this.food[i].lifespan/10, 0, Math.PI * 2, true);
			this.ctx.closePath();
			this.ctx.fill();
		}
*/
		
		//Draw Particles
		var i = _particles.length;
		
		while(i--)
		{
			var px = ~~ (_particles[i].getPosition().x + 0.5);
			var py = ~~ (_particles[i].getPosition().y + 0.5);
			
			_ctx.fillStyle = "rgb(0,0,0)";
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
};