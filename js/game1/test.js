function Game(viewport, stats) {
    this.viewport = viewport;
    this.mouse = {x: 0, y: 0};
}

Game.prototype.init = function() {
    var scope = this;
    this.viewport.addEventListener('mousedown', function(e){scope.on_mouse_down(e);}, false);
};

Game.prototype.on_mouse_down = function(e){
    this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    console.log("this.down", this.mouse.x, this.mouse.y, this);
};

//Game.prototype.init_events = function (){
//    console.log("this1=", this);
//    this.viewport.addEventListener('mousemove',   this.on_mouse_move_2,   false);
//    //viewport.addEventListener('mousedown',   Game.prototype.on_mouse_down,   false);
//    //viewport.addEventListener('mouseup',     Game.prototype.on_mouse_up,     false);
//};