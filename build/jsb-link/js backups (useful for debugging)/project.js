require = function c(s, a, r) {
function h(i, t) {
if (!a[i]) {
if (!s[i]) {
var e = "function" == typeof require && require;
if (!t && e) return e(i, !0);
if (u) return u(i, !0);
var o = new Error("Cannot find module '" + i + "'");
throw o.code = "MODULE_NOT_FOUND", o;
}
var n = a[i] = {
exports: {}
};
s[i][0].call(n.exports, function(t) {
var e = s[i][1][t];
return h(e || t);
}, n, n.exports, c, s, a, r);
}
return a[i].exports;
}
for (var u = "function" == typeof require && require, t = 0; t < r.length; t++) h(r[t]);
return h;
}({
game: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "3f2c1OzGDFEpblaNYalIG0C", "game");
cc.Class({
extends: cc.Component,
properties: {
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
onLoad: function() {
this.timer = 0;
this.starDuration = 0;
this.groundY = this.ground.y + this.ground.height / 2;
console.log("ground.y:" + this.ground.y + ",ground.height:" + this.ground.height);
this.spawnNewStar();
this.score = 0;
this.player.getComponent("player").game = this;
},
spawnNewStar: function() {
var t = cc.instantiate(this.starPrefab);
this.node.addChild(t);
t.setPosition(this.getNewStarPosition());
(t.getComponent("star").game = this).starDuration = this.minStarDUration + cc.random0To1() * (this.maxStarDuration - this.minStarDUration);
this.timer = 0;
},
getNewStarPosition: function() {
var t, e = this.groundY + this.player.getComponent("player").jumpHeight + 50 * cc.random0To1(), i = this.ground.width / 2 - this.starPrefab.data.width;
t = cc.randomMinus1To1() * i;
console.log("randX:" + t + ",randY:" + e + ",ground.width:" + this.ground.width);
return cc.p(t, e);
},
update: function(t) {
this.timer > this.starDuration ? this.gameOver() : this.timer += t;
},
gainScore: function() {
this.score += 1;
this.scoreDisplay.string = "Score: " + this.score.toString();
cc.audioEngine.playEffect(this.scoreAudio, !1);
},
gameOver: function() {
this.player.stopAllActions();
cc.director.loadScene("game");
}
});
cc._RF.pop();
}, {} ],
player: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "9bf9fjrsKtCk5paCmiQzVmV", "player");
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
serializable: !1
}
},
onLoad: function() {
var i = this;
this.jumpAction = this.setJumpAction();
this.node.runAction(this.jumpAction);
this.accLeft = !1;
this.accRight = !1;
this.gameWidth = this.game.node.width;
console.log("gameWidth:" + this.gameWidth);
this.setInputControl();
this.game.node.on("touchstart", function(t) {
var e = t.touch._point;
console.log("touchstart: pos.x:" + e.x);
e.x < i.gameWidth / 2 ? i.setTouchControl("start", "left") : i.setTouchControl("start", "right");
});
this.game.node.on("touchend", function(t) {
var e = t.touch._point;
console.log("touchend: pos.x:" + e.x + ",self.game.node.width:" + i.game.node.width);
e.x < i.gameWidth / 2 ? i.setTouchControl("end", "left") : i.setTouchControl("end", "right");
});
},
setJumpAction: function() {
var t = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut()), e = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn()), i = cc.callFunc(this.playJumpSound, this);
return cc.repeatForever(cc.sequence(t, e, i));
},
playJumpSound: function() {
cc.audioEngine.playEffect(this.jumpAudio, !1);
},
setInputControl: function() {
var e = this;
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(t) {
switch (t.keyCode) {
case cc.KEY.a:
e.accLeft = !0;
break;

case cc.KEY.d:
e.accRight = !0;
}
});
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function(t) {
switch (t.keyCode) {
case cc.KEY.a:
e.accLeft = !1;
break;

case cc.KEY.d:
e.accRight = !1;
}
});
},
setTouchControl: function(t, e) {
var i = this;
"start" == t ? "left" == e ? i.accLeft = !0 : i.accRight = !0 : "left" == e ? i.accLeft = !1 : i.accRight = !1;
console.log("setTouchControl:  self.accLeft:" + i.accLeft + ",self.accRight:" + i.accRight);
},
update: function(t) {
this.accLeft ? this.xSpeed -= this.accel * t : this.accRight && (this.xSpeed += this.accel * t);
Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
var e = this.node.x + this.xSpeed * t;
this.groundWidth = this.game.ground.width;
var i = -this.groundWidth / 2 + this.node.width, o = this.groundWidth / 2 - this.node.width;
this.node.x = e < i ? i : o < e ? o : e;
}
});
cc._RF.pop();
}, {} ],
star: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "0b653tB/klAE4u7SvveJsQm", "star");
cc.Class({
extends: cc.Component,
properties: {
pickRadius: 0,
game: {
default: null,
serializable: !1
},
playerPos: 0,
position: 0,
dist: 0,
count: 0
},
onLoad: function() {},
getPlayerDistance: function() {
var t = this.game.player.getPosition(), e = cc.pDistance(this.node.position, t);
this.playerPos = t;
this.position = this.node.position;
return this.dist = e;
},
onPicked: function() {
this.game.spawnNewStar();
this.game.gainScore();
this.node.destroy();
},
update: function(t) {
if (this.getPlayerDistance() < this.pickRadius) {
console.log("pick");
console.log(this.playerPos);
console.log(this.position);
console.log(this.dist);
this.onPicked();
} else {
var e = 1 - this.game.timer / this.game.starDuration;
this.node.opacity = 50 + Math.floor(205 * e);
}
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "game", "player", "star" ]);