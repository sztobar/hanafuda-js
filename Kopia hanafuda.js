//hanafuda = function (){
    /*
	 * SkĹadniki globalne dla gry
	 */
    var cardsimg = new Image();
    cardsimg.src = 'cards.png';
    var cardback = new Image();
    cardback.src = 'back.png';
    var gamestate = 0;
    var canvas;
    var ctx;
    var i = 0;
    var turn = 1;
    var background;
    var freeslot1 = new FreeSlot();
    var freeslot2 = new FreeSlot();
    var lock = false;
    var win;


    var Text = {
        title: function () {
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = "67pt Stencil";
            //ctx.fillText(str, x, y);
        },
        pica: function () {
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = "30pt IM Fell DW Pica SC";
        },
        set: function () {
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.font = "10pt IM Fell DW Pica SC";
            ctx.textBaseline = "top";
        },
        score: function () {
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.font = "18pt IM Fell DW Pica SC";
            ctx.textBaseline = "top";
        },
        fillText: function (fun, str, x, y) {
            fun();
            ctx.fillText(str, x, y);
        },
        strokeText: function (fun, str, x, y) {
            fun();
            ctx.strokeText(str, x, y);
        }
    };

    /*
	 * Ekran zwyciestwa
	 */
    function Win(dealt, sets) {
        //this.draw = function (dealt) {
        draw();
        ctx.fillStyle = background;//"#878787";
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
        ctx.strokeStyle = "black";
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        var title = gamestate === 7 ? "Zwycięstwo" : gamestate === 8 ? "Remis" : "Przegrana";
        var subtitle = gamestate === 7 ? "Wygrałeś" : gamestate === 8 ? "" : "Przeciwnik wygrał";
        Text.fillText(Text.title, title, canvas.width / 2, 70);
        Text.fillText(Text.pica, subtitle, canvas.width / 2, 160);
        if (gamestate !== 8) {
            dealt.x = 500;
            dealt.y = 335;
            Text.score();
            for (var i = 0; i < sets.length; i++) {// 80, 170
                ctx.fillText(sets[i], 80, 200 + (20 * i));
            }
            ctx.fillText("Łącznie : " + dealt.mypoints + " pkt", 260, 200);
            //ctx.fillText(dealt.mypoints, 260, 190);
            dealt.draw();
        }
        //};
    }


    /*
	 * Klasa karty
	 */
    var card = function card (mo, ty, ix, iy) {
        var month = mo; // 1 - 12
        var type = ty; // 1 - 4
        var imgx = ix; // 56
        var imgy = iy; // 90
        var busy = false;
        return {
            x: 20,
            y: 177,
            width: 56,
            height: 90,
            vis: true,
            busy: false,
            draw: function () {
                //console.log(imgx + ", " + imgy + ", " + this.width + ", " + this.height + ", " + this.x + ", " + this.y + ", " + this.width + ", " + this.height);
                if (this.vis) {
                    ctx.drawImage(cardsimg, imgx, imgy, this.width, this.height, this.x, this.y, this.width, this.height);
                } else {
                    ctx.drawImage(cardback, this.x, this.y, this.width, this.height);
                }
            },
            toogleBusy: function () {
                if (busy) {
                    busy = false;
                } else {
                    busy = true;
                }
            },
            getBusy: function () {
                return busy;
            },
            match: function (card) {
                return (month === card.getMonth());
            },
            getMonth: function () {
                return month;
            },
            getType: function () {
                return type;
            }
        };
    };
    var nocard = card();
    nocard.vis = false;

    /*
	 * Klasa talii kart
	 */
    var deck = (function () {
        var cards = [];
        cards.push(card(1, 1, 0, 0));
        cards.push(card(1, 1, 56, 0));
        cards.push(card(1, 2, 112, 0));
        cards.push(card(1, 4, 168, 0));
        cards.push(card(2, 1, 0, 90));
        cards.push(card(2, 1, 56, 90));
        cards.push(card(2, 2, 112, 90));
        cards.push(card(2, 3, 168, 90));
        cards.push(card(3, 1, 0, 180));
        cards.push(card(3, 1, 56, 180));
        cards.push(card(3, 2, 112, 180));
        cards.push(card(3, 4, 168, 180));
        cards.push(card(4, 1, 0, 270));
        cards.push(card(4, 1, 56, 270));
        cards.push(card(4, 2, 112, 270));
        cards.push(card(4, 3, 168, 270));
        cards.push(card(5, 1, 0, 360));
        cards.push(card(5, 1, 56, 360));
        cards.push(card(5, 2, 112, 360));
        cards.push(card(5, 3, 168, 360));
        cards.push(card(6, 1, 0, 450));
        cards.push(card(6, 1, 56, 450));
        cards.push(card(6, 2, 112, 450));
        cards.push(card(6, 3, 168, 450));
        cards.push(card(7, 1, 224, 0));
        cards.push(card(7, 1, 280, 0));
        cards.push(card(7, 2, 336, 0));
        cards.push(card(7, 3, 392, 0));
        cards.push(card(8, 1, 224, 90));
        cards.push(card(8, 1, 280, 90));
        cards.push(card(8, 3, 336, 90));
        cards.push(card(8, 4, 392, 90));
        cards.push(card(9, 1, 224, 180));
        cards.push(card(9, 1, 280, 180));
        cards.push(card(9, 2, 336, 180));
        cards.push(card(9, 3, 392, 180));
        cards.push(card(10, 1, 224, 270));
        cards.push(card(10, 1, 280, 270));
        cards.push(card(10, 2, 336, 270));
        cards.push(card(10, 3, 392, 270));
        cards.push(card(11, 1, 224, 360));
        cards.push(card(11, 2, 280, 360));
        cards.push(card(11, 3, 336, 360));
        cards.push(card(11, 4, 392, 360));
        cards.push(card(12, 1, 224, 450));
        cards.push(card(12, 1, 280, 450));
        cards.push(card(12, 1, 336, 450));
        cards.push(card(12, 4, 392, 450));

        for (var j, x, i = cards.length; i; j = parseInt(Math.random() * i, 10), x = cards[--i], cards[i] = cards[j], cards[j] = x) {
            i = i;
        }//tasowanie
        return {
            x: 20,
            y: 177,
            width: 56,
            height: 90,
            freecard: undefined,
            draw: function () {
                ctx.drawImage(cardback, this.x, this.y, this.width, this.height);
                if (this.freecard !== undefined) {
                    this.freecard.draw();
                }
            },
            stroke: function () {
                ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
            },
            click: function (mx, my) {
                if (gamestate === 1) {
                    card = cards.pop();
                    table.add(card);
                    gamestate = 1;
                }
                else if (gamestate === 3) {
                    //card = cards.pop();
                    this.freecard = cards.pop();
                    this.freecard.vis = true;
                    this.freecard.y += 5;
                    gamestate = 4;
                    draw();
                    //this.freeslot.attach(card, this);
                }
            },
            pop: function () {
                return cards.pop();
            },
            isClicked: function (mx, my) {
                if (mx >= this.x && mx <= (this.x + this.width) &&
					my >= this.y && my <= (this.y + this.height)) {
                    this.click(mx, my);
                }
            }
        };
    })();


    /*
	 * Obiekt wyswietlajace komunikaty o postepie gry
	 */
    var message = (function () {
        return {
            text: "",
            draw: function () {
                switch (gamestate) {
                    case 0:
                        break;
                    case 1:
                        this.text = "Wybierz kartę z rękii.";
                        break;
                    case 2:
                        this.text = "Dopasuj do karty na stole.";
                        break;
                    case 3:
                        this.text = "Dobierz karte z talii.";
                        break;
                    case 4:
                        this.text = "Dopasuj do karty na stole.";
                        break;
                    case 5:
                    case 6:
                        this.text = "Tura Przeciwnika.";
                        break;
                    default:
                        this.text = "Koniec gry.";
                        break;
                }
                Text.fillText(Text.pica, this.text, canvas.width / 2, 445);
                // ctx.fillStyle = "black";
                // ctx.textAlign = "center";
                // ctx.font = "20pt IM Fell DW Pica SC";
                // ctx.textBaseline = "top";
                //ctx.font = Text.pica;
                //ctx.fillText(this.text, canvas.width / 2, 445);
            }
        };
    })();
    /*
	 * Klasa pomocnicza zawierajaca wspolrzedne x, y
	 */
    var pos = function (newx, newy) {
        return {
            x: newx,
            y: newy
        };
    };

    /*
	 * Kontener na karty
	 */
    function CardContainer(x, y, v) {
        this.cardspos = [];
        this.cards = [];
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 90;
        this.vis = v;
        this.action = function (i) { };
        this.draw = function () {
            for (var i = 0; i < this.cards.length; ++i) {
                if (this.cards[i]) {
                    this.cards[i].draw();
                }
            }
        };
        this.stroke = function () {
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 5, this.height + 10);
        };
        this.align = function () {
            for (var i = 0; i < this.cards.length; ++i) {
                if (this.cards[i] === undefined) {
                    for (var j = i; j <= this.cards.length - 1; ++j) {
                        this.cards[j] = this.cards[j + 1];
                        if (this.cards[j]) {
                            this.cards[j].x = this.cardspos[j].x;
                            this.cards[j].y = this.cardspos[j].y;
                        }
                    }
                }
            }
        };
        this.add = function (card) {
            for (var i = 0; i < this.cards.length; ++i) {
                if (this.cards[i] === nocard) {
					this.cards[i] = card;
					card.x = this.cardspos[i].x;
					card.y = this.cardspos[i].y;
					this.width += 61;
					console.log("Dodaję kartę na indeks - " + i + " o pozycji: " + this.cardspos[i].x + ", " + this.cardspos[i].y);
					break;
                }
            }
            /*
            card.vis = this.vis;
            var free_index = this.freeSlot();
            var slot = this.cardspos[free_index];
            var dx = (slot.x - card.x) / 20;
            var dy = (slot.y - card.y) / 20;
            delayfun(function () {
                card.x += dx;
                card.y += dy;
                draw();
                card.draw();
            }, 10, 20);
            this.cards[free_index] = card;
            this.width += 61;*/
        };
        this.freeSlot = function () {
            if (this.cards.length === 0) {
                return 0;
            }
            for (var i = 0; i < this.cards.length; ++i) {
                if (this.cards[i] === undefined) {
                    this.cards[i] = nocard;
                    return i;
                }
            }
        };
        this.isClicked = function (mx, my) {
            if (mx >= this.x && mx <= (this.x + this.width) &&
				my >= this.y && my <= (this.y + this.height)) {
                this.click(mx, my);
            }
        };
        this.click = function (mx, my) {
            //console.log("kliknieto kontener");
            var i;
            for (i = 0; i < this.cards.length; ++i) {
                if (this.cards[i] && !this.cards[i].getBusy()) {
                    if (mx >= this.cards[i].x && mx <= (this.cards[i].x + this.cards[i].width) &&
						my >= this.cards[i].y && my <= (this.cards[i].y + this.cards[i].height)) {
                        //console.log("Kliknieto karte");
                        this.cards[i].draw();
                        this.action(i);
                        i = this.cards.length + 1;
                        break;
                    }
                }
            }
            if (i !== this.cards.length + 1) {
                this.action2(i, true); //Specjalna metoda dla table
            }
        };
        this.remove = function (i) {
            var cardtmp = this.cards[i];
            //cardtmp.vis = true;
            this.width -= 61;
            this.cards[i] = undefined;
            return cardtmp;
        };
    }

    /*
	 * Klasa pomocnicza do przetrzymywania par kart
	 */
    function FreeSlot() {
        this.attach = function (card, tabi) {
            card.vis = true;
            this.tabi = tabi;
            table.cards[tabi].toogleBusy();
            //this.cardplacer = table.cardspos[tabi];
            this.x = table.cardspos[tabi].x + 5;
            this.y = table.cardspos[tabi].y + 5;
            var dx = (this.x - card.x) / 20;
            var dy = (this.y - card.y) / 20;
            delayfun(function () {
                card.x += dx;
                card.y += dy;
                draw();
                card.draw();
            }, 10, 20);
            this.card = card;
        };
        this.remove = function () {
            var cardtmp = this.card;
            this.card = undefined;
            return cardtmp;
        };
        this.removeplacer = function () {
            table.cards[this.tabi].toogleBusy();
            return table.remove(this.tabi);
        };
        this.ready = function () {
            if (table.cards[this.tabi] && this.card) {
                return true;
            }
            else {
                return false;
            }
        };
        this.draw = function () {
            if (this.cardplacer !== undefined) {
                this.cardplacer.draw();
            }
            if (this.card !== undefined) {
                this.card.draw();
            }
        };
    }

    /*
	 * Klasa kart na stole
	 */
    var table = new CardContainer(100, 130, true);
    for (i = 0; i < 8; ++i) {
        table.cardspos.push(pos((table.x + (61 * i)), table.y));
        table.cardspos.push(pos((table.x + (61 * i)), table.y + 95));
        table.cards.push(undefined);
        table.cards.push(undefined);
    }
    table.height = 185;
    table.stroke = function () {
        for (var i = 0; i < this.cards.length; ++i) {
            if (this.cards[i]) {
                this.width = this.cardspos[i].x - this.x + 61;
            }
        }
        ctx.strokeRect(this.x - 5, this.y - 5, this.width + 5, this.height + 10);
    };
    table.action2 = function (i, empty) {
        this.action(i, empty);
    };
    table.action = function (i, empty) {
        if (empty === undefined) {
            empty = false;
        }
        if (gamestate === 2) {
            if (!empty && hand.cards[hand.ready].match(this.cards[i])) {
                freeslot1.attach(hand.remove(hand.ready), i);
            } else {
                this.add(hand.remove(hand.ready));
            }
            lock = true;
            hand.align();
            delayfun(function () {
                gamestate = 3;
                lock = false;
            }, 300, 1);
        } else if (gamestate === 4) {
            var cardtmp = deck.freecard;
            deck.card = undefined;
            if (!empty && deck.freecard.match(this.cards[i])) {
                freeslot2.attach(cardtmp, i);
            } else {
                this.add(cardtmp);
            }
            lock = true;
            setTimeout(function () {
                if (freeslot1.ready() && freeslot2.ready()) {
                    mydealt.add(freeslot1.remove());
                    mydealt.add(freeslot1.removeplacer());
                    setTimeout(function () {
                        mydealt.add(freeslot2.remove());
                        mydealt.add(freeslot2.removeplacer());
                    }, 250);
                } else {
                    if (freeslot1.ready()) {
                        mydealt.add(freeslot1.remove());
                        mydealt.add(freeslot1.removeplacer());
                    } else if (freeslot2.ready()) {
                        mydealt.add(freeslot2.remove());
                        mydealt.add(freeslot2.removeplacer());
                    }
                }
                setTimeout(changePlayers, 300);
                //changePlayers();
            }, 300);
        }
    };

    function changePlayers() {
        setTimeout(function () {
            draw();
            if (gamestate === 4) {
                mydealt.check();
                if (gamestate === 4) {
                    ophand.play();
                }
            } else if (gamestate === 6) {
                opdealt.check();
                if (turn === 8) {
                    gamestate = 8;
                    Win();
                } else {
                    if (gamestate === 6) {
                        gamestate = 1;
                        lock = false;
                        ++turn;
                    }
                }
                draw();
            }
        }, 300);
    }

    function DealtCardContainer(x, y) {
        this.x = x;
        this.y = y;
        this.width = 56;
        this.height = 90;
        this.cards = [];
        this.buff = 0;
        this.align = function () {
            for (var i = 0; i < this.cards.length; ++i) {
                this.cards[i].x = this.x + (i * 10);
            }
        };
        this.add = function (card) {
            var dx = (this.x - card.x) / 20;
            //console.log("x - card.x/20: " + this.x + " - " + card.x + " = " + ((this.x - card.x) / 20));
            var dy = (this.y - card.y) / 20;
            this.align();
            delayfun(function () {
                card.x += dx;
                card.y += dy;
                draw();
                card.draw();
            }, 10, 20);
            this.cards.push(card);
            this.width += 10;
        };
        this.draw = function () {
            this.align();
            for (var i = 0; i < this.cards.length; ++i) {
                this.cards[i].draw();
            }
        };
    }
    /*
	 * Klasa zagranych zwyklych
	 */
    function Dealt(x, y, player) {
        this.set = [];
        this.x = x;
        this.y = y;
        this.mypoints = 0;
        this.player = player;
        this.set.push(new DealtCardContainer(x - 56, y));
        this.set.push(new DealtCardContainer(x - 56, y));
        this.set.push(new DealtCardContainer(x - 56, y));
        this.set.push(new DealtCardContainer(x - 56, y));
        this.align = function () {
            var j = 0;
            for (var i = 0; i < 4; ++i) {
                if (this.set[i].cards.length) {
                    this.set[i].x = this.x - this.set[i].width - j;
                    j += this.set[i].width;// + 5;
                }
            }
        };
        this.add = function (card) {
            var i = card.getType() - 1;
            this.set[i].add(card);
        };
        this.draw = function () {
            this.align();
            Text.set();
            for (var i = 0; i < 4; ++i) {
                if (this.set[i].cards.length) {
                    ctx.fillText(this.set[i].cards.length, this.set[i].x, this.set[i].y - 15);
                }
                this.set[i].draw();
            }
        };
        this.check = function () {
            var tmp = 0, points = 0, sets = [];
            if (this.set[3].cards.length >= 3) {
                var drunkmonk = false;
                for (var i = 0; i < this.set[3].cards.length; ++i) {
                    if (this.set[3].cards[i].getMonth === 11) {
                        drunkmonk = true;
                    }
                }
                if (this.set[3].cards.length === 5) {
                    points += 10;
                    sets.push("Goko = 10");
                } else if (this.set[3].cards.length === 4) {
                    tmp = 8 - (drunkmonk ? 1 : 0);
                    points += tmp;
                    sets.push("Shiko = " + tmp);
                } else if (this.set[3].cards.length === 3 && !drunkmonk) {
                    points += 5;
                    sets.push("Sanko = 5");
                }
            }
            if (this.set[2].cards.length >= 3) {
                if (checkInSet(this.set[2].cards, Checkers.inoshikacho) === 3) {
                    points += 3;
                    sets.push("inoshikacho = 3");
                }
                if (this.set[2].cards.length >= 5) {
                    tmp = 1 + (this.set[2].cards.length - 5);
                    points += tmp;
                    sets.push("tane = " + tmp);
                }
            }
            if (this.set[1].cards.length >= 3) {
                if (checkInSet(this.set[1].cards, Checkers.akatan) === 3) {
                    points += 3;
                    sets.push("akatan = 3");
                }
                if (checkInSet(this.set[1].cards, Checkers.aotan) === 3) {
                    points += 3;
                    sets.push("aotan = 3");
                }
                if (this.set[1].cards.length >= 5) {
                    tmp = 1 + (this.set[1].cards.length - 5);
                    points += tmp;
                    sets.push("tan = " + tmp);
                }
            }
            if (this.set[0].cards.length >= 10) {
                tmp = 1 + (this.set[0].cards.length - 10);
                points += tmp;
                sets.push("kase = " + tmp);
            }
            if (points > this.mypoints) {
                this.mypoints = points;
                gamestate = this.player;
                Win(this, sets);
                console.log("Nowy wynik! " + points);
                console.log(sets);
            }
        };
    }

    function checkInSet(cards, fun) {
        var tmp = 0;
        for (var i = 0; i < cards.length; ++i) {
            if (fun(cards[i])) {
                ++tmp;
            }
        }
        return tmp;
    }

    /*
	 * Klasa kart na rece
	 */
    var hand = new CardContainer(20, 335, true);
    for (i = 0; i < 8; ++i) {
        hand.cardspos.push(pos((hand.x + (61 * i)), hand.y));
        hand.cards.push(undefined);
    }
    hand.action = function (i) {
        if (gamestate === 1) {
            this.cards[i].y -= 10;
            gamestate = 2;
            this.ready = i;
            draw();
        } else if (gamestate === 2) {
            this.cards[this.ready].y += 10;
            gamestate = 1;
            this.ready = undefined;
            draw();
        }
    };
    var mydealt = new Dealt(680, 335, 7); // 7 = player won

    var Checkers = {
        special: function (card) {
            return (card.getType() === 4);
        },
        inoshikacho: function (card) {
            return ((card.getType() === 3 && card.getMonth() === 6) || (card.getType() === 3 && card.getMonth() === 7) || (card.getType() === 3 && card.getMonth() === 10));
        },
        akatan: function (card) {
            return ((card.getType() === 2 && card.getMonth() === 6) || (card.getType() === 2 && card.getMonth() === 9) || (card.getType() === 2 && card.getMonth() === 10));
        },
        aotan: function (card) {
            return ((card.getType() === 2 && card.getMonth() === 1) || (card.getType() === 2 && card.getMonth() === 2) || (card.getType() === 2 && card.getMonth() === 3));
        },
        tane: function (card) {
            return (card.getType() === 3);
        },
        tan: function (card) {
            return (card.getType() === 2);
        },
        kasu: function (card) {
            return (card.getType() === 1);
        }
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Klasa reki przeciwnika
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var ophand = new CardContainer(20, 20, true);
    for (i = 0; i < 8; ++i) {
        ophand.cardspos.push(pos((ophand.x + (61 * i)), ophand.y));
        ophand.cards.push(undefined);
    }
    function Duo(param, fun) {
        this.param = param;
        this.fun = fun;
    }
    var pqueue = {
        tab: [],
        add: function (priority, fun) {
            //console.log("Dodanie do kolejki priorytetowej len = " + this.tab.length);
            if (this.tab.length === 0) {
                this.tab[0] = new Duo(priority, fun);
            } else {
                var statement = false;
                for (var i = 0; i < this.tab.length ; ++i) {
                    //console.log("iteruje po piorytetach");
                    if (i === this.tab.length) {
                        //console.log("0 priorytetow, dodano jeden");
                        this.tab.push(new Duo(priority, fun));
                    } else {
                        if (this.tab[i].param < priority) {
                            //console.log("znaleziono wiekszy pirorytet, nastepuje przesuniecie nastepnych");
                            this.tab.push(this.tab[this.tab.length - 1]);
                            for (var j = this.tab.length - 1; j > i; --j) {
                                this.tab[j] = this.tab[j - 1];
                            }
                            this.tab[i] = new Duo(priority, fun);
                            statement = true;
                            break;
                        }
                    }
                }
                if (!statement) {
                    this.tab.push(new Duo(priority, fun));
                }
            }
        }
    };
    var opdealt = new Dealt(680, 20, 9); // gamestate 9 = opponent won
    ophand.check = function (table, hand, fun) {
        //console.log("Zaczynam sprawdzac priorytet");
        //console.log(table.cards.length);
        for (var i = 0; i < table.cards.length; ++i) {
            //console.log(i + " - " +  table.cards[i]);
            if (table.cards[i] && fun(table.cards[i])) {
                for (var j = 0; j < hand.cards.length; ++j) {
                    if (hand.cards[j] && table.cards[i].getMonth() === hand.cards[j].getMonth()) {
                        freeslot1.attach(hand.remove(j), i);
                        return true;
                        //return new FreeSlot(hand.remove(j), table.remove(i));
                    }
                }
            }
        }
        for (i = 0; i < hand.cards.length; ++i) {
            if (hand.cards[i] && fun(hand.cards[i])) {
                for (var k = 0; k < table.cards.length; ++k) {
                    if (table.cards[k] && hand.cards[i] && hand.cards[i].getMonth() === table.cards[k].getMonth()) {
                        freeslot1.attach(hand.remove(i), k);
                        return true;
                        //return new FreeSlot(hand.remove(i), table.remove(k));
                    }
                }
            }
        }
        return false;
    };
    ophand.checkFromDeck = function (table, card, fun) {
        if (fun(card)) {
            for (var i = 0; i < table.cards.length; ++i) {
                if (table.cards[i] && !table.cards[i].getBusy() && card.getMonth() === table.cards[i].getMonth()) {
                    freeslot2.attach(card, i);
                    return true;
                }
            }
        }
        for (var j = 0; j < table.cards.length; ++j) {
            if (table.cards[j] && !table.cards[j].getBusy() && fun(table.cards[j])) {
                if (table.cards[j].getMonth() === card.getMonth()) {
                    freeslot2.attach(card, j);
                    return true;
                }
            }
        }
        return false;
    };
    ophand.play = function () {
        pqueue.tab = [];
        pqueue.add((opdealt.set[3].cards.len * 5) + 4, Checkers.special);
        pqueue.add((checkInSet(opdealt.set[2].cards, Checkers.inoshikacho) * 4) + 3, Checkers.inoshikacho);
        pqueue.add((checkInSet(opdealt.set[1].cards, Checkers.akatan) * 4) + 3, Checkers.akatan);
        pqueue.add((checkInSet(opdealt.set[1].cards, Checkers.aotan) * 4) + 3, Checkers.aotan);
        pqueue.add((opdealt.set[2].len * 2) + 2, Checkers.tane);
        pqueue.add((opdealt.set[1].len * 2) + 2, Checkers.tan);
        pqueue.add((opdealt.set[0].len), Checkers.kasu);
        //console.log("przeciwnik sprawdza karty");
        var i;
        for (i = 0; i < pqueue.tab.length; ++i) {
            if (this.check(table, ophand, pqueue.tab[i].fun) === true) {
                ophand.align();
                //console.log("przeciwnik dopasowal");
                gamestate = 5;
                break;
            }
        }
        if (gamestate === 4) {
            var j;
            //console.log("Nie ma kart pasujacych");
            for (i = 1; i < 5; ++i) {
                for (j = 0; j < this.cards.length; ++j) {
                    if (this.cards[j] && this.cards[j].getType() === i) {
                        //console.log("wyrzucam najmniej potrzebna - komp");
                        table.add(this.remove(j));
                        ophand.align();
                        i = 5;
                        break;
                    }
                }
            }
            //table.add(this.cards.remove(j));
            //console.log("przeciwnik niedopasowal");
            gamestate = 5;
        }
        setTimeout(function () {
            setTimeout(function () {
                var card = deck.pop();
                card.y += 5;
                card.draw();
                setTimeout(function () {
                    //console.log("przeciwnik sprawdza karty 2");
                    for (var i = 0; i < pqueue.tab.length; ++i) {
                        if (ophand.checkFromDeck(table, card, pqueue.tab[i].fun) === true) {
                            gamestate = 6;
                            //console.log("przeciwnik dopasowal 2");
                            break;
                        }
                    }
                    if (gamestate === 5) {
                        table.add(card);
                        //console.log("przeciwnik niedopasowal 2");
                        gamestate = 6;
                    }
                    setTimeout(function () {
                        if (freeslot1.ready() && freeslot2.ready()) {
                            opdealt.add(freeslot1.remove());
                            opdealt.add(freeslot1.removeplacer());
                            setTimeout(function () {
                                opdealt.add(freeslot2.remove());
                                opdealt.add(freeslot2.removeplacer());
                            }, 200);
                        } else {
                            if (freeslot1.ready()) {
                                opdealt.add(freeslot1.remove());
                                opdealt.add(freeslot1.removeplacer());
                            } else if (freeslot2.ready()) {
                                opdealt.add(freeslot2.remove());
                                opdealt.add(freeslot2.removeplacer());
                            }
                        }
                        draw();
                        setTimeout(changePlayers, 400);
                    }, 800);
                }, 600);
            }, 400);
        }, 100);
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
	 * Zdarzenie klikniecia mysza
	 */
    function clickEvent(e) {
        var mx = e.pageX - this.offsetLeft;
        var my = e.pageY - this.offsetTop;
        //console.log(lock);
        if (!lock) {
            switch (gamestate) {
                case 0:
                    if (menu.isClicked(mx, my)) {
                        deal(hand, ophand);
                    }
                    break;
                case 1:
                    hand.isClicked(mx, my);
                    break;
                case 2:
                    hand.isClicked(mx, my);
                    table.isClicked(mx, my);
                    break;
                case 3:
                    deck.isClicked(mx, my);
                    break;
                case 4:
                    table.isClicked(mx, my);
                    break;
            }
        }
    }

    /*
	 * Globalna funkcja rysujaca
	 */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, 700, 700);
        deck.draw();
        hand.draw();
        mydealt.draw();
        table.draw();
        ophand.draw();
        opdealt.draw();
        message.draw();
        freeslot1.draw();
        freeslot2.draw();
        tutorial.draw();
        if(moving_card1)
            moving_card1.draw();
        if(moving_card2)
            moving_card2.draw();
    }

    var tutorial = {
        draw: function () {
            ctx.strokeStyle = 'green';
            switch (gamestate) {
                case 1:
                    hand.stroke();
                    break;
                case 2:
                    table.stroke();
                    break;
                case 3:
                    deck.stroke();
                    break;
                case 4:
                    table.stroke();
                    break;
            }

        }
    };

    function delayfun(fun, time, i, end, obj) {
        lock = true;
        setTimeout(function () {
            fun();
            if (--i) {
                delayfun(fun, time, i);
            } else {
                //lock = false;
                if (end instanceof Function) {
                    end.apply(obj);
                }
                draw();
            }
        }, time);
    }

    /*
	 * Rozdanie kart
	 */
    function deal(firstplayer, secondplayer, step) {
           moving_card1 = new MovingCard(deck.pop(), firstplayer);
           moving_card2 = new MovingCard(deck.pop(), firstplayer, function () {
               moving_card1 = new MovingCard(deck.pop(), table);
               moving_card2 = new MovingCard(deck.pop(), table, function () {
                    moving_card1 = new MovingCard(deck.pop(), secondplayer);
                    moving_card2 = new MovingCard(deck.pop(), secondplayer, function () {
                    	if (--step != 0)
                    		deal(firstplayer, secondplayer, step);
                    	else {
                    		moving_card1 = undefined;
                    		moving_card2 = undefined;
                    		gamestate = 1;
                    		lock = false;
                       }
                    });
                });
            });
    }

    function MovingCard(card, container, fn) {
        this.card = card;
        this.step = 20;
        this.container = container;
        this.fn = fn;
        var free_index = container.freeSlot();
        var slot = container.cardspos[free_index];
        this.dx = (slot.x - card.x) / 20;
        this.dy = (slot.y - card.y) / 20;
        this.draw = function () {
            if (this.card) {
                this.card.x += this.dx;
                this.card.y += this.dy;
                this.card.draw();
                //console.log("karta: " + this.card.x + ", " + this.card.y + ", krok = " + this.step);
                --this.step;
                if (this.step == 0) {
                    this.container.add(this.card);
                    console.log("dodano karte:"+ this.card.x + ", " + this.card.y);
                    if (this.fn)
                        this.fn();
                    return true;
                } else {
                    return false;
                }
            }
        }
    };
    var moving_card1 = undefined;
    var moving_card2 = undefined;

    /*
	 * Poczatek gry
	 */
    $(document).ready(function () {
        //console.log('Hello world!');
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 3;
        background = ctx.createRadialGradient(350, 223, 0, 350, 223, 700);
        background.addColorStop(0, '#FFF');
        background.addColorStop(1, '#000');
        $('canvas').on('click', clickEvent);
        deal(hand, ophand, 4);
        setInterval(draw, 10);
    });
//};
//hanafuda();
//$(document).ready(hanafuda());
