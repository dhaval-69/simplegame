const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
let speedX = 10;
let speedY = 10;
let x = canvas.width / 2;
let y = canvas.height / 2;
let r = 39;
function circle(){
    ctx.clearRect(0,0, canvas.width,canvas.height)
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
}
function update(){
    x += speedX
    y += speedY
    if(x > canvas.width - r || x < r){
        speedX = -speedX
    }
    if(y > canvas.height - r || y < r){
        speedY = -speedY
    }
}

// code: KeyW
//document.addEventListener('keydown', (e)=>{
//    if (e.code === "KeyW") {
//        update()
//    }
//})
function loop() {
    circle() 
    update()
    window.requestAnimationFrame(loop)
}
loop()
