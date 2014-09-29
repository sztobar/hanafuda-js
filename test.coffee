'use strict'
class CanvasHolder
	constructor: (@canvas) ->
		@ctx = @canvas.getContext('2d')

class Board extends CanvasHolder
	constructor: (canvas) ->
		super(canvas)
		@background = @ctx.createRadialGradient(350, 223, 0, 350, 223, 700)
		@background.addColorStop(0, '#fff')
		@background.addColorStop(1, '#000')
		@lock = false
		@gamestate = 1
		@menu = new Menu(canvas)
	draw: ->
		@ctx.clearRect(0, 0, @canvas.width, @canvas.height)
		@ctx.fillStyle = @background
		@ctx.fillRect(0, 0, 700, 700)
		switch @gamestate
			when 1 then @menu.draw()
	handleEvent: (event) ->
		mx = e.pageX
		my = e.pageY
		if not @lock
			switch @gamestate
				when 1 then if @menu.isClicked(mc, my)
					@startGame()
	logic: =>
		@draw()
	startGame: ->
		@deck = new Deck()
		@player = new Player()
		@opponent = new Opponent()
	init: =>
		self = @
		@flow = setInterval(self.logic, 100)

class Deck extends CanvasHolder
	constructor: (canvas) ->
		super(canvas)
		@cards = []
		require(deck)

		@cards.push(new Card())
		
class Menu extends CanvasHolder
	draw: ->
		Text.fillText(@ctx, Text.title, 'Hanafuda', @canvas.width / 2, 140)
		Text.fillText(@ctx, Text.pica, 'Start', @canvas.width / 2, 250)
	isClicked: (mx, my) ->
		if (mx > (@canvas.width / 2) - 100 and mx < (canvas.width / 2) + 100 and my > 250 and my < 300)
			true
		else
			false

class Text
	@title: (ctx) ->
		ctx.fillStyle = 'black'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'top'
		ctx.font = '67pt Stencil'
	@pica: (ctx) ->
		ctx.fillStyle = 'black'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'top'
		ctx.font = '30pt IM Fell DW Pica SC'
	@set: (ctx) ->
		ctx.fillStyle = 'black'
		ctx.textAlign = 'left'
		ctx.font = '10pt IM Fell DW Pica SC'
		ctx.textBaseline = 'top'
	@score: (ctx) ->
		ctx.fillStyle = 'black'
		ctx.textAlign = 'left'
		ctx.font = '18pt IM Fell DW Pica SC'
		ctx.textBaseline = 'top'
	@fillText: (ctx, fun, str, x, y) ->
		fun(ctx)
		ctx.fillText(str, x, y)
	@strokeText: (ctx, fun, str, x, y) ->
		fun(ctx)
		ctx.strokeText(str, x, y)

$('document').ready ->
	canvas = $('canvas')[0]
	board = new Board(canvas)
	canvas.click(board.handleEvent)
	board.init()
