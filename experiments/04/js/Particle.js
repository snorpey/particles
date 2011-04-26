var Particle = function()
{
	//	private
	var _self = this;
	var position = null;
	var velocity = null;
	var acceleration = null;
	var damping = 0.13;
	var lifespan = 1100;
	var death_rate = 1;
	var has_lifespan = true;
	
	//	public
	_self.initialize = function(x, y, z)
	{
		_self.position = Vector.create([x, y, 0]);
		_self.velocity	= Vector.create([0, 0, 0]);
		_self.acceleration	= Vector.create([0, 0, 0]);
	}
	
	_self.update = function()
	{
		_self.velocity = _self.velocity.add(_self.acceleration);
		_self.position = _self.position.add(_self.velocity);

		//reset acceleration
		_self.acceleration.setElements([0, 0, 0]);
		
		//if this has a lifespan, move towards 0
		if(_self.has_lifespan)
		{
			_self.lifespan -= _self.death_rate;
		}
	}
	
	_self.setVelocity = function(velocity)
	{
		//_self.velocity = velocity;
		//(Math.random() * 2) - 1,(Math.random() * 2) - 1,
	}
	
	_self.applyForce = function(force)
	{
		_self.acceleration = _self.acceleration.add(force);
	}
	
	_self.applyAttractionForce = function(force, radius, scale, particle)
	{
		var distance = _self.position.distanceFrom(force);
		
		// do nothing
		if(distance > radius) return;
		
		//Get Direction
		var direction	= _self.position.subtract(force).toUnitVector();
		
		//Get Scale
		var pct = 1 - (distance / radius);
		var scale_vec = Vector.create([scale, scale, 0]);
		
		//Find new force
		var new_force = direction.multiply(distance).multiply(scale).multiply(pct);
		
		//Apply
		this.acceleration = _self.acceleration.subtract(new_force);
	}
	
	_self.applyRepulsionForce = function(force, radius, scale, particle)
	{
		var direction	= _self.position.subtract(force).toUnitVector();
		var distance	= _self.position.distanceFrom(force);
		
		if(distance > radius) return;
		
		//Scale
		var pct = 1 - (distance / radius);
		var scale_vec = Vector.create([scale, scale, 0]);
		
		var new_force = direction.multiply(distance).multiply(scale).multiply(pct);
		
		//Apply
		_self.acceleration = _self.acceleration.add(new_force);
		
		if(particle)
		{
			particle.acceleration = particle.acceleration.subtract(new_force);
		}
	}
	
	_self.applyParticleRepulsion = function(particle, radius, scale)
	{
		_self.applyRepulsionForce(particle.position, radius, scale, particle); 
	}
	
	_self.addDampening = function(dampening)
	{
		_self.velocity = _self.velocity.multiply(dampening);
	}
	
	_self.getPosition = function()
	{
		return {
			x: _self.position.elements[0],
			y: _self.position.elements[1]
		};
	}
		
	_self.setPosition = function(x, y, z)
	{
		_self.position.setElements([x, y, z]);
	}
	
	_self.getNextPosition = function()
	{
		return _self.position.add(_self.velocity.add(_self.acceleration));
	}
	
	_self.setLifespan = function(lifespan, death_rate)
	{
		_self.lifespan	= lifespan;
		_self.death_rate = death_rate;
		_self.has_lifespan = true;
	}
		
	_self.is_dead = function()
	{
		return _self.lifespan <= 0;
	}
};