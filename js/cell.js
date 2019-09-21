// fork from "https://github.com/nickarocho/minesweeper"
// Original code from nickarocho
// License Not Figured.
// Using Open-Source Game code 
// Analyze & Modify by KHW

class  Cell {
    constructor(row, col, board) {
        this.row = row;
        this.col = col;
        this.isBomb = false;
        this.board = board;
        this.revealed = false;
        this.flagged = false;
        this.adjBombs = 0;
    }

    getAdjCells() {
        var adj = [];
        var lastRow = board.length - 1;
        var lastCol = board[0].length - 1;
        if (this.row > 0 && this.col > 0) adj.push(board[this.row - 1][this.col - 1]);              //Ⅰ
        if (this.row > 0) adj.push(board[this.row - 1][this.col]);                                  //Ⅱ
        if (this.row > 0 && this.col < lastCol) adj.push(board[this.row - 1][this.col + 1]);        //Ⅲ
        if (this.col < lastCol) adj.push(board[this.row][this.col + 1]);                            //Ⅳ
        if (this.row < lastRow && this.col < lastCol) adj.push(board[this.row + 1][this.col + 1]);  //Ⅴ
        if (this.row < lastRow) adj.push(board[this.row + 1][this.col]);                            //Ⅵ
        if (this.row < lastRow && this.col > 0) adj.push(board[this.row + 1][this.col - 1]);        //Ⅶ
        if (this.col > 0) adj.push(board[this.row][this.col - 1]);                                  //Ⅷ
        return adj;
    }
    /* ┌ ── ┬ ─ ─ ─ ┬ ── ┐
     * │  Ⅰ │   Ⅱ   │ Ⅲ │
     * ├ ── ┼ ─ ─ ─ ┼ ── │
     * │ Ⅷ│ Origin│ Ⅳ │
     * ├ ── ┼ ─ ─ ─ ┼ ── │
     * │ Ⅶ │  Ⅵ  │ Ⅴ  │
     * └ ── ┴ ─ ─ ─ ┴ ── ┘ 에서 [I, II, III, IV, V, VI, VII, VIII] 의 배열을 반환함. => caclAdjBombs()에서 사용됨
     */

    calcAdjBombs() { // 특정 cell(A)의 인접 cell들 중 폭탄이 있는지 확인 후 A에 인접한 폭탄 갯수를 할당.
                     // 모든 cell을 돌아야하는 비용 발생.. 폭탄 발생시 폭탄이 발생한 곳을 기준으로 인접한 셀에 추가하는 것은 안되나?
                     /* Update 완료
                      * (기존: 보드의 모든 셀을 돌면서 해당 셀 주변의 폭탄 갯수에 따른 업데이트)
                      * (신규: 특정 셀에 폭탄을 놓으면서 해당 셀 주변에 폭탄 갯수를 +1 해주는 방식)
                      */ 
                     var adjCells = this.getAdjCells();
                     var adjBombs = adjCells.forEach(function(cell) {
                         cell.adjBombs += 1;
                     });
        return; 
    }

    calcAdjFlagsAndOpen() {
        var checker = false;
        var numOfFlags = 0;
        var adjCells = this.getAdjCells();
        adjCells.forEach(function(cell) {
            if(cell.flagged) {
                numOfFlags += 1;
            }
        });
        if(this.adjBombs === numOfFlags) {
            adjCells.forEach(function(cell) {
                cell.reveal();
                if(cell.flagged === false && cell.isBomb === true  && checker === false) {
                    checker = true;
                }
            });
        }
        return checker;
    }


    flag() { 
        if (!this.revealed) {
            this.flagged = !this.flagged;
            return this.flagged;
        }
    }
    

    reveal() {
        if (this.revealed && !hitBomb) return;
        if (this.flagged) return;
        
        this.revealed = true;
        if (this.isBomb) {
            if(sessionStorage.getItem("protect") === "true") {
                this.revealed = false; 
                this.flag();
                sessionStorage.setItem("protect", false);
                sessionStorage.setItem("flag", true);
                return false;
            }
            return true;
        }
        
        if (this.adjBombs === 0) {
            var adj = this.getAdjCells();
            adj.forEach(function(cell){
                if (!cell.revealed) cell.reveal();
            });
        }
        return false;
    }

    veil() {
        this.revealed = false;
        if (this.isBomb) {
            if(sessionStorage.getItem("protect") === "true") {
                this.revealed = false; 
                this.flag();
                sessionStorage.setItem("protect", false);
                sessionStorage.setItem("flag", true);
                return false;
            }
            return true;
        }
        
        if (this.adjBombs === 0) {
            var adj = this.getAdjCells();
            adj.forEach(function(cell){
                if (!cell.revealed) cell.reveal();
            });
        }
        return false;
    }
}