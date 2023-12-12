// Define the game configuration
const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Set gravity to 0
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let phaserGame;

function startGame() {
    if (!phaserGame) {
        phaserGame = new Phaser.Game(gameConfig); 
    }
}

function preload() {
    this.load.spritesheet('player', 'dance_rat.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('rock', 'assets/rock.png');
}

function create() {
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);

    this.rocks = this.physics.add.group();

    this.physics.add.collider(this.player, this.rocks, gameOver, null, this);

    this.time.addEvent({ delay: 1000, callback: spawnRock, callbackScope: this, loop: true });

    
    this.input.keyboard.on('keydown_SPACE', () => {
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-300);
            this.player.anims.play('jump', true);
        }
    });

    this.input.keyboard.on('keyup_SPACE', () => {
        this.player.anims.stop('jump');
        this.player.setTexture('player', 0); 
    });
}

function update() {
    
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-300);
        this.player.anims.play('jump', true);
    } else {
        this.player.anims.stop('jump');
        this.player.setTexture('player', 0); 
    }

    
    this.rocks.children.iterate(function (rock) {
        rock.setVelocityX(200);
    });
}


function spawnRock() {
    const y = Phaser.Math.Between(0, 600); 
    const rock = this.physics.add.image(0, y, 'rock'); 
    rock.setGravityX(200); 
    this.rocks.add(rock); 
}

function gameOver() {
    this.physics.pause();
    alert('Game Over!');
}

document.getElementById('start-button').addEventListener('click', startGame);





