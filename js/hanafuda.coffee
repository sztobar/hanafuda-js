'use strict'
# Klasa bazowa przetrzymująca canvas i canvasContext potrzebne później w funkcjach typu draw czy stroke
class CanvasHolder
	# Konstruktor w którym trzeba podać obiekty `canvas`
	constructor: (@canvas) ->
		@ctx = @canvas.getContext('2d')

# Klasa bazowa dla obiektów które posiadająca swoje wymiary, pozycję i można je namierzyć
class ActiveObject extends CanvasHolder
	# Konstruktor podstawowy z parametrami:
	# 
	# Obiekt `canvas`, współrzędna `x`, współrzędna `y`,
	# długość obiektu `width`, wysokość obiektu `height`
	constructor: (canvas, @x, @y, @width, @height) ->
		super(canvas)
		@hover = false
		@strokeStyle = 'green'
	# Funkcja sprawdzająca czy mysz jest w obrębie obiektu
	#
	# `mx`, `my` to współrzędne myszy
	isHover: (mx, my) ->
		if mx > @x and mx < @x + @width and my > @y and my < @y + @height
			@hover = true
		else
			@hover = false
	# Funkcja rysująca kontur o wymiarach obiektu.
	# Kolor konturu można zdefiniować poprzez zmienną `strokeStyle`
	stroke: ->
		@ctx.strokeStyle = @strokeStyle
		@ctx.strokeRect(@x - 5, @y - 5, @width + 10, @height + 10)

# Klasa wyświetlająca tekst mający cechy obiektu `ActiveObject`
class ActiveText extends ActiveObject
	# W konstruktorze poza zmiennymi, które zwyczajnie podaje się do `ActiveObject`,
	# podajemy jeszcze treść do wyświetlenia `text` i styl `style` wzięty z obiektu `Text`
	constructor: (canvas, @text, @style, x, y, width, height) ->
		super(canvas, x, y, width, height)
		@strokeStyle = 'blue'
	# Funkcja rysująca tekst. Jeśli Najechaliśmy na tekst, wyświetlony jest również jego kontur(w formie prostokątu).
	draw: ->
		if @hover
			@stroke()
		Text.fillText(@style, @text, @x + 3, @y + 3)

# Klasa bazowa do przechowywania kart
class CardContainer extends ActiveObject
	# Konstuktor z argumentami: `canvas`, współrzędnymi początku `x`, `y` oraz
	# widocznością kart `visibility`
	constructor: (canvas, x, y, @visibility) ->
		super(canvas, x, y, 56, 90)
		@cards = []
	# Funkcja rysująca wszystkie posiadane karty
	draw: ->
		for card in cards
			card.draw()
	# Funkcja dodająca nową kartę
	add: (card) ->
		card.visibility = @visibility
		coords = @cards[@freeslot()]
		card.move(coords.posx, coords.posy)
		@cards[@freeslot()].card = card
	remove:
	isHover: (mx, my) ->
		for card in cards
			card.isHover(mx, my)

# Klasa przechowująca karty w Talii
class Deck extends ActiveObject
	# W kontrusktorze podajemy `canvas` i listę współrzędnych dla kart `cardlist`
	constructor: (canvas, cardlist) ->
		super(canvas, 20, 177, 56, 90)
		@cards = []
		for card in cardlist
			@cards.push(new Card(canvas, card.month, card.type, card.x, card.y))
		_.shuffle(@cards)
	# Przeładowana funkcja draw rysująca tylko kartę z wierzchu
	draw: ->
		@ctx.drawImage(Card.backimg, @x, @y, @width, @height)
	# Funkcja oddająca pierwszą kartę z wierzchu talii
	pop: ->
		@cards.pop()
		
# Klasa przechowująca karty na ręce
class Hand extends CardContainer
	# W konstruktorze podajemy obiekt `canvas`, pozycję `x`, `y` i widoczność `visibility`
	constructor: (canvas, x, y, visibility) ->
		super(canvas, x, y, visibility)
		for i in 0..8
			@cards.push({card: , posx: @x + (61 * i), posy: @y})

# Klasa bazowa grającza
class Player
	# W konstruktorze podajemy `canvas`, współrzędne ręki gracza `x`, `y`, widoczność kart `visibility`,
	# współrzędne zagranych kart `dx`, `dy`
	constructor: (canvas, x, y, visibility) ->
		@hand = new Hand(canvas, x, y, visibility)
		@dealt = new Dealt(canvas, x, y)
	
# Klasa 'matka' która rozporządza wszystkim co dzieje się w grze
class Board extends CanvasHolder
	# W kontrusktorze przekazujemy tylko obiekt `canvas` i obiekt `cardlist` czyli współrzędne
	# kart na obrazku razem z ich wartościami. Cardlist pobieramy jako obiekt `.json`
	constructor: (canvas, cardlist) ->
		super(canvas)
		@background = @ctx.createRadialGradient(350, 223, 0, 350, 223, 700)
		@background.addColorStop(0, '#fff')
		@background.addColorStop(1, '#000')
		@deck = new Deck(canvas, cardlist)
		@lock = false
		@gamestate = 1
		@menu = new Menu(canvas)
	# Funkcja rysująca różne komponenty zależnie od zmiennej `gamestate`
	draw: ->
		@ctx.clearRect(0, 0, @canvas.width, @canvas.height)
		@ctx.fillStyle = @background
		@ctx.fillRect(0, 0, 700, 700)
		switch @gamestate
			when 1 then @menu.draw()
	# Funkcja obsługująca kliknięcie myszką w grze
	mouseClick: (event) ->
		mx = event.pageX
		my = event.pageY
		if not @lock
			switch @gamestate
				when 1 then if @menu.hover
					@startGame()
	# Funkcja obsługująca poruszanie się myszką po planszy
	mouseMove: (event) =>
		mx = event.pageX - @canvas.offsetLeft
		my = event.pageY - @canvas.offsetTop
		if not @lock
			switch @gamestate
				when 1
					@menu.isHover(mx, my)
	# 'Logika' gry czyli akcje do wykonania po ktorych następuje wywołanie funkcji rysowania
	logic: =>
		@draw()
	# Rozpoczęcie gry
	startGame: ->
		@player = new HumanPlayer()
		@opponent = new ComputerPlayer()
		for i in 0..7
			@player.hand.add(deck.pop())
			@opponent.hand.add(deck.pop())
	# Włączenie działania silnika gry
	init: ->
		self = @
		@flow = setInterval(self.logic, 100)

# Klasa Karty
class Card extends ActiveObject
	# W konstruktorze przekazujemy miesiąc karty `month`, jej typ `type` (normalna, talizman, zwierzę, specjalna) oraz
	# współrzędne na obrazku czyli `imgx`, `imgy`. Parametry obiektu aktywnego są ustalane na sztywno gdyż wszystkie karty
	# mają te same wymiary a pozycja początkowa jest w talii kart.
	constructor: (canvas, @month, @type, @imgx, @imgy) ->
		super(canvas, 20, 177, 56, 90)
		@busy = false
		@visibility = true
	# Funkcja rysująca. W przypadku kiedy zmienna `visibility` jest wyłączona, rysowany jest tył karty.
	draw: ->
		if @visibility
			@ctx.drawImage(Card.cardimg, @imgx, @imgy, @width, @height, @x, @y, @width, @height)
		else
			@ctx.drawImage(Card.backimg, @x, @y, @width, @height)

# Klasa odpowiadająca za menu początkowe gry
class Menu extends CanvasHolder
	# Konstruktorze przekazujemy tylko obiekt `canvas`
	constructor: (canvas) ->
		super(canvas)
		@startText = new ActiveText(canvas, 'Start', Text.pica, 300, 250, 100, 40)
	# Funkcja rysująca
	draw: ->
		Text.fillText(Text.title, 'Hanafuda', @canvas.width / 2, 140)
		@startText.draw()
	# Sprawdzenie czy nie najechaliśmy na napis do kliknięcia
	isHover: (mx, my) ->
		@startText.isHover(mx, my)

# Klasa Text zawierająca statyczne metody ktore ustawiają określony styl tekstu
class Text
	# Przed wywołanie. funkcji `fillText` i `strokeText` należy raz wywołać funkcję `setCanvas`
	@setCanvas: (canvas) ->
		@ctx = canvas.getContext('2d')
	# Styl tytułu
	@title: =>
		@ctx.fillStyle = 'black'
		@ctx.textAlign = 'center'
		@ctx.textBaseline = 'top'
		@ctx.font = '67pt Stencil'
	# Styl wykorzystujący czcionkę pica
	@pica: =>
		@ctx.fillStyle = 'black'
		@ctx.textAlign = 'left'
		@ctx.textBaseline = 'top'
		@ctx.font = '30pt IM Fell DW Pica SC'
	# Styl używany do wyświetlania liczb danych kombinacji
	@set: =>
		@ctx.fillStyle = 'black'
		@ctx.textAlign = 'left'
		@ctx.font = '10pt IM Fell DW Pica SC'
		@ctx.textBaseline = 'top'
	# Styl używany do
	@score: =>
		@ctx.fillStyle = 'black'
		@ctx.textAlign = 'left'
		@ctx.font = '18pt IM Fell DW Pica SC'
		@ctx.textBaseline = 'top'
	# Rysuje tekst z określonym w `fun` stylem. `str` to treść a `x`, `y` współrzędne
	@fillText: (fun, str, x, y) ->
		fun()
		@ctx.fillText(str, x, y)
	# Wyświetla kontur tekstu. Parametry identyczne jak w funkcji `fillText`
	@strokeText: (fun, str, x, y) ->
		fun()
		@ctx.strokeText(str, x, y)

# Funkcja do framework'a `Require.js`. Deklaruje potrzebne komponenty do działania czyli
# bilbiotekę `underscore` oraz dane odnośnie kart w talii czyli `card.json`
define('hanafuda', ['underscore', 'text!cards.json'], (_, cards) ->
	init = ->
		canvas = $('canvas')[0]
		cardlist = JSON.parse(cards)
		Text.setCanvas(canvas)
		Card.frontimg = new Image()
		Card.frontimg.src = 'img/cards.png'
		Card.backimg = new Image()
		Card.backimg.src = 'img/back.png'

		board = new Board(canvas, cardlist)
		$('canvas').bind(
			click: board.mouseClick
			mousemove: board.mouseMove
		)
		board.init()
	{init: init}
)
