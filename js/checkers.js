class boardField {
	constructor() {
		this.color			= 'white';
		this.number			= 0;
		this.validTurn		= false;
		this.checkerType	= null;
		this.checkerId		= null;
		this.eated			= false;
	}
}

document.addEventListener('DOMContentLoaded', function() {

	let cardCompany = new Vue({
		el: '#checkers',
		data: {
			board: [],
			checkersWhite: [],
			checkersBlack: [],
			selectedField: {x: null, y: null},
			whoTurn: 'white',
		},
		computed: {
			isNotModifed() {
				return _.isEqual(this.company, this.companyOriginal);
			}
		},
		methods: {
			selectChecker(x, y) {
				x = 1 * x;
				y = 1 * y;
				let field = this.board[x][y];
				if (field.checkerType !== this.whoTurn) {
					return;
				}
				this.clearValidTurn();
				if (this.selectedField.x == x && this.selectedField.y == y) {
					this.selectedField = {x: null, y: null};
					return;
				}
				this.selectedField = {x: x, y: y};
				this.setValidTurn(x, y);
			},
			setValidTurn(x, y) {
				if (x === null || y === null) {
					return false;
				}
				let field = this.board[x][y];
				if (field.checkerId !== false) {
					let yL = y-1, yR = y+1;
					let tF = field.checkerType === 'white' ? 1 : -1;
					let xM = x + tF;
					if ( yL >= 0 && yL <= 7 && xM <= 7 && xM >= 0 && this.board[xM][yL].checkerId === null) {
						this.board[xM][yL].validTurn = true;
					} else if ( yL >= 0 && yL <= 7 && xM <= 7 && xM >= 0 && this.board[xM][yL].checkerType !== field.checkerType) {
						if ( yL-1 >= 0 && yL - 1 <= 7 && xM + tF <= 7 && xM + tF >= 0 && this.board[xM + tF][yL-1].checkerId === null) {
							this.board[xM][yL].eated = true;
							this.board[xM+tF][yL-1].validTurn = true;
						}
					}
					if ( yR <= 7 && yR >= 0 && xM <= 7 && xM >= 0 && this.board[xM][yR].checkerId === null) {
						this.board[xM][yR].validTurn = true;
					} else if ( yR <= 7 && yR >= 0 && xM <= 7 && xM >= 0 && this.board[xM][yR].checkerType !== field.checkerType) {
						if ( yR+1 <= 7 && yR+1 >= 0 && xM + tF <= 7 && xM + tF >= 0 && this.board[xM + tF][yR+1].checkerId === null) {
							this.board[xM][yR].eated = true;
							this.board[xM+tF][yR+1].validTurn = true;
						}
					}
				}
				console.debug(this.board);
			},
			move(x, y) {
				x = 1 * x;
				y = 1 * y;
				let xF = this.selectedField.x;
				let yF = this.selectedField.y;
				if (this.board[x][y].validTurn === true) {
					this.board[x][y].checkerId		= this.board[xF][yF].checkerId;
					this.board[x][y].checkerType	= this.board[xF][yF].checkerType;
					this.board[xF][yF].checkerId	= null;
					this.board[xF][yF].checkerType	= null;
					this.selectedField.x = null;
					this.selectedField.y = null;
					this.removeEadted();
					this.clearValidTurn();
					this.whoTurn = this.whoTurn == 'white' ? 'black' : 'white';
				}
			},
			clearValidTurn() {
				for (let x = 0; x < 8; ++x) {
					for (let y = 0; y < 8; ++y) {
						this.board[x][y].validTurn	= false;
						this.board[x][y].eated		= false;
					}
				}
			},
			removeEadted() {
				for (let x = 0; x < 8; ++x) {
					for (let y = 0; y < 8; ++y) {
						if (this.board[x][y].eated === true) {
							this.board[x][y].eated			= false;
							this.board[x][y].checkerId		= null;
							this.board[x][y].checkerType	= null;
						}
					}
				}
			},
			isSelectedChecker(x, y) {
				return this.selectedField.x == x && this.selectedField.y == y;
			},
			newGame() {
				this.board = [];
				let i = 0;
				let iCheckerWhite = 0;
				let iCheckerBlack = 0;
				let iColor = 0;
				// 12
				for (let x = 0; x < 8; ++x) {
					this.board[x] = {};
					for (let y = 0; y < 8; ++y) {
						this.board[x][y] = new boardField();
						this.board[x][y].number = i++;
						this.board[x][y].color = (iColor % 2) == 0 ? 'white' : 'black';
						if (x >= 0 && x <= 2 && (iColor % 2) == 0) {
							this.board[x][y].checkerType = 'white';
							this.board[x][y].checkerId = iCheckerWhite++;
						}
						if (x >= 5 && x <= 7 && (iColor % 2) == 0) {
							this.board[x][y].checkerType = 'black';
							this.board[x][y].checkerId = iCheckerBlack++;
						}
						iColor++;
					}
					++iColor
				}
			}
		},
		created() {
			this.newGame();
		},
	});

});
