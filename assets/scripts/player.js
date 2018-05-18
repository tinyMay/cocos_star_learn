// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        xSpeed: 0,
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        },
        game: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        var self = this;
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        this.accLeft = false;
        this.accRight = false;
        this.gameWidth = this.game.node.width;
        console.log("gameWidth:"+this.gameWidth)
        this.setInputControl();
        this.game.node.on("touchstart", function(event) {
            var pos = event.touch._point;
            console.log("touchstart: pos.x:"+pos.x);
            if(pos.x < self.gameWidth/2) {
                self.setTouchControl("start","left");
            } else {
                self.setTouchControl("start","right");
            }
        });
        this.game.node.on("touchend", function(event) {
            var pos = event.touch._point;
            console.log("touchend: pos.x:"+pos.x+",self.game.node.width:"+self.game.node.width)
            if(pos.x < self.gameWidth/2) {
                self.setTouchControl("end","left");
            } else {
                self.setTouchControl("end","right");
            }
        });
    },
    setJumpAction: function() {
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut())
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn())
        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },
    playJumpSound: function() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    setInputControl: function() {
        var self = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(event) {
            switch(event.keyCode) {
                case cc.KEY.a:
                    self.accLeft = true;
                    break;
                case cc.KEY.d:
                    self.accRight = true;
                    break;
            }
        })
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function(event) {
            switch(event.keyCode) {
                case cc.KEY.a:
                    self.accLeft = false;
                    break;
                case cc.KEY.d:
                    self.accRight = false;
                    break;
            }
        })
    },
    setTouchControl: function(touchType, dir) {
        var self = this;
        if(touchType == 'start') {
            if(dir == 'left') {
                self.accLeft = true;
            } else {
                self.accRight = true;
            }
        } else {
            if(dir == 'left') {
                self.accLeft = false;
            } else {
                self.accRight = false;
            }
        }
        console.log("setTouchControl:  self.accLeft:"+self.accLeft+",self.accRight:"+self.accRight)
    },
    update: function(dt) {
        // console.log("update setTouchControl:  self.accLeft:"+self.accLeft+",self.accRight:"+self.accRight)
        if(this.accLeft) {
            // this.xSpeed = -20;
            this.xSpeed -= this.accel * dt;
        } else if(this.accRight) {
            // this.xSpeed = 20;
            this.xSpeed += this.accel * dt;
        }

        if(Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        var x = this.node.x + this.xSpeed * dt;
        this.groundWidth = this.game.ground.width;
        var xL = -this.groundWidth/2 + this.node.width;
        var xR = this.groundWidth/2 - this.node.width;
        if(x < xL) {
            this.node.x = xL;
        } else if(x > xR) {
            this.node.x = xR;
        } else {
            this.node.x = x;
        }
        // this.node.x += this.xSpeed * dt;
        // console.log("accLeft:"+this.accLeft+",accRight:"+this.accRight+",accel:"+this.accel+",xSpeed"+this.xSpeed);
    },
});
