function _exitError(i_sMsg) {
    console.error(i_sMsg);
    process.exit(1);
}

const
    SudokuGenerator = require("./SudokuGenerator.js").SudokuGenerator,
    OLD_SAVED_BOARD_SIGNATURE = `Mzg0MjE2NzU5Mjc5NTM0NjgxMTU2Nzg5NDMyNDYzOTUxMjc4OTI4NjQ3MzE1NTE3MzI4OTY0ODkyMTczNTQ2NjMxNDk1ODI3NzQ1ODYyMTkz`,
    SAVED_BOARD_SIGNATURE = `NTQ5ODI3MTM2NjE3NTM5Mjg0MzgyNDE2NTk3NzUxOTQzNjI4ODI2NzUxMzQ5NDkzMjY4NzE1MTc0Mzg1OTYyOTM4NjcyNDUxMjY1MTk0ODczOlszLDYsOCwxMCwxNSwxNiwxOCwxOSwyNSwyNywzMCwzMSwzNSwzNiwzNywzOCw0MSw0Miw0Niw0OCw0OSw1Myw1NCw1OCw2MCw2Miw2Myw2NSw2Nyw2OCw2OSw3MSw3Miw3Myw3Niw4MF06WzAsMiwzLDUsNiw5LDEwLDExLDEyLDEzLDE1LDE3LDE5LDIxLDIyLDIzLDI0LDI1LDI3LDI4LDI5LDMwLDMyLDMzLDM0LDM1LDM2LDM3LDM4LDM5LDQwLDQyLDQzLDQ0LDQ1LDQ4LDUwLDUxLDUyLDU0LDU1LDU3LDU4LDU5LDYwLDYxLDYyLDY0LDY1LDY2LDY3LDY5LDc0LDc1LDc4LDc5LDgwXTpbMCwxLDQsNSw2LDcsOSwxMCwxMiwxMywxNCwxNywxOCwxOSwyMCwyMywyNSwyNiwyNywyOCwyOSwzMCwzMiwzNCwzNywzOCwzOSw0MSw0Myw0NCw0Nyw0OSw1MCw1MSw1Miw1Myw1NCw1NSw1Niw1Nyw1OCw1OSw2MCw2MSw2Miw2Myw2NCw2NSw2Niw2Nyw2OCw2OSw3MCw3MSw3Miw3NSw3Niw3OCw3OSw4MF0=`,
    OLD_LOADED_BOARD_SOLUTION = [
        [3, 8, 4, 2, 1, 6, 7, 5, 9],
        [2, 7, 9, 5, 3, 4, 6, 8, 1],
        [1, 5, 6, 7, 8, 9, 4, 3, 2],
        [4, 6, 3, 9, 5, 1, 2, 7, 8],
        [9, 2, 8, 6, 4, 7, 3, 1, 5],
        [5, 1, 7, 3, 2, 8, 9, 6, 4],
        [8, 9, 2, 1, 7, 3, 5, 4, 6],
        [6, 3, 1, 4, 9, 5, 8, 2, 7],
        [7, 4, 5, 8, 6, 2, 1, 9, 3]
    ],
    LOADED_BOARD_SOLUTION = [
        [5, 4, 9, 8, 2, 7, 1, 3, 6],
        [6, 1, 7, 5, 3, 9, 2, 8, 4],
        [3, 8, 2, 4, 1, 6, 5, 9, 7],
        [7, 5, 1, 9, 4, 3, 6, 2, 8],
        [8, 2, 6, 7, 5, 1, 3, 4, 9],
        [4, 9, 3, 2, 6, 8, 7, 1, 5],
        [1, 7, 4, 3, 8, 5, 9, 6, 2],
        [9, 3, 8, 6, 7, 2, 4, 5, 1],
        [2, 6, 5, 1, 9, 4, 8, 7, 3]
      ],
    LOADED_EASY_SHEET = [
        [5, 4, 9, "", 2, 7, "", 3, ""],
        [6, "", 7, 5, 3, 9, "", "", 4],
        ["", "", 2, 4, 1, 6, 5, "", 7],
        ["", 5, 1, "", "", 3, 6, 2, ""],
        ["", "", "", 7, 5, "", "", 4, 9],
        [4, "", 3, "", "", 8, 7, 1, ""],
        ["", 7, 4, 3, "", 5, "", 6, ""],
        ["", 3, "", 6, "", "", "", 5, ""],
        ["", "", 5, 1, "", 4, 8, 7, ""]
    ],
    LOADED_MEDIUM_SHEET = [
      ["", 4, "", "", 2, "", "", 3, 6],
      ["", "", "", "", "", 9, "", 8, ""],
      [3, "", 2, "", "", "", "", "", 7],
      ["", "", "", "", 4, "", "", "", ""],
      ["", "", "", "", "", 1, "", "", ""],
      ["", 9, 3, "", 6, "", "", "", 5],
      ["", "", 4, "", "", "", "", "", ""],
      [9, "", "", "", "", 2, "", 5, 1],
      [2, 6, "", "", 9, 4, "", "", ""]
    ],
    LOADED_HARD_SHEET = [
      ["", "", 9, 8, "", "", "", "", 6],
      ["", "", 7, "", "", "", 2, 8, ""],
      ["", "", "", 4, 1, "", 5, "", ""],
      ["", "", "", "", 4, "", 6, "", 8],
      [8, "", "", "", 5, "", 3, "", ""],
      [4, 9, "", 2, "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", 6, 5, "", "", 4, "", "", ""]
    ];

let l_oUniqueBoards,
    l_oBoard,
    l_bOK;

console.log("Generating 1 Boards...");
SudokuGenerator.generate(2);
console.log("generated 1 board: ", SudokuGenerator.generatedBoards[0].signature);
console.log("Printing board 0: ");
SudokuGenerator.generatedBoards[0].prettyPrint();
console.log("Printing board 1: ");
SudokuGenerator.generatedBoards[1].prettyPrint();

l_bOK = JSON.stringify(SudokuGenerator.generatedBoards[0].getSheet(0)) === JSON.stringify(SudokuGenerator.generatedBoards[0].getSheet(0));
console.log("Asserting single easy sheet: ", l_bOK);
if (!l_bOK) {
    _exitError("Easy sheet validation failed");
}

l_bOK = JSON.stringify(SudokuGenerator.generatedBoards[0].getSheet(1)) === JSON.stringify(SudokuGenerator.generatedBoards[0].getSheet(1));
console.log("Asserting single medium sheet: ", l_bOK);
if (!l_bOK) {
    _exitError("Medium sheet validation failed");
}

l_bOK = JSON.stringify(SudokuGenerator.generatedBoards[0].getSheet(2)) === JSON.stringify(SudokuGenerator.generatedBoards[0].getSheet(2));
console.log("Asserting single hard sheet: ", l_bOK);
if (!l_bOK) {
    _exitError("Hard sheet validation failed");
}

console.log("Generating 100 Boards...");
SudokuGenerator.generate(100);

console.log("Asserting unicity of generated boards...");
l_oUniqueBoards = new Set(SudokuGenerator.generatedBoards.map(i_oBoard => i_oBoard.signature));
console.log(`Generated boards ${SudokuGenerator.generatedBoards.length}\nUnique Boards: ${l_oUniqueBoards.size}`);

console.log("Loading old saved board through signature...");
l_oBoard = SudokuGenerator.loadBoard(OLD_SAVED_BOARD_SIGNATURE);

if (l_oBoard) {
    l_oBoard.prettyPrint();
    if (JSON.stringify(l_oBoard.board) === JSON.stringify(OLD_LOADED_BOARD_SOLUTION)) {
        console.log("Loaded board matches");
    } else {
        _exitError("Error loading board, mismatch");
    }
} else {
    _exitError("Error loading board, bad signature");
}

console.log("Loading saved board through signature...");
l_oBoard = SudokuGenerator.loadBoard(SAVED_BOARD_SIGNATURE);

if (l_oBoard) {
    l_oBoard.prettyPrint();
    if (JSON.stringify(l_oBoard.board) === JSON.stringify(LOADED_BOARD_SOLUTION)) {
        console.log("Loaded board matches");
    } else {
        _exitError("Error loading board, mismatch");
    }
} else {
    _exitError("Error loading board, bad signature");
}

l_bOK = JSON.stringify(l_oBoard.getSheet(0)) === JSON.stringify(LOADED_EASY_SHEET);
console.log("Asserting single easy sheet: ", l_bOK);

if (!l_bOK) {
    _exitError("Easy sheet validation failed");
}

l_bOK = JSON.stringify(l_oBoard.getSheet(1)) === JSON.stringify(LOADED_MEDIUM_SHEET);
console.log("Asserting single medium sheet: ", l_bOK);

if (!l_bOK) {
    _exitError("Medium sheet validation failed");
}

l_bOK = JSON.stringify(l_oBoard.getSheet(2)) === JSON.stringify(LOADED_HARD_SHEET);
console.log("Asserting single hard sheet: ", l_bOK);

if (!l_bOK) {
    _exitError("Medium sheet validation failed");
}

console.log("Goodbye.");
