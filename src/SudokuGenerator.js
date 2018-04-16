/*
 * Name: SudokuGenerator
 * Description: Class to generate N number of sudoku boards
 * Author: Thomas Lanteigne
 * Date: 03/04/2018
 */
const
    SudokuBoard = require("./SudokuBoard.js");

//=============================================================================
// Public class interface
//=============================================================================
class SudokuGenerator {

    //=============================================================================
    constructor() {
        this.generatedBoards = [];
    }

    //=============================================================================
    /*
     * Generate a number of random Sudoku Sheets
     */
    generate(i_nNbSheets) {
        let i,
            l_nNbSheets = Number(i_nNbSheets) || 1,
            l_oBoard;

        this.generatedBoards.length = 0;

        for (i = 0; i < i_nNbSheets; i++) {
            l_oBoard = new SudokuBoard();
            l_oBoard.generate();
            this.generatedBoards.push(l_oBoard);
            console.log(`SudokuGenerator::Generation @ ${((i / i_nNbSheets) * 100).toFixed(2)} %`);
        }
        console.log("SudokuGenerator::Generation @ 100 %");

        return this.generatedBoards;
    }

    //=============================================================================
    loadBoard(i_sSignature) {
        let l_oBoard = new SudokuBoard();

        try {
            l_oBoard.load(i_sSignature);
            if (!this.generatedBoards.find(i_oBoardToFind => i_oBoardToFind.signature === l_oBoard.signature)) {
                this.generatedBoards.push(l_oBoard);
            }
        } catch (i_oError) {
            l_oBoard = null;
            console.error("Error loading board with signature: ", i_sSignature);
        }

        return l_oBoard;
    }
}

console.log("Sudoku Generator Generated...");

module.exports = {
    SudokuGenerator: new SudokuGenerator()
};
