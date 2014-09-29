// Generated by CoffeeScript 1.6.2
(function() {
  'use strict';
  var Board, CanvasHolder, Deck, Menu, Text, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CanvasHolder = (function() {
    function CanvasHolder(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
    }

    return CanvasHolder;

  })();

  Board = (function(_super) {
    __extends(Board, _super);

    function Board(canvas) {
      this.init = __bind(this.init, this);
      this.logic = __bind(this.logic, this);      Board.__super__.constructor.call(this, canvas);
      this.background = this.ctx.createRadialGradient(350, 223, 0, 350, 223, 700);
      this.background.addColorStop(0, '#fff');
      this.background.addColorStop(1, '#000');
      this.lock = false;
      this.gamestate = 1;
      this.menu = new Menu(canvas);
    }

    Board.prototype.draw = function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = this.background;
      this.ctx.fillRect(0, 0, 700, 700);
      switch (this.gamestate) {
        case 1:
          return this.menu.draw();
      }
    };

    Board.prototype.handleEvent = function(event) {
      var mx, my;

      mx = e.pageX;
      my = e.pageY;
      if (!this.lock) {
        switch (this.gamestate) {
          case 1:
            if (this.menu.isClicked(mc, my)) {
              return this.startGame();
            }
        }
      }
    };

    Board.prototype.logic = function() {
      return this.draw();
    };

    Board.prototype.startGame = function() {
      this.deck = new Deck();
      this.player = new Player();
      return this.opponent = new Opponent();
    };

    Board.prototype.init = function() {
      var self;

      self = this;
      return this.flow = setInterval(self.logic, 100);
    };

    return Board;

  })(CanvasHolder);

  Deck = (function(_super) {
    __extends(Deck, _super);

    function Deck(canvas) {
      Deck.__super__.constructor.call(this, canvas);
      this.cards = [];
      require(deck);
      this.cards.push(new Card());
    }

    return Deck;

  })(CanvasHolder);

  Menu = (function(_super) {
    __extends(Menu, _super);

    function Menu() {
      _ref = Menu.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Menu.prototype.draw = function() {
      Text.fillText(this.ctx, Text.title, 'Hanafuda', this.canvas.width / 2, 140);
      return Text.fillText(this.ctx, Text.pica, 'Start', this.canvas.width / 2, 250);
    };

    Menu.prototype.isClicked = function(mx, my) {
      if (mx > (this.canvas.width / 2) - 100 && mx < (canvas.width / 2) + 100 && my > 250 && my < 300) {
        return true;
      } else {
        return false;
      }
    };

    return Menu;

  })(CanvasHolder);

  Text = (function() {
    function Text() {}

    Text.title = function(ctx) {
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      return ctx.font = '67pt Stencil';
    };

    Text.pica = function(ctx) {
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      return ctx.font = '30pt IM Fell DW Pica SC';
    };

    Text.set = function(ctx) {
      ctx.fillStyle = 'black';
      ctx.textAlign = 'left';
      ctx.font = '10pt IM Fell DW Pica SC';
      return ctx.textBaseline = 'top';
    };

    Text.score = function(ctx) {
      ctx.fillStyle = 'black';
      ctx.textAlign = 'left';
      ctx.font = '18pt IM Fell DW Pica SC';
      return ctx.textBaseline = 'top';
    };

    Text.fillText = function(ctx, fun, str, x, y) {
      fun(ctx);
      return ctx.fillText(str, x, y);
    };

    Text.strokeText = function(ctx, fun, str, x, y) {
      fun(ctx);
      return ctx.strokeText(str, x, y);
    };

    return Text;

  })();

  $('document').ready(function() {
    var board, canvas;

    canvas = $('canvas')[0];
    board = new Board(canvas);
    canvas.click(board.handleEvent);
    return board.init();
  });

}).call(this);
