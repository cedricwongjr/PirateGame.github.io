class CannonBall {
  constructor(x, y) {
    var options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
      isStatic: false
    };
    this.r = 40;
    this.speed = 0.05;
    this.body = Bodies.circle(x, y, this.r, options);
    this.image = loadImage("assets/cannonball.png");
    this.isSink = false;
    World.add(world, this.body);
    this.trajectory = [];
  }

  animate() {
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.image, 0, 0, this.r, this.r);
    pop();

    if (this.body.velocity.x > 0 && pos.x > width / 2) {
      var position = [pos.x, pos.y];
      this.trajectory.push(position);
    }

    for (var i = 0; i < this.trajectory.length; i++) {
      fill("white");
      ellipse(this.trajectory[i][0], this.trajectory[i][1], 5, 5);
    }

    if (pos.y > height || this.body.speed < 0.5) {
      this.remove();
    }
  }

  shoot() {
    var velocity = p5.Vector.fromAngle(cannon.angle);
    velocity.mult(20);
    Matter.Body.setVelocity(this.body, { x: velocity.x, y: velocity.y });
    Matter.Body.setAngularVelocity(this.body, this.speed);
  }

  display() {
    if (!this.isSink) {
      var pos = this.body.position;
      var angle = this.body.angle;

      push();
      translate(pos.x, pos.y);
      rotate(angle);
      imageMode(CENTER);
      image(this.image, 0, 0, this.r, this.r);
      pop();

      if (this.body.velocity.x > 0 && pos.x > width / 2) {
        var position = [pos.x, pos.y];
        this.trajectory.push(position);
      }

      for (var i = 0; i < this.trajectory.length; i++) {
        fill("white");
        ellipse(this.trajectory[i][0], this.trajectory[i][1], 5, 5);
      }

      if (pos.y > height || this.body.speed < 0.5) {
        this.remove();
      }
    }
  }

  remove() {
    this.isSink = true;
    Matter.World.remove(world, this.body);
  }
}

