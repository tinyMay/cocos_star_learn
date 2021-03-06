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
        pickRadius: 0,
        game: {
            default: null,
            serializable: false
        },
        playerPos: 0,
        position: 0,
        dist: 0,
        count: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {

    },
    getPlayerDistance: function() {
        var playerPos = this.game.player.getPosition();
        var dist = cc.pDistance(this.node.position, playerPos);
        this.playerPos = playerPos;
        this.position = this.node.position;
        this.dist = dist;
        return dist;
    },
    onPicked: function() {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
    },
    // start () {

    // },

    update: function(dt) {
        if(this.getPlayerDistance() < this.pickRadius) {
            console.log("pick");
            console.log(this.playerPos);
            console.log(this.position);
            console.log(this.dist);
            this.onPicked();
            return;
        }
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },
});
