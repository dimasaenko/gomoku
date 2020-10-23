class App {
    UI = {
        form : document.getElementById('form'),
        turnInfo : document.getElementById('turn-info'),
        canvas : document.getElementById('canvas'),
        userInfo : document.getElementById('user-info'),
        userName : document.getElementById('user_name'),
        opponentName : document.getElementById('opponent_name'),
    }

    socket = io('/')
    username = ''
    gameStarted = false;
    chat = undefined;

    constructor() {
        this.setFormEvents();
        this.game = new Game(this.UI.canvas, this.socket);
    }

    setFormEvents() {
        this.UI.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = e.target.elements.username.value;
            this.setSocketEvents();
            this.socket.emit('game.create', username);
            this.UI.form.classList.add('hidden');
            this.UI.userInfo.classList.remove('hidden');
            this.UI.turnInfo.innerText = "Request...";
            this.UI.userName.innerText = username;
            this.username = username;
        })
    }

    setSocketEvents() {
        
        this.socket.on('game.waiting', () => {
            if (!this.gameStarted) {
                this.UI.turnInfo.innerText = "Waiting for opponent...";
            }
            if (!this.chat) {
                this.chat = new Chat(this.socket)
            }
        })

        this.socket.on('game.started', (data) => {
            this.gameStarted = true;
            let {opponent, marker} = data;
            marker = Number.parseInt(marker)
            this.UI.userName.innerHTML = this.getNameHtml(this.username, marker)
            this.UI.opponentName.innerHTML = this.getNameHtml(opponent, marker * -1)
            this.game.start(marker);
            this.updateTurnInfo(marker == 1)

            if (!this.chat) {
                this.chat = new Chat(this.socket)
            }

            this.socket.on('game.turn_made', (data) => {
                if (data.game_over) {
                    return;
                }
                const lastMarker = Number.parseInt(data.last_turn.marker);
                this.updateTurnInfo(lastMarker != marker);
            })
        })

        this.socket.on('game.disconnected', () => {
            this.UI.turnInfo.innerHTML = 'Opponent disconnected';
        })
    }

    updateTurnInfo(userTurn) {
        if (userTurn) {
            this.UI.turnInfo.innerText = "Your move, Master";
        } else {
            this.UI.turnInfo.innerText = "Waiting for the opponent's move...";
        }
    }

    getNameHtml(username, marker) {
        return `<span class="marker">${marker == 1 ? 'X' : 'O'}</span>${username}</div>`;
    }

}

app = new App();