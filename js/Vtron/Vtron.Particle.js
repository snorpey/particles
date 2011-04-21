/*
Simple Particle Class
*/

if(!Vtron){ var Vtron = {}; }

(function (Vtron) {
	Vtron.Particle = new Class({		
		pos: null,
		vel: null,
		accel: null,
		damping: 0.13,
		
		bHasLifespan:false,
		lifespan:0,
		deathRate:0,
		
	
		//---------------------------------------------------------------
		initialize:function(x,y,z) {
			//Copy vector to pos
			this.pos = Vector.create([x,y,0]);
		
			this.vel	= Vector.create([0,0,0]);
			this.accel	= Vector.create([0,0,0]);
		},
		
		
		//---------------------------------------------------------------
		update:function() {
			//Add Forces
			this.vel = this.vel.add(this.accel);
			this.pos = this.pos.add(this.vel);
			
			
			//Reset Acceleration
			this.accel.setElements([0,0,0]);
			
			//If this has a lifespan, move towards 0
			if(this.bHasLifespan) {
				this.lifespan -= this.deathRate;
			}
		},
		
		
		//---------------------------------------------------------------
		setVelocity: function() {
			//(Math.random() * 2) - 1,(Math.random() * 2) - 1,
		},
		
		
		
		//---------------------------------------------------------------
		//Forces
		applyForce: function(force) {
			this.accel = this.accel.add(force);
		},
		
		applyAttractionForce: function(force, radius, scale, particle) {
			var distance	= this.pos.distanceFrom(force);
			if(distance > radius) return;
			
			//Get Direction
			var direction	= this.pos.subtract(force).toUnitVector();
			
			//Get Scale
			var pct = 1 - (distance/radius);
			var scaleVec = Vector.create([scale, scale, 0]);
			
			//Find new force
			var newForce = direction.multiply(distance).multiply(scale).multiply(pct);
			
			//Apply
			this.accel = this.accel.subtract(newForce);
		},
		
		applyRepulsionForce: function(force, radius, scale, particle) {
			var direction	= this.pos.subtract(force).toUnitVector();
			var distance	= this.pos.distanceFrom(force);
			
			if(distance > radius) return;
			
			//Scale
			var pct = 1 - (distance/radius);
			var scaleVec = Vector.create([scale, scale, 0]);
			
			var newForce = direction.multiply(distance).multiply(scale).multiply(pct);
			
			//Apply
			this.accel = this.accel.add(newForce);
			if(particle) {
				particle.accel = particle.accel.subtract(newForce);
			}
		},
		
		applyParticleRepulsion:function(particle, radius, scale) {
			this.applyRepulsionForce(particle.pos, radius, scale,particle); 
		},
		
		
		
		addDampening: function(dampening) {
			this.vel = this.vel.multiply(dampening);
		},
		
		
		
		//---------------------------------------------------------------
		//Positioning
		getPos: function() {
			return {
				x:this.pos.elements[0],
				y:this.pos.elements[1]
			};
		},
		
		
		setPos:function(x,y,z) {
			this.pos.setElements([x,y,z]);
		},
		
		
		//---------------------------------------------------------------
		//Lifespan
		setLifespan: function(lifespan, deathRate) {
			this.lifespan	= lifespan;
			this.deathRate	= deathRate;
			this.bHasLifespan = true;
		},
		
		isDead: function() {
			return this.lifespan <= 0;
		}
	});
})(Vtron);