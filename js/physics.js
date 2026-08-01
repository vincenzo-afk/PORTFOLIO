/**
 * Physics Engine for the 3D Book
 * Implements a Critically Damped Spring for smooth, overshoot-free movement.
 */

class Spring {
    constructor(initialValue = 0, tension = 120, friction = 14) {
        this.value = initialValue;
        this.target = initialValue;
        this.velocity = 0;
        
        // Physics constants
        this.tension = tension;
        this.friction = friction;
        
        // State
        this.isResting = true;
        this.restTolerance = 0.01;
    }

    setTarget(target) {
        this.target = target;
        this.isResting = false;
    }

    update(dt) {
        if (this.isResting) return this.value;

        // Convert dt to seconds, clamp to prevent huge jumps on lag
        const step = Math.min(dt / 1000, 0.05);

        const springForce = -this.tension * (this.value - this.target);
        const dampingForce = -this.friction * this.velocity;
        const acceleration = springForce + dampingForce;

        this.velocity += acceleration * step;
        this.value += this.velocity * step;

        // Check if resting
        if (Math.abs(this.velocity) < this.restTolerance && 
            Math.abs(this.target - this.value) < this.restTolerance) {
            this.value = this.target;
            this.velocity = 0;
            this.isResting = true;
        }

        return this.value;
    }
}
