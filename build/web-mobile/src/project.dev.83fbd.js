require = function() {
  function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = "function" == typeof require && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n || e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = "function" == typeof require && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  }
  return e;
}()({
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3f2c1OzGDFEpblaNYalIG0C", "game");
    "use strict";
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
      onLoad: function onLoad() {
        var self = this;
        this.timer = 0;
        this.starDuration = 0;
        this.groundY = this.ground.y + this.ground.height / 2;
        console.log("ground.y:" + this.ground.y + ",ground.height:" + this.ground.height);
        this.spawnNewStar();
        this.score = 0;
        this.player.getComponent("player").game = this;
      },
      spawnNewStar: function spawnNewStar() {
        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent("star").game = this;
        this.starDuration = this.minStarDUration + cc.random0To1() * (this.maxStarDuration - this.minStarDUration);
        this.timer = 0;
      },
      getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        var randY = this.groundY + this.player.getComponent("player").jumpHeight + 50 * cc.random0To1();
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;
        console.log("randX:" + randX + ",randY:" + randY + ",node.width:" + this.node.width);
        return cc.p(randX, randY);
      },
      update: function update(dt) {
        if (this.timer > this.starDuration) {
          this.gameOver();
          return;
        }
        this.timer += dt;
      },
      gainScore: function gainScore() {
        this.score += 1;
        this.scoreDisplay.string = "Score: " + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);
      },
      gameOver: function gameOver() {
        this.player.stopAllActions();
        cc.director.loadScene("game");
      }
    });
    cc._RF.pop();
  }, {} ],
  player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9bf9fjrsKtCk5paCmiQzVmV", "player");
    "use strict";
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
      onLoad: function onLoad() {
        var self = this;
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
        this.accLeft = false;
        this.accRight = false;
        this.gameWidth = this.game.node.width;
        console.log("gameWidth:" + this.gameWidth);
        this.setInputControl();
        this.game.node.on("touchstart", function(event) {
          var pos = event.touch._point;
          console.log("touchstart: pos.x:" + pos.x);
          pos.x < self.gameWidth / 2 ? self.setTouchControl("start", "left") : self.setTouchControl("start", "right");
        });
        this.game.node.on("touchend", function(event) {
          var pos = event.touch._point;
          console.log("touchend: pos.x:" + pos.x + ",self.game.node.width:" + self.game.node.width);
          pos.x < self.gameWidth / 2 ? self.setTouchControl("end", "left") : self.setTouchControl("end", "right");
        });
      },
      setJumpAction: function setJumpAction() {
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
      },
      playJumpSound: function playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
      },
      setInputControl: function setInputControl() {
        var self = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(event) {
          switch (event.keyCode) {
           case cc.KEY.a:
            self.accLeft = true;
            break;

           case cc.KEY.d:
            self.accRight = true;
          }
        });
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function(event) {
          switch (event.keyCode) {
           case cc.KEY.a:
            self.accLeft = false;
            break;

           case cc.KEY.d:
            self.accRight = false;
          }
        });
      },
      setTouchControl: function setTouchControl(touchType, dir) {
        var self = this;
        "start" == touchType ? "left" == dir ? self.accLeft = true : self.accRight = true : "left" == dir ? self.accLeft = false : self.accRight = false;
        console.log("setTouchControl:  self.accLeft:" + self.accLeft + ",self.accRight:" + self.accRight);
      },
      update: function update(dt) {
        this.accLeft ? this.xSpeed -= this.accel * dt : this.accRight && (this.xSpeed += this.accel * dt);
        Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
        var x = this.node.x + this.xSpeed * dt;
        var xL = -this.gameWidth / 2 + this.node.width / 2;
        var xR = this.gameWidth / 2 - this.node.width / 2;
        this.node.x = x < xL ? xL : x > xR ? xR : x;
      }
    });
    cc._RF.pop();
  }, {} ],
  star: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0b653tB/klAE4u7SvveJsQm", "star");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
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
      onLoad: function onLoad() {},
      getPlayerDistance: function getPlayerDistance() {
        var playerPos = this.game.player.getPosition();
        var dist = cc.pDistance(this.node.position, playerPos);
        this.playerPos = playerPos;
        this.position = this.node.position;
        this.dist = dist;
        return dist;
      },
      onPicked: function onPicked() {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
      },
      update: function update(dt) {
        if (this.getPlayerDistance() < this.pickRadius) {
          console.log("pick");
          console.log(this.playerPos);
          console.log(this.position);
          console.log(this.dist);
          this.onPicked();
          return;
        }
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "game", "player", "star" ]);