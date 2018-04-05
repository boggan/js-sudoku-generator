const
    SudokuGenerator = require("./SudokuGenerator.js").SudokuGenerator,
    SAVED_BOARD_SIGNATURE = `Mzg0MjE2NzU5Mjc5NTM0NjgxMTU2Nzg5NDMyNDYzOTUxMjc4OTI4NjQ3MzE1NTE3MzI4OTY0ODkyMTczNTQ2NjMxNDk1ODI3NzQ1ODYyMTkz`,
    LOADED_BOARD_SOLUTION = [
        [3, 8, 4, 2, 1, 6, 7, 5, 9],
        [2, 7, 9, 5, 3, 4, 6, 8, 1],
        [1, 5, 6, 7, 8, 9, 4, 3, 2],
        [4, 6, 3, 9, 5, 1, 2, 7, 8],
        [9, 2, 8, 6, 4, 7, 3, 1, 5],
        [5, 1, 7, 3, 2, 8, 9, 6, 4],
        [8, 9, 2, 1, 7, 3, 5, 4, 6],
        [6, 3, 1, 4, 9, 5, 8, 2, 7],
        [7, 4, 5, 8, 6, 2, 1, 9, 3]
    ];

let l_oUniqueBoards,
    l_oBoard,
    l_sLoadedBoardNumbers;

console.log("Generating 1 Boards...");
SudokuGenerator.generate(2);
console.log("generated 1 board: ", SudokuGenerator.generatedBoards[0].signature);
console.log("Printing board 0: ");
SudokuGenerator.generatedBoards[0].prettyPrint();
console.log("Printing board 1: ");
SudokuGenerator.generatedBoards[1].prettyPrint();

console.log("Generating 100 Boards...");
SudokuGenerator.generate(100);

console.log("Asserting unicity of generated boards...");
l_oUniqueBoards = new Set(SudokuGenerator.generatedBoards.map(i_oBoard => i_oBoard.signature));
console.log(`Generated boards ${SudokuGenerator.generatedBoards.length}\nUnique Boards: ${l_oUniqueBoards.size}`);

console.log("Loading saved board through signature...");
l_oBoard = SudokuGenerator.loadBoard(SAVED_BOARD_SIGNATURE);

if (l_oBoard) {
    l_oBoard.prettyPrint();
    l_sLoadedBoardNumbers = l_oBoard.board.map(i_aRow => i_aRow.join("")).join("");
    if (l_sLoadedBoardNumbers === LOADED_BOARD_SOLUTION.map(i_aRow => i_aRow.join("")).join("")) {
        console.log("Loaded board matches");
    } else {
        console.error("Error loading board, mismatch");
    }
} else {
    console.error("Error loading board, bad signature");
}

console.log("Goodbye.");
