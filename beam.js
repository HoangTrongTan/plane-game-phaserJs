class Beam extends Phaser.GameObjects.Image{
    constructor(scene){
        var x = scene.player.x;
        var y = scene.player.y - 16;

        super( scene , x , y , "bullet" );

        scene.add.existing(this);//thêm đối tượng Beam vào cảnh 

        scene.physics.world.enableBody(this);// Kích hoạt physics cho đối tượng này
        scene.projectiles.add(this);
        this.body.velocity.y = - 250;// Đặt tốc độ theo trục y
    }
    update(){
        if(this.y < 32){
            this.destroy();
            console.log("hủy");
        }
    }
}