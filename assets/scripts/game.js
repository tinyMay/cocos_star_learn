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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        maxStarDuration: 0,
        minStarDUration: 0,
        ground: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        controlDescDisplay: {
            default: null,
            type: cc.Label
        },
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        var self = this;
        this.timer = 0;
        this.starDuration = 0;
        this.groundY = this.ground.y + this.ground.height/2;
        console.log("ground.y:"+this.ground.y+",ground.height:"+this.ground.height)
        this.spawnNewStar();
        this.score = 0;
        this.player.getComponent('player').game = this;
        // this.node.on("touchstart", function(event) {
        //     var pos = event.touch._point;
        //     console.log("touchstart")
        //     console.log(event.touch._point);
        //     if(pos.x < this.node.width/2) {
        //         this.player.setTouchControl("start","left");
        //     } else {
        //         this.player.setTouchControl("start","right");
        //     }
        // }.bind(this));
        // this.node.on("touchend", function(event) {
        //     var pos = event.touch._point;
        //     console.log("touchend")
        //     console.log(event.touch._point);
        //     if(pos.x < this.node.width/2) {
        //         this.player.setTouchControl("end","left");
        //     } else {
        //         this.player.setTouchControl("end","right");
        //     }
        // }.bind(this));
    },

    spawnNewStar: function() {
        var newStar = cc.instantiate(this.starPrefab);
        // newStar.parent = this.node;
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('star').game = this;
        this.starDuration = this.minStarDUration + cc.random0To1() * (this.maxStarDuration - this.minStarDUration);
        this.timer = 0;
    },
    getNewStarPosition: function() {
        var randX = 0;
        // var randY = this.groundY + cc.random0To1() * this.player.getComponent("player").jumpHeight + 50;
        var randY = this.groundY + this.player.getComponent("player").jumpHeight + cc.random0To1() * 50;
        var maxX = this.ground.width/2;
        randX = cc.randomMinus1To1() * maxX;
        // randX = cc.random0To1() * this.node.width;
        console.log("randX:"+randX+",randY:"+randY+",ground.width:"+this.ground.width)
        return cc.p(randX, randY);
    },
    // start () {

    // },

    update: function(dt) {
        if(this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },
    gainScore: function() {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },
    gameOver: function() {
        this.player.stopAllActions();
        cc.director.loadScene('game');
    }
});
