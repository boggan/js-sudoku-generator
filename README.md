# js-sudoku-generator

Javascript Sudoku sheet generator

## Dependencies
- node js (https://nodejs.org/)

## Installation
- install via npm: 

```javascript
npm install js-sudoku-generator --save
```

## Build instructions
- install dependencies via: npm install
- build with webpack via: webpack --config webpack.prod.js
- Once library is built, in the "dist" folder, you will find both node (dist/js-sudoku-generator.js) / web (dist/js-sudoku-generator.web.js) version of the lib.

### inclusion 

#### NodeJS

```javascript
const
    SudokuGenerator = require("js-sudoku-generator").SudokuGenerator;
```

#### Web

```html
<script src="./node_modules/js-sudoku-generator/dist/js-sudoku-generator.web.js"></script>
```

### code examples

```javascript
// generate sudoku solution boards, single argument is the number of boards
SudokuGenerator.generate(2);

// get difficulty sheets 
let l_oFirstBoard = SudokuGenerator.generatedBoards[0];

// get sheet signature (for loading)
console.log(l_oFirstBoard.signature);

// load saved board 
let l_oLoadedBoard = SudokuGenerator.loadBoard(l_oFirstBoard.signature);

// get hard difficulty sheet
let l_aHardSheet = l_oFirstBoard.getSheet(2);

// get medium difficulty sheet
let l_aMediumSheet = l_oFirstBoard.getSheet(1);

// get easy difficulty sheet
let l_aEasySheet = l_oFirstBoard.getSheet(0);

// pretty print solution to console
l_oFirstBoard.prettyPrint();

// pretty print sheet
l_oFirstBoard.prettyPrint(l_aEasySheet);
```