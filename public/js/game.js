class Game {
    CELL_QTY = 19;
    CELL_SIZE = 25;
    BOARD_SIZE = this.CELL_QTY * this.CELL_SIZE;

    COLOR_BACKGROUND = '#EEEEEE';
    COLOR_BOARDER = '#3F3F3F';
    COLOR_CIRCLE = '#db7c75';
    COLOR_CROSS = '#75db7c';
    COLOR_WINNER = '#010101'

    isGameOver = false;
    isMyTurn = false;
    gameStarted = false;
    myMarker = 0;
    lastTurn;

    constructor(canvas, socket) {
        this.socket = socket
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.matrix = new Array(this.CELL_QTY).fill(0).map(() => new Array(this.CELL_QTY).fill(0));
        this.renderBoard();
    }

    start(marker) {
        this.myMarker = marker;
        this.isMyTurn = marker == 1;
        this.gameStarted = true;
        this.addEventListeners();
    }

    isEmptyCell = function(cellPosition) {
        return this.matrix[cellPosition.x][cellPosition.y] === 0;
    }
    
    renderBoard() {
        this.canvas.width = this.BOARD_SIZE;
        this.canvas.height = this.BOARD_SIZE;
        
        this.ctx.fillStyle = this.COLOR_BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.width);
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.COLOR_BOARDER;
        this.ctx.lineWidth = 1;
        for (var x = 0.5; x < this.canvas.width; x += this.CELL_SIZE) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }
        for (var y = 0.5; y < this.canvas.height; y += this.CELL_SIZE) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
    }

    getCellPosition(x, y) {
        return {
            x : Math.floor(x/this.CELL_SIZE), 
            y : Math.floor(y/this.CELL_SIZE)
        }
    }

    drawCircle(cellPosition, color = undefined) {
        const x = cellPosition.x * this.CELL_SIZE + this.CELL_SIZE/2;
        const y = cellPosition.y * this.CELL_SIZE + this.CELL_SIZE/2;
        this.ctx.strokeStyle = color ? color : this.COLOR_CIRCLE;
        this.ctx.lineWidth = 3;
    
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.CELL_SIZE * 0.4, 0, 2 * Math.PI, false);
        this.ctx.stroke();
    }
    
    drawCross(cellPosition, color = undefined) {
        const x = cellPosition.x * this.CELL_SIZE;
        const y = cellPosition.y * this.CELL_SIZE;
        this.ctx.lineWidth = color ? 4: 3;
        this.ctx.strokeStyle = color ? color : this.COLOR_CROSS;
    
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.CELL_SIZE * 0.1, y + this.CELL_SIZE * 0.1);
        this.ctx.lineTo(x + this.CELL_SIZE * 0.9, y + this.CELL_SIZE * 0.9);
        this.ctx.stroke();
    
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.CELL_SIZE * 0.9, y + this.CELL_SIZE * 0.1);
        this.ctx.lineTo(x + this.CELL_SIZE * 0.1, y + this.CELL_SIZE * 0.9);
        this.ctx.stroke();
    }

    drawMarker(cellPosition, color = undefined) {
        if (this.myMarker == 1) {
            this.drawCross(cellPosition, color)
        } else {
            this.drawCircle(cellPosition, color)
        }
    }

    addEventListeners() {
        let game = this;

        this.canvas.addEventListener('mousedown', function(e) {
            if (game.isGameOver || !game.isMyTurn) {
                return;
            }
            const rect = this.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
            const cellPosition = game.getCellPosition(x, y);
            if (!game.isEmptyCell(cellPosition)) {
                return;
            }
            game.drawMarker(cellPosition)
            game.lastTurn = cellPosition;
            game.matrix[cellPosition.x][cellPosition.y] = game.myMarker
            game.socket.emit('game.send_turn', cellPosition)
            game.isMyTurn = false;
        });

        this.socket.on('game.wrong_turn', (msg) => {
            game.drawMarker(game.lastTurn, game.COLOR_BACKGROUND)
            game.matrix[game.lastTurn.x][game.lastTurn.y] = 0
            game.lastTurn = undefined
            game.isMyTurn = true;
        })

        this.socket.on('game.turn_made', (data) => {
            game.renderLastOpponentTurn(data)
            game.checkGameOver(data);
        })
    }

    renderLastOpponentTurn(data) {
        const x = Number.parseInt(data.last_turn.x)
        const y = Number.parseInt(data.last_turn.y)
        const marker = Number.parseInt(data.last_turn.marker)

        if (this.lastTurn && this.lastTurn.x == x && this.lastTurn.y == y) {
            return;
        }
        if (this.myMarker == marker) {
            return;
        }
        if (marker == 1) {
            this.drawCross({x, y})
        } else {
            this.drawCircle({x, y})
        }
        this.matrix[data.last_turn.x][data.last_turn.y] = data.last_turn.marker
        this.isMyTurn = (this.marker != marker)
    }

    checkGameOver(data) {
        if (!data.game_over) {
            return;
        }
        const marker = Number.parseInt(data.last_turn.marker)
        let p = document.getElementById('turn-info')
        if (marker == this.myMarker) {
            p.innerHTML = 'Congratulations! You Won!'
        } else {
            p.innerHTML = 'Sorry, You Lose'
        }
        this.game_over = true;
        this.drawWinnerLine(data.winner_line);
    }

    drawWinnerLine(lineData) {
        let {type, start_cell, end_cell} = lineData
        let start_x, start_y, end_x, end_y;
        if (type == 1) { /** Horizontal **/
            start_x = this.CELL_SIZE * start_cell.x
            start_y = this.CELL_SIZE * start_cell.y + this.CELL_SIZE/2
            end_x = this.CELL_SIZE * end_cell.x + this.CELL_SIZE
            end_y = this.CELL_SIZE * end_cell.y + this.CELL_SIZE/2
        } else if (type == 2) { /** Vertical **/
            start_x = this.CELL_SIZE * start_cell.x + this.CELL_SIZE/2
            start_y = this.CELL_SIZE * start_cell.y
            end_x = this.CELL_SIZE * end_cell.x + this.CELL_SIZE/2 
            end_y = this.CELL_SIZE * end_cell.y + this.CELL_SIZE
        } else if (type == 3) { /** Diagonal **/
            start_x = this.CELL_SIZE * start_cell.x
            start_y = this.CELL_SIZE * start_cell.y
            end_x = this.CELL_SIZE * end_cell.x + this.CELL_SIZE
            end_y = this.CELL_SIZE * end_cell.y + this.CELL_SIZE
        } else if (type == 4) {
            start_x = this.CELL_SIZE * start_cell.x + this.CELL_SIZE
            start_y = this.CELL_SIZE * start_cell.y
            end_x = this.CELL_SIZE * end_cell.x
            end_y = this.CELL_SIZE * end_cell.y + this.CELL_SIZE
        } else {
            console.error("Wrong winner type")
            return;
        }

        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = this.COLOR_WINNER;
        this.ctx.beginPath();
        this.ctx.moveTo(start_x, start_y);
        this.ctx.lineTo(end_x, end_y);
        this.ctx.stroke();
    }
}

