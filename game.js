var gameSettings = {
    playerSpeed: 200,
    
}
var config = { 
    width: 256,
    height: 272,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
    pixelArt: true, //Một cài đặt cho phép chế độ Pixel Art, nếu được đặt là true, nó sẽ giúp bảo toàn định dạng pixel khi thu nhỏ hình ảnh.
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }
}
var game = new Phaser.Game(config);