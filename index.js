const canvas = document.getElementById("canvas1")
const context = canvas.getContext("2d")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
let moved = false;
let r = 39;
let speed = 1000;

class tutorialPopup {
    constructor(text){
        this.alpha = 0;
        this.dalpha = 1
        this.text = text
    }
    renderText(){
        context.fillStyle = `rgba(255, 255, 255, ${popup.alpha})`
        context.font = "30px Arial"
        context.fillText(this.text, canvas.width / 2, canvas.height / 2)
        context.textAlign = "center"
    }
    fadeIn(){
        if ( this.alpha <= 1){
            this.alpha += this.dalpha * dt
        }
    }
    fadeOut(){
        if (!moved && vel.length() > 0){
            moved = true
            this.alpha = 1
            this.dalpha = -1
        }
    }
    update(){
        this.alpha = this.dalpha * dt
    }
}
let popup = new tutorialPopup("WASD to move around")

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
}
let directionSet = new Set()
let directionMap = {
    'KeyW': new v2(0, -speed),
    'KeyS': new v2(0, +speed),
    'KeyA': new v2(-speed, 0),
    'KeyD': new v2(speed, 0)
}
let pos = new v2(canvas.width / 2, canvas.height / 3)
let vel = new v2(0 ,0)

function draw(){
    context.fillStyle = "#6495ED"
    context.beginPath()
    context.arc(pos.x, pos.y, r, 0, Math.PI * 2)
    context.fill()
}
const dt = 0.016;
window.addEventListener('keydown', (e)=>{
    if (e.code in directionMap){
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

function loop() {


    context.clearRect(0, 0, canvas.width, canvas.height)
    pos = pos.add(vel.scale(dt))
    draw()
    popup.renderText()
    popup.fadeIn()
    popup.fadeOut()




    window.requestAnimationFrame(loop)
}
loop()
