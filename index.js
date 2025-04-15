const canvas = document.getElementById("canvas1")
const context = canvas.getContext("2d")
const dt = 0.016;
const bullet_lifetime = 0.75;
const PLAYER_SPEED = 1000;
const ENEMY_SPEED = PLAYER_SPEED / 3;
const BULLET_SPEED = 2000;
const BULLET_RADIUS = 19;
const ENEMY_RADIUS = 39;
const ENEMY_COLOR = "red";
const PLAYER_COLOR = "#6495ED";
const magnitude = PLAYER_SPEED;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawCircle(center, r, color) {
    context.fillStyle = color
    context.beginPath()
    context.arc(center.x, center.y, r, 0, Math.PI * 2)
    context.fill()
}

class tutorialPopup {
    constructor(text, x, y) {
        this.alpha = 0;
        this.dalpha = 1
        this.text = text
        this.x = x
        this.y = y
        this.moved = false
        this.fadeIn();
    }
    renderText() {
        context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
        context.font = "30px Arial"
        context.fillText(this.text, this.x, this.y)
        context.textAlign = "center"
    }
    fadeIn() {
        this.alpha = 0;
        this.dalpha = 1;
    }
    fadeOut() {
        if (!this.moved && vel.len() > 0) {
            this.moved = true
            this.alpha = 1
            this.dalpha = -1
        }
    }
    update() {
        this.renderText()
        if (this.alpha <= 1 && this.alpha >= 0) {
            this.alpha += this.dalpha * dt
        }
        this.fadeOut()
    }
}
let tut1 = new tutorialPopup("WASD to move around", canvas.width / 2, canvas.height / 3)
let tut2 = new tutorialPopup("Left click to shoot", canvas.width / 2, canvas.height / 3 + 40)

class v2 {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
    add(that) {
        return new v2(this.x + that.x, this.y + that.y);
    }
    sub(that) {
        return new v2(this.x - that.x, this.y - that.y);
    }
    scale(s) {
        return new v2(this.x * s, this.y * s);
    }
    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    norm() {
        let n = this.len()
        return new v2(this.x / n, this.y / n)
    }
    dist(that) {
        return this.sub(that).len()
    }
}
let directionSet = new Set()
let directionMap = {
    'KeyW': new v2(0, -PLAYER_SPEED),
    'KeyS': new v2(0, +PLAYER_SPEED),
    'KeyA': new v2(-PLAYER_SPEED, 0),
    'KeyD': new v2(PLAYER_SPEED, 0)
}

class Particle {
    constructor(pos) {
        this.x = pos.x
        this.y = pos.y
        this.size = Math.random() * 9 + 1;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.color = `rgba(255, 0, 0, ${Math.random()})`
    }
    update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.3) this.size -= 0.2;
    }
    render() {
        context.fillStyle = this.color
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.closePath();
        context.fill();
    }
}

class Enemy {
    constructor(pos) {
        this.pos = pos
        this.ded = false
    }
    render() {
        drawCircle(this.pos, ENEMY_RADIUS, ENEMY_COLOR)
    }
    update(followPos) {
        let vel = followPos.sub(this.pos).norm().scale(ENEMY_SPEED)
        this.pos = this.pos.add(vel.scale(dt))
    }
}
class Game {
    constructor() {
        this.playerPos = new v2(canvas.width / 2, canvas.height / 2)
        this.ref = new v2(canvas.width / 2, canvas.height / 2)
        this.mousePos = new v2(0, 0)
        this.playerRaius = 39
        this.bullets = []
        this.enemies = []
        this.particles = []

        //this.enemies.push(new Enemy(new v2(window.innerWidth + Math.random() * 100, window.innerWidth + Math.random() * 100)))
    }
    createParticle(pos) {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(pos))
        }
    }
    enemy_spawner() {
        let pos = new v2(Math.random() * canvas.width, Math.random() * canvas.height)
        let rel_pos = pos.sub(this.ref).norm().scale(magnitude)
        this.enemies.push(new Enemy(rel_pos))
    }
    render() {
        drawCircle(this.playerPos, this.playerRaius, PLAYER_COLOR)
        for (let bullet of this.bullets) {
            bullet.render()
        }
        for (let enemy of this.enemies) {
            enemy.render()
        }
        for (let particle of this.particles) {
            particle.render()
        }
    }
    update() {
        this.playerPos = this.playerPos.add(vel.scale(dt))
        for (let bullet of this.bullets) {
            bullet.update()
        }
        this.bullets = this.bullets.filter(bullet => bullet.lifetime > 0)
        for (let enemy of this.enemies) {
            enemy.update(this.playerPos)
        }
        this.enemies = this.enemies.filter(enemy => enemy.ded === false)
        for (let enemy of this.enemies) {
            for (let bullet of this.bullets) {
                if (enemy.pos.dist(bullet.pos) <= BULLET_RADIUS + ENEMY_RADIUS) {
                    enemy.ded = true;
                    bullet.lifetime = 0.0;
                    this.createParticle(enemy.pos)
                }
            }
        }
        for (let particle of this.particles) {
            if (this.particles.length > 0) {
                this.particles = this.particles.filter(particle => particle.size > 0.4)
                particle.update()
            }
        }
    }
    mouseDown(e) {
        let mousePos = new v2(e.offsetX, e.offsetY)
        let bulletVel = mousePos.sub(this.playerPos).norm().scale(BULLET_SPEED)

        this.bullets.push(new Bullet(this.playerPos, bulletVel))
    }
}
let game = new Game()
let vel = new v2(0, 0)
setInterval(() => {
    game.enemy_spawner()
}, 1000);


class Bullet {
    constructor(pos, vel) {
        this.pos = pos
        this.vel = vel
        this.bulletRaius = BULLET_RADIUS
        this.lifetime = bullet_lifetime
    }
    update() {
        this.pos = this.pos.add(this.vel.scale(dt))
        if (this.lifetime > 0) {
            this.lifetime -= dt
        } else {
            this.lifetime = 0
        }
    }
    render() {
        drawCircle(this.pos, this.bulletRaius, PLAYER_COLOR)
    }

}

function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    game.update()
    game.render()
    tut1.update()
    tut2.update()
    window.requestAnimationFrame(loop)
}
loop()

window.addEventListener('keydown', (e) => {
    if (e.code in directionMap) {
        if (!directionSet.has(e.code)) {
            directionSet.add(e.code)
            vel = vel.add(directionMap[e.code])
        }
    }
})
window.addEventListener('keyup', (e) => {
    if (e.code in directionMap) {
        if (directionSet.has(e.code)) {
            directionSet.delete(e.code)
            vel = vel.sub(directionMap[e.code])
        }
    }
})
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
window.addEventListener('mousedown', e => {
    if (e.button === 0) {
        game.mouseDown(e)
    }
})
