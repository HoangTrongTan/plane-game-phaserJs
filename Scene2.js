class Scene2 extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  zeroPad(number, size){
    var stringNumber = String(number);
    while(stringNumber.length < (size || 2)){
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
  taoDiem() {
    //tạo điểm
    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0 );
    graphics.lineTo( config.width, 0 );
    graphics.lineTo( config.width, 20 );
    graphics.lineTo( 0, 20 );
    graphics.lineTo( 0, 0 );
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 1, "pixelFont", "SCORE", 16); // 4 là text hiển thị
    //================
  }
  Sound(){
    this.beamSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_explosion");
    this.music = this.sound.add("music");
    var musicConfig = {
      mute:false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    };
    this.music.play(musicConfig);  
  }
  create() {
    // this.background = this.add.image(0, 0, "background");
    this.background = this.add.tileSprite( 0, 0, config.width, config.height, "background" );
    this.background.setOrigin(0, 0);
    this.background.setScrollFactor(0);
    // this.background.tilePositionX = this.cameras.main.scrollX * 0.3; 

    this.taoDiem();

    this.Sound();

    this.player = this.physics.add.image(
      config.width / 2,
      config.height - 50,
      "player"
    );
    this.player.setCollideWorldBounds(true);
    // this.player.setBounce(1);
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.ship1 = this.add.sprite(
      config.width / 2 - 50,
      config.height / 2,
      "ship"
    );
    this.ship2 = this.add.sprite(config.width / 2, config.height / 2, "ship2");
    this.ship3 = this.add.sprite(
      config.width / 2 + 50,
      config.height / 2,
      "ship3"
    );

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.powerUps = this.physics.add.group(); // thêm một nhóm có tên powerUps
    // mảng đạn
    this.projectiles = this.add.group();

    var maxObjects = 4;
    for (var i = 0; i <= maxObjects; i++) {
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, game.config.width, game.config.heght);

      if (Math.random() > 0.5) {
        powerUp.play("red");
      } else {
        powerUp.play("gray");
      }

      powerUp.setVelocity(100, 100); //tốc độ chuyển động là 100 pixel/giây theo trục x và 100 pixel/giây theo trục y. và hướng bay
      powerUp.setCollideWorldBounds(true); //Dòng này bật hoặc tắt va chạm với ranh giới của thế giới trong trò chơi. Nếu được đặt là true, đối tượng (powerUp trong trường hợp này) sẽ không thể vượt ra khỏi biên của thế giới
      powerUp.setBounce(1); //Dòng này đặt độ nảy của đối tượng khi va chạm. Trong trường hợp này, độ nảy được đặt là 1, nghĩa là khi đối tượng va chạm với một ranh giới hoặc một vật thể khác, nó sẽ phản xạ với mức độ độ nảy là 1 (hoàn toàn phản xạ).
    }

    this.ship1.play("ship1_anim"); //chạy animation trên đối tượng sprite được tạo ra từ hình ảnh sprite
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive(); //là một phương thức được gọi trên đối tượng sprite để kích hoạt khả năng tương tác với người chơi. Khi một sprite được đặt là tương tác, nó có thể phản ứng với các sự kiện như click, hover, drag, và nhiều sự kiện khác.
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on("gameobjectdown", this.destroyShip, this); // được sử dụng để đăng ký một trình lắng nghe sự kiện cho sự kiện 'gameobjectdown'. Điều này có nghĩa là khi một game object (đối tượng trong trò chơi, chẳng hạn như một sprite) được nhấp chuột, hàm this.destroyShip sẽ được gọi.

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // Add Text
    // this.add.text(20, 20, "Playing game", {
    //   font: "25px Arial",
    //   fill: "yellow",
    // });

    // this.ship1.setScale(5);
    // this.ship1.setOrigin(0.5);
    // this.ship1.flipY = true;
    // this.ship1.angle = 90;
    // this.cameras.main.startFollow(this.player);
    this.physics.add.collider(
      this.projectiles,
      this.powerUps,
      (projectiles, powerUps) => {
        projectiles.destroy();
      }
    );
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.pickPowerUp,
      null,
      this
    );

    this.physics.add.overlap( 
      this.player,
      this.enemies,
      this.hurtPlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );
  }
  hitEnemy(beam, enemy) {

    var explosion = new Explosion(this, enemy.x, enemy.y);
    
    beam.destroy();
    this.resetShipPos(enemy);
    this.score += 15;
    var scoreFormated = this.zeroPad(this.score , 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;
    
    this.explosionSound.play();  
  }
  hurtPlayer(player, enemy) {
    this.resetShipPos(enemy);
    // player.x = config.width / 2 - 8;
    // player.y = config.height - 64;
    if(this.player.alpha < 1){
      return;
    }
    var explosion = new Explosion(this, player.x, player.y);
    player.disableBody(true, true);
    // this.resetPlayer();
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    })
  }
  resetPlayer(){
    var x = config.width / 2 - 8;
    var y = config.height + 64;
    this.player.enableBody( true, x, y , true, true ); // 1. Bật tính năng vật lý, 3.Bật tính năng kích hoạt khi đối tượng rơi tự do , 4.Bật tính năng vật lý cho hình chữ nhật va chạm.

    this.player.alpha = 0.5;

    var tween = this.tweens.add({
      targets: this.player, //Là đối tượng hoặc mảng các đối tượng mà tween sẽ áp dụng.
      y: config.height - 64, // Giá trị mục tiêu của thuộc tính y của đối tượng trong suốt quá trình tweening.
      ease: 'Power1',//Là hàm chuyển động (easing function) được sử dụng để điều chỉnh cách giá trị biến đổi theo thời gian. Trong trường hợp này, 'Power1' đề cập đến hàm chuyển động cơ bản.
      duration: 1500,
      repeat: 0,//Số lần lặp lại tween. Trong trường hợp này, nếu đặt là 0, nghĩa là không lặp lại.
      onComplete: () => { // Hàm sẽ được gọi khi tween kết thúc.
        this.player.alpha = 1;
      },
      callbackScope: this
    });// tạo một hiệu ứng chuyển động cho đối tượng this.player. 
  }
  pickPowerUp(player, powerUp) {
    powerUp.disableBody(true, true); //tham số đầu tiên (true) là để vô hiệu hóa cơ thể vật lý của đối tượng, còn tham số thứ hai (true) là để ẩn đối tượng.

    this.explosionSound.play();
  }
  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship);
    }
  }
  resetShipPos(ship) {
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, config.width); //Phaser.Math.Between(min, max)
    var randomY = Phaser.Math.Between(0, Math.round(config.height / 3));
    ship.y = randomY;
    ship.x = randomX;
  }
  update() {
    this.background.tilePositionY -= 0.8; 
    // console.log(this.projectiles.children.entries.length);
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 1);
    this.moveShip(this.ship3, 1.5);
    this.movePlayerManager();
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if(this.player.active){
        this.shootBeam();
      }
    }
    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }
  shootBeam() {
    var beam = new Beam(this);
    this.beamSound.play();
  }
  movePlayerManager() {
    // di chuyển
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
    //
    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed);
    } else {
      this.player.setVelocityY(0);
    }
    //--end----
  }
  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion"); // Thay đổi hình ảnh của đối tượng thành "explosion"
    gameObject.play("explode"); // Chạy animation "explode" trên đối tượng
  }
}
