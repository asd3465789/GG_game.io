Player = function(gaming) {

    switch (who) {
        case 1:
            this.whoname = 'gg';
            this.ground = 480;
            break;
        case 2:
            this.whoname = 'pug';
            this.ground = 510;
            break;
        case 3:
            this.whoname = 'negative';
            this.ground = 480;
            break;
    }
this.deadline=this.ground;
    this.gaming = gaming;
    var frames_run = [],
        frames_idle = [],
        frames_jumpup = [],
        frames_jumpdown = [];

    for (var i = 5; i < 13; i++) {
        var val = i < 10 ? '0' + i : i;
        frames_run.push(PIXI.Texture.fromFrame(this.whoname + '_run_' + val + '.png'));
    }
    frames_idle.push(PIXI.Texture.fromFrame(this.whoname + '_run_01.png'));
    frames_idle.push(PIXI.Texture.fromFrame(this.whoname + '_run_02.png'));
    frames_jumpup.push(PIXI.Texture.fromFrame(this.whoname + '_run_03.png'));
    frames_jumpdown.push(PIXI.Texture.fromFrame(this.whoname + '_run_04.png'));

    this.anim_run = this.create_animation(frames_run);

    // this.anim_idle=create_animation(frames_idle);

    this.anim_jumpup = this.create_animation(frames_jumpup);

    this.anim_jumpdown = this.create_animation(frames_jumpdown);

    this.x_velocity = 0;
    this.y_velocity = 0;
    this.x = 360;
    this.y = app.screen.height / 2;



    this.isJump = false;
    this.isdie = false;
    this.isdying = false;
    this.isdead = false;

    this.jumptime=0;

    loader.resources.jump_se.data.volume = SE_maxvolume;
    loader.resources.jump_se.data.playbackRate = 1.2;
    loader.resources.dead_se.data.volume = SE_maxvolume;
}

Player.prototype.create_animation = function(anim_in, speed) {
    var anim = new PIXI.extras.AnimatedSprite(anim_in);
    anim.zIndex = -3;

    anim.animationSpeed = 0.2;
    anim.anchor.set(0.5);
    anim.play();
    this.gaming.addChild(anim);
    anim.visible = false;
    return anim;
}

Player.prototype.set_anim = function(anim) {
    anim.x = this.x;
    anim.y = this.y;
}

Player.prototype.setground = function(g,deadline) {
    this.ground = g;
    this.deadline=deadline;
}

Player.prototype.die = function() {
    return this.isdead;
}


Player.prototype.update = function(speed) {

    if (!this.isdie) {
        if ((controller.space.active || controller.screen_down.active) && !this.isJump) {
            loader.resources.jump_se.data.play();
            if(this.y_velocity>-25)
                this.y_velocity=-25;
            else
            this.y_velocity -= 4;
            if(this.jumptime>9){
                this.jumptime=0;                
                this.isJump = true;
            }

            this.jumptime+=1;

        }
        if(this.y_velocity > -25){
             this.isJump = true;
        }

        if (this.y >= this.ground && this.y_velocity >= 0) {
             this.jumptime=0; 
            this.y_velocity = 0;
            this.isJump = false;
            this.anim_run.visible = true;
            this.anim_jumpup.visible = false;
            this.anim_jumpdown.visible = false;
            this.set_anim(this.anim_run);

        } else {

            if (this.y_velocity < 0) {
                this.anim_run.visible = false;
                this.anim_jumpup.visible = true;
                this.anim_jumpdown.visible = false;

                this.set_anim(this.anim_jumpup);

            } else {
                this.anim_run.visible = false;
                this.anim_jumpup.visible = false;
                this.anim_jumpdown.visible = true;

                this.set_anim(this.anim_jumpdown);

            }

            this.y_velocity += 1;

        }

        this.anim_run.animationSpeed = 0.12 * speed;

        if (this.y > this.deadline + 10) {

            this.isdie = true;
        }

        this.x += this.x_velocity;
        if (this.y_velocity < -15)
            this.y += -15;
        else this.y += this.y_velocity;


    } else {

        if (!this.isdying) {
            this.isdying = true;
            this.y_velocity -= 50;

            this.anim_run.visible = true;
            this.anim_jumpup.visible = false;
            this.anim_jumpdown.visible = false;
            loader.resources.gaming_bgm.data.pause();
            loader.resources.dead_se.data.play();
            
        } else {

            this.anim_run.rotation +=0.05 ;
            this.y_velocity += 1.5;
            
            if (this.y_velocity < -15)
                this.y += -15;
            else
                this.y += this.y_velocity;
            this.set_anim(this.anim_run);
            if (this.y > 720)
                this.isdead = true;
        }
    }


    this.x_velocity *= 0.9;
    this.y_velocity *= 0.9;


}