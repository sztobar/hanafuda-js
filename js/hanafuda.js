// Generated by CoffeeScript 1.6.2
(function() {
  'use strict';
  var ActiveObject, ActiveText, Board, CanvasHolder, Card, CardContainer, Deck, Menu, Text,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CanvasHolder = (function() {
    function CanvasHolder(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
    }

    return CanvasHolder;

  })();

  ActiveObject = (function(_super) {
    __extends(ActiveObject, _super);

    function ActiveObject(canvas, x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      ActiveObject.__super__.constructor.call(this, canvas);
      this.hover = false;
      this.strokeStyle = 'green';
    }

    ActiveObject.prototype.isHover = function(mx, my) {
      if (mx > this.x && mx < this.x + this.width && my > this.y && my < this.y + this.height) {
        return this.hover = true;
      } else {
        return this.hover = false;
      }
    };

    ActiveObject.prototype.stroke = function() {
      this.ctx.strokeStyle = this.strokeStyle;
      return this.ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    };

    return ActiveObject;

  })(CanvasHolder);

  ActiveText = (function(_super) {
    __extends(ActiveText, _super);

    function ActiveText(canvas, text, style, x, y, width, height) {
      this.text = text;
      this.style = style;
      ActiveText.__super__.constructor.call(this, canvas, x, y, width, height);
      this.strokeStyle = 'blue';
    }

    ActiveText.prototype.draw = function() {
      if (this.hover) {
        this.stroke();
      }
      return Text.fillText(this.style, this.text, this.x + 3, this.y + 3);
    };

    return ActiveText;

  })(ActiveObject);

  CardContainer = (function(_super) {
    __extends(CardContainer, _super);

    function CardContainer(canvas, x, y, visibility) {
      this.visibility = visibility;
      CardContainer.__super__.constructor.call(this, canvas, x, y, 56, 90);
      this.cards = [];
    }

    CardContainer.prototype.draw = function() {
      var card, _i, _len, _results;

      _results = [];
      for (_i = 0, _len = cards.length; _i < _len; _i++) {
        card = cards[_i];
        _results.push(card.draw());
      }
      return _results;
    };

    return CardContainer;

  })(ActiveObject);

  Board = (function(_super) {
    __extends(Board, _super);

    function Board(canvas, cardlist) {
      this.logic = __bind(this.logic, this);
      this.mouseMove = __bind(this.mouseMove, this);      Board.__super__.constructor.call(this, canvas);
      this.background = this.ctx.createRadialGradient(350, 223, 0, 350, 223, 700);
      this.background.addColorStop(0, '#fff');
      this.background.addColorStop(1, '#000');
      this.deck = new Deck(canvas, cardlist);
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

    Board.prototype.mouseClick = function(event) {
      var mx, my;

      mx = event.pageX;
      my = event.pageY;
      if (!this.lock) {
        switch (this.gamestate) {
          case 1:
            if (this.menu.hover) {
              return this.startGame();
            }
        }
      }
    };

    Board.prototype.mouseMove = function(event) {
      var mx, my;

      mx = event.pageX - this.canvas.offsetLeft;
      my = event.pageY - this.canvas.offsetTop;
      if (!this.lock) {
        switch (this.gamestate) {
          case 1:
            return this.menu.isHover(mx, my);
        }
      }
    };

    Board.prototype.logic = function() {
      return this.draw();
    };

    Board.prototype.startGame = function() {
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

    function Deck(canvas, cardlist) {
      var card, _i, _len;

      Deck.__super__.constructor.call(this, canvas);
      this.cards = [];
      for (_i = 0, _len = cardlist.length; _i < _len; _i++) {
        card = cardlist[_i];
        this.cards.push(new Card(canvas, card.month, card.type, card.x, card.y));
      }
      _.shuffle(this.cards);
    }

    return Deck;

  })(CanvasHolder);

  Card = (function(_super) {
    __extends(Card, _super);

    function Card(canvas, month, type, imgx, imgy) {
      this.month = month;
      this.type = type;
      this.imgx = imgx;
      this.imgy = imgy;
      Card.__super__.constructor.call(this, canvas, 20, 177, 56, 90);
      this.busy = false;
      this.vis = true;
    }

    Card.prototype.draw = function() {
      if (this.vis) {
        return this.ctx.drawImage(Card.cardimg, this.imgx, this.imgy, this.width, this.height, this.x, this.y, this.width, this.height);
      } else {
        return this.ctx.drawImage(Card.backimg, this.x, this.y, this.width, this.height);
      }
    };

    return Card;

  })(ActiveObject);

  Menu = (function(_super) {
    __extends(Menu, _super);

    function Menu(canvas) {
      Menu.__super__.constructor.call(this, canvas);
      this.startText = new ActiveText(canvas, 'Start', Text.pica, 300, 250, 100, 40);
    }

    Menu.prototype.draw = function() {
      Text.fillText(Text.title, 'Hanafuda', this.canvas.width / 2, 140);
      return this.startText.draw();
    };

    Menu.prototype.isHover = function(mx, my) {
      return this.startText.isHover(mx, my);
    };

    return Menu;

  })(CanvasHolder);

  Text = (function() {
    function Text() {}

    Text.setCanvas = function(canvas) {
      return this.ctx = canvas.getContext('2d');
    };

    Text.title = function() {
      Text.ctx.fillStyle = 'black';
      Text.ctx.textAlign = 'center';
      Text.ctx.textBaseline = 'top';
      return Text.ctx.font = '67pt Stencil';
    };

    Text.pica = function() {
      Text.ctx.fillStyle = 'black';
      Text.ctx.textAlign = 'left';
      Text.ctx.textBaseline = 'top';
      return Text.ctx.font = '30pt IM Fell DW Pica SC';
    };

    Text.set = function() {
      Text.ctx.fillStyle = 'black';
      Text.ctx.textAlign = 'left';
      Text.ctx.font = '10pt IM Fell DW Pica SC';
      return Text.ctx.textBaseline = 'top';
    };

    Text.score = function() {
      Text.ctx.fillStyle = 'black';
      Text.ctx.textAlign = 'left';
      Text.ctx.font = '18pt IM Fell DW Pica SC';
      return Text.ctx.textBaseline = 'top';
    };

    Text.fillText = function(fun, str, x, y) {
      fun();
      return this.ctx.fillText(str, x, y);
    };

    Text.strokeText = function(fun, str, x, y) {
      fun();
      return this.ctx.strokeText(str, x, y);
    };

    return Text;

  }).call(this);

  define('hanafuda', ['underscore', 'text!cards.json'], function(_, cards) {
    var init;

    init = function() {
      var board, canvas, cardlist;

      canvas = $('canvas')[0];
      cardlist = JSON.parse(cards);
      Text.setCanvas(canvas);
      Card.frontimg = new Image();
      Card.frontimg.src = 'img/cards.png';
      Card.backimg = new Image();
      Card.backimg.src = 'img/back.png';
      board = new Board(canvas, cardlist);
      $('canvas').bind({
        click: board.mouseClick,
        mousemove: board.mouseMove
      });
      return board.init();
    };
    return {
      init: init
    };
  });

}).call(this);
