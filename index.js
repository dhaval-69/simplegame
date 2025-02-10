const canvas = document.getElementById("canvas1")
const context = canvas.getContext("2d")
const dt = 0.016;
const bullet_lifetime = 0.75;

const speed = 1000;
const BULLET_SPEED = 2500;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawCircle(x, y, r){
        context.fillStyle = "#6495ED"
        context.beginPath()
        context.arc(x, y, r, 0, Math.PI * 2)
        context.fill()
}
class tutorialPopup {
    constructor(text, x, y){
        this.alpha = 0;
        this.dalpha = 1
        this.text = text
        this.x = x
        this.y = y
        this.moved = false
    }
    renderText(){
        context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
        context.font = "30px Arial"
        context.fillText(this.text, this.x, this.y)
        context.textAlign = "center"
    }
    fadeIn(){
        if ( this.alpha <= 1 && this.alpha >= 0){
            this.alpha += this.dalpha * dt
        }
    }
    fadeOut(){
        if (!this.moved && vel.length() > 0){
            this.moved = true
            this.alpha = 1
            this.dalpha = -1
        }
    }
    update(){
        this.renderText()
        this.fadeIn()
        this.fadeOut()
    }
}
let tut1 = new tutorialPopup("WASD to move around", canvas.width / 2, canvas.height / 3)
let tut2 = new tutorialPopup("Left click to shoot", canvas.width / 2, canvas.height / 3 + 40)

class v2 {
    constructor(x, y){
        this.x = x;
        this.y = y
    }
    add(that){
        return new v2(this.x + that.x , this.y + that.y);
    }
    sub(that){
        return new v2(this.x - that.x , this.y - that.y);
    }
    scale(s){
        return new v2(this.x * s , this.y * s);
    }
    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    normalize(){
        let n = this.length()
        return new v2(this.x / n, this.y / n)
    }
}
let directionSet = new Set()
let directionMap = {
    'KeyW': new v2(0, -speed),
    'KeyS': new v2(0, +speed),
    'KeyA': new v2(-speed, 0),
    'KeyD': new v2(speed, 0)
}
class Game {
    constructor(){
        this.playerPos = new v2(canvas.width / 2, canvas.height / 2)
        this.mousePos = new v2(0, 0)
        this.playerRaius = 39
        this.bullets = []
    }
    render(){
        drawCircle(this.playerPos.x, this.playerPos.y, this.playerRaius)
        for ( let bullet of this.bullets){
            bullet.render()
        }
    }
    update(){
        this.playerPos = this.playerPos.add(vel.scale(dt))
        for ( let bullet of this.bullets){
            bullet.update()
        }
        this.bullets = this.bullets.filter(bullet => bullet.lifetime > 0)
    }
    mouseDown(e){
        let mousePos = new v2(e.offsetX, e.offsetY)
        let bulletVel = mousePos.sub(this.playerPos).normalize().scale(BULLET_SPEED)

        this.bullets.push(new Bullet(this.playerPos, bulletVel))
    }
}
let game = new Game()
let vel = new v2(0 ,0)

class Bullet {
    constructor(pos, vel){
        this.pos = pos
        this.vel = vel
        this.bulletRaius = 19
        this.lifetime = bullet_lifetime
    }
    update(){
        this.pos = this.pos.add(this.vel.scale(dt))
        if (this.lifetime > 0){
            this.lifetime -= dt
        }else {
            this.lifetime = 0
        }
    }
    render(){
        drawCircle(this.pos.x, this.pos.y, this.bulletRaius)
    }

}

function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    tut1.update()
    tut2.update()
    game.update()
    game.render()
    window.requestAnimationFrame(loop)
}
loop()

window.addEventListener('keydown', (e)=>{ if (e.code in directionMap){
        if (!directionSet.has(e.code)){
            directionSet.add(e.code)
            vel = vel.add(directionMap[e.code])
        }
    }
})
window.addEventListener('keyup', (e)=>{
    if (e.code in directionMap){
        if (directionSet.has(e.code)){
            directionSet.delete(e.code)
            vel = vel.sub(directionMap[e.code])
        }
    }
})
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
window.addEventListener('mousedown', e =>{
    if (e.button === 0){
    game.mouseDown(e)
    }
})
