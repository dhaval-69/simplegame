const canvas = document.getElementById("canvas1")
const context = canvas.getContext("2d")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
let start;
let r = 39;
let speed = 1000;

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
}
let pos = new v2(canvas.width / 2 , canvas.height / 2)
let vel = new v2(0 ,0)

let directionSet = new Set()
let directionMap = {
    'KeyW': new v2(0, -speed),
    'KeyS': new v2(0, +speed),
    'KeyA': new v2(-speed, 0),
    'KeyD': new v2(speed, 0)
}
function draw(){
    context.fillStyle = "white"
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
            console.log(vel)
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





    window.requestAnimationFrame(loop)
}
loop()
