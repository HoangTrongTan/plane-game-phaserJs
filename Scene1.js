class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }
  preload() {
    this.load.image("background", "assets/images/background.png");
    // this.load.image("ship", "assets/images/ship.png");
    // this.load.image("ship2", "assets/images/ship2.png");
    // this.load.image("ship3", "assets/images/ship3.png");
    
    //load âm thanh bắn-------------
    this.load.audio("audio_beam" , ["assets/sound/shot.mp3"]);
    this.load.audio("audio_explosion" , ["assets/sound/grenade.mp3"]);
    this.load.audio("music" , ["assets/sound/music2.mp3" , "assets/sound/music2.ogg"]);
    //=====================

    this.load.image("player", "assets/images/player.png");
    this.load.image("bullet", "assets/images/bullet.png");

    // load font
    this.load.bitmapFont("pixelFont", "assets/font/Unnamed.png" , "assets/font/Unnamed.xml");//"pixelFont" là tên của phông chữ, bạn có thể đặt tên theo ý muốn.
    //=============
    this.load.spritesheet("ship", "assets/images/ship.png" , {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("ship2", "assets/images/ship2.png" , {
      frameWidth: 32,
      frameHeight: 16
    });
    this.load.spritesheet("ship3", "assets/images/ship3.png" , {
      frameWidth: 32,
      frameHeight: 32
    });
    // 

    this.load.spritesheet("explosion", "assets/images/explosion.png" , { // load hoạt ảnh vào
      frameWidth: 16,
      frameHeight: 16
    } );

    this.load.spritesheet("power-up","assets/images/power-up.png" , {
      frameWidth: 16,
      frameHeight: 16
    } );
  }
  create() {
    

    this.add.text(20, 20, "Loading game...", {
      font: "25px Arial",
      fill: "yellow",
    });
    this.scene.start("PlayGame");

    // create 
    this.anims.create({
      key:"ship1_anim",
      frames: this.anims.generateFrameNumbers("ship"), //lấy ở bên scene 1
      frameRate: 20, //fps
      repeat: -1 // lặp lại hành động vô hạn
    });
    this.anims.create({
      key:"ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key:"ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key:"explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    // power-up
    this.anims.create({
      key:"red",
      frames:this.anims.generateFrameNumbers( "power-up" , {
        start: 0,
        end: 1
      } ),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers( "power-up" , {
        start: 2,
        end: 3
      } ),
      frameRate: 20,
      repeat: -1
    });
  }
}
