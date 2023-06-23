class Pixel {

    constructor(_x, _y, _c,_t,_a) {
        this.pos = createVector(_x, _y);
        this.couleur = _c;
        this.taille = _t;
        this.pixelNum = _a;
    }
    coul(){
        fill(this.couleur);
    }
    display() {
        //noStroke();
        rect(this.pos.x, this.pos.y, this.taille);
    }

    clicked() {
        this.d = dist(mouseX, mouseY, this.pos.x + this.taille/2, this.pos.y + this.taille/2);
        if (this.d < this.taille/2) {
            this.couleur = macoul;
            let data = {
                a : this.pixelNum,
                c : macoul
            }
            console.log(data);
            socket.emit('miseAjourPixel',data);
        }
    }
}