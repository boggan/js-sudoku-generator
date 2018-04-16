/*
 * Name: SudokuGenerator
 * Description: Class to represent a Sudoku solution board.
 * Author: Thomas Lanteigne
 * Date: 03/04/2018
 */
const
    SudokuCluster = require("./SudokuCluster.js"),
    BACKTRACK_INCREMENT = 4,
    NUMBER_ROWS = 9,
    NUMBER_COLUMNS = 9,
    MAX_SAME_COLLISION_BACKTRACK = 5;

//=============================================================================
function _getRandomBoundNumber(i_nMin, i_nMax) {
    let l_nNumber = Math.round(Math.random() * i_nMax);

    l_nNumber = Math.max(l_nNumber, i_nMin); // assert that number is @ least i_nMin
    l_nNumber = Math.min(l_nNumber, i_nMax); // assert that number is @ lower or equal than

    return l_nNumber;
}

//=============================================================================
function _blankCells(i_nMin, i_nMax, i_aRow) {
    let l_nNbBlanks = _getRandomBoundNumber(i_nMin, i_nMax),
        l_nCellIndex,
        l_nColumn;

    for (l_nColumn = 0; l_nColumn < l_nNbBlanks; l_nColumn++) {
        do {
            l_nCellIndex = _getRandomBoundNumber(0, 8); // 8 === i_aRow.length - 1
        }
        while (i_aRow[l_nCellIndex] === "");

        i_aRow[l_nCellIndex] = '';
    }
}

//=============================================================================
function _findCluster(i_aClusters, i_nRow, i_nCol) {
    return i_aClusters.find(i_oCluster =>
        i_oCluster.srow <= i_nRow &&
        i_oCluster.erow >= i_nRow &&
        i_oCluster.scol <= i_nCol &&
        i_oCluster.ecol >= i_nCol);
}

//=============================================================================
function _isIncludedInRow(i_oSudokuBoard, i_nNumber, i_nRow) {
    return i_oSudokuBoard.board[i_nRow].includes(i_nNumber);
}

//=============================================================================
function _isIncludedInColumn(i_oSudokuBoard, i_nNumber, i_nColumn) {
    let l_nRow,
        l_bIncluded = false;

    for (l_nRow = 0; l_nRow < i_oSudokuBoard.board.length && !l_bIncluded; l_nRow++) {
        l_bIncluded = i_oSudokuBoard.board[l_nRow][i_nColumn] === i_nNumber;
    }

    return l_bIncluded;
}

//=============================================================================
function _getNumberFromCluster(i_oCluster, i_aAvailableList) {
    let l_nIndex,
        l_aAvailableList = i_aAvailableList || Array.from(i_oCluster.availNumbers);

    l_nIndex = Math.round(Math.random() * (l_aAvailableList.length - 1));

    return {
        number: l_aAvailableList[l_nIndex],
        index: l_nIndex,
        list: l_aAvailableList
    };
}


//=============================================================================
function _getAvailableNumber(i_oSudokuBoard, i_oCluster, i_nRow, i_nCol) {
    let l_oNumberInfos = _getNumberFromCluster(i_oCluster),
        l_aAvailableNumbers,
        l_nNum = 0,
        l_bCollidingRow = false,
        l_bCollidingCol = false;


    do {
        l_aAvailableNumbers = l_oNumberInfos.list;
        l_nNum = l_oNumberInfos.number;

        // useful for debugging ;)
        l_bCollidingRow = _isIncludedInRow(i_oSudokuBoard, l_nNum, i_nRow);
        l_bCollidingCol = _isIncludedInColumn(i_oSudokuBoard, l_nNum, i_nCol);

        // check if number is already present in row or column from board
        if (l_bCollidingRow || l_bCollidingCol) {
            // remove from pool
            l_aAvailableNumbers.splice(l_oNumberInfos.index, 1);
            if (l_aAvailableNumbers.length === 0) {
                l_nNum = 0; // invalid combination detected @ ${i_nRow}x${i_nCol}, need to rollback
            }
            l_oNumberInfos = _getNumberFromCluster(i_oCluster, l_aAvailableNumbers);
        } else {
            break;
        }
    } while (l_aAvailableNumbers.length > 0);

    if (l_aAvailableNumbers.length > 0) {
        l_nNum = l_oNumberInfos.number;
    }

    return l_nNum;
}

//=============================================================================
function _backtrackNumbers(i_oSudokuBoard, i_nRow, i_nFrom, i_nTo) {
    let l_oCurrentCluster,
        l_nColumn,
        l_aBoard = i_oSudokuBoard.board,
        l_aClusters = g_oPrivateVars.get(i_oSudokuBoard).clusters;

    for (l_nColumn = i_nFrom; l_nColumn >= i_nTo && l_nColumn >= 0; l_nColumn--) {
        l_oCurrentCluster = _findCluster(l_aClusters, i_nRow, l_nColumn);
        if (l_oCurrentCluster) {
            if (l_aBoard[i_nRow][l_nColumn] !== 0) {
                l_oCurrentCluster.availNumbers.add(l_aBoard[i_nRow][l_nColumn]); // bring back number in cluster's available number pool
            }
            l_aBoard[i_nRow][l_nColumn] = 0;
        } else {
            // this should never happen...
            console.error(`ERROR: Backtracking, Couldn't Find pool for row(${i}) col(${l_nColumn}) `);
        }
    }

    return l_nColumn;
}

//=============================================================================
function _generateDifficultyPlaySheet(i_nDifficulty) {
    let l_nRow,
        l_nColumn,
        l_nMinBlanks,
        l_nMaxBlanks,
        l_aPlaySheet = JSON.parse(JSON.stringify(this.board)); // copy of play sheet


    if (i_nDifficulty === 2) {
        // hard -> 6 -> 9 blank per row
        l_nMinBlanks = 6;
        l_nMaxBlanks = 9;
    } else if (i_nDifficulty === 1) {
        // medium 5 -> 8 blank per row
        l_nMinBlanks = 5;
        l_nMaxBlanks = 8;
    } else {
        // easy, 3->7 blank per row
        l_nMinBlanks = 3;
        l_nMaxBlanks = 7;
    }

    l_aPlaySheet.forEach(_blankCells.bind(this, l_nMinBlanks, l_nMaxBlanks));

    return l_aPlaySheet;
}

//=============================================================================
function _generateSignature(i_aBoard, i_aPlaySheets) {
    let i,
        l_aFlatSheet,
        l_aBlankSpots = [],
        l_aSignatureChunks = [[].concat(...i_aBoard).join("")]; // 0 - solution, 1- easy sheet, 2- medium sheet, 3- hard sheet

    for (i = 0; i < i_aPlaySheets.length; i++) {
        l_aFlatSheet = [].concat(...i_aPlaySheets[i]);

        l_aFlatSheet.forEach((i_xCellContent, i_nIdx) => {
            if (i_xCellContent === "") {
                l_aBlankSpots.push(i_nIdx);
            }
        });
        l_aSignatureChunks.push(JSON.stringify(l_aBlankSpots));
        l_aBlankSpots.length = 0;
    }

    return Buffer.from(l_aSignatureChunks.join(":")).toString('base64');
}

// weakmap for private variables
let g_oPrivateVars = new WeakMap();
//=============================================================================
class SudokuBoard {
    //=============================================================================
    constructor() {
        let l_nRow,
            l_nColumn,
            l_aColumns;

        this.signature = null; // filled post generation

        // build board
        this.board = []; // 9 rows

        // fill board with blanks
        for (l_nRow = 0; l_nRow < NUMBER_ROWS; l_nRow++) {
            l_aColumns = new Array(NUMBER_COLUMNS);
            l_aColumns.fill(0, 0, NUMBER_COLUMNS);
            this.board.push(l_aColumns); // 9 colums
        }
    }

    // start filling board
    //=============================================================================
    generate() {
        let l_nRow,
            l_nColumn,
            l_oCurrentCluster,
            l_nCellNumber,
            l_sCollidingCoordinates,
            l_sLastCollidingCoordinates,
            l_nBacktrackNumber = BACKTRACK_INCREMENT,
            l_nBacktrackCollisions = 0,
            l_aClusters = [], // initialize clusters
            l_aPlaySheets = [],
            l_nClusterIdx;

        // build clusters
        l_nClusterIdx = 0;
        for (l_nRow = 0; l_nRow < this.board.length; l_nRow += 3) {
            for (l_nColumn = 0; l_nColumn < this.board[l_nRow].length; l_nColumn += 3) {
                l_aClusters.push(new SudokuCluster(l_nClusterIdx, l_nRow, l_nColumn));
                l_nClusterIdx++;
            }
        }

        // private var locker
        g_oPrivateVars.set(this, {
            clusters: l_aClusters
        });

        // or go from 0 -> 9
        for (l_nRow = 0; l_nRow < this.board.length; l_nRow++) {
            for (l_nColumn = 0; l_nColumn < this.board[l_nRow].length; l_nColumn++) {
                l_oCurrentCluster = _findCluster(l_aClusters, l_nRow, l_nColumn);
                if (l_oCurrentCluster) {
                    // get available numbers for pool + current position
                    l_nCellNumber = _getAvailableNumber(this, l_oCurrentCluster, l_nRow, l_nColumn);

                    if (l_nCellNumber > 0) {
                        this.board[l_nRow][l_nColumn] = l_nCellNumber;
                        l_oCurrentCluster.availNumbers.delete(l_nCellNumber);
                    } else {
                        // collision  detected....
                        l_sCollidingCoordinates = `${l_nRow}-${l_nColumn}`;
                        if (l_sCollidingCoordinates === l_sLastCollidingCoordinates) {
                            l_nBacktrackNumber++;
                            l_nBacktrackCollisions++;
                        } else {
                            l_nBacktrackNumber = BACKTRACK_INCREMENT;
                            l_nBacktrackCollisions = 0;
                        }

                        l_sLastCollidingCoordinates = l_sCollidingCoordinates;
                        if (l_nBacktrackCollisions >= MAX_SAME_COLLISION_BACKTRACK) {
                            // max number of allowd collision @ the same spot, re-writing current and previous rows
                            // revert current row
                            _backtrackNumbers(this, l_nRow, l_nColumn - 1, 0);

                            // revert previous row
                            l_nRow--;
                            _backtrackNumbers(this, l_nRow, 8, 0);

                            l_nColumn = -1;
                        } else {
                            // backtrack numbers from l_nColumn, re-stock cluster's avail number for each found number
                            l_nColumn = _backtrackNumbers(this, l_nRow, l_nColumn - 1, l_nColumn - l_nBacktrackNumber);
                        }
                    }
                } else {
                    // this should never happen...
                    console.error(`ERROR: Building board, Couldn't Find pool for row(${l_nRow}) col(${l_nColumn}) `);
                }
            }
        }

        // generate all difficulty levels
        l_aPlaySheets.push(_generateDifficultyPlaySheet.call(this, 0));
        l_aPlaySheets.push(_generateDifficultyPlaySheet.call(this, 1));
        l_aPlaySheets.push(_generateDifficultyPlaySheet.call(this, 2));

        // generate unique signature for board and all difficulty levels
        this.signature = _generateSignature(this.board, l_aPlaySheets);

        g_oPrivateVars.get(this).clusters.length = 0;
        g_oPrivateVars.get(this).playSheets = l_aPlaySheets;

        return this.board; // returns solution board
    }

    /*
     * 0 -> easy
     * 1 -> medium
     * 2 -> hard
     */
    //=============================================================================
    getSheet(i_nDifficulty) {
        let l_nDifficulty = i_nDifficulty || 0,
            l_aPlaySheets = g_oPrivateVars.get(this).playSheets,
            l_aPlaySheet;

        l_aPlaySheet = l_aPlaySheets[l_nDifficulty] || l_aPlaySheets[0];

        if (!l_aPlaySheet) {
            l_aPlaySheet = _generateDifficultyPlaySheet(i_nDifficulty); // since it's not part of the signature, it will be random each time (only for old signatures)
        }

        return l_aPlaySheet;
    }

    /*
     * Load previously saved sudoku board
     */
    //=============================================================================
    load(i_sSignature) {
        let l_aChunks = Buffer.from(i_sSignature, 'base64').toString('ascii').split(":"),
            l_sRawBoard = l_aChunks.shift(),
            l_aPlaySheets = [],
            l_aRows;

        if (l_sRawBoard && l_sRawBoard.length === 81 && /^\d+$/i.test(l_sRawBoard)) {
            l_aRows = l_sRawBoard.match(/\d{9}/g);
            this.signature = i_sSignature;
            this.board = l_aRows.map(i_sRow => i_sRow.split("").map(Number));
            l_aChunks.forEach(i_sRawPlaySheet => {
                let l_aPlaySheet = JSON.parse(JSON.stringify(this.board)),
                    l_aBlanks = JSON.parse(i_sRawPlaySheet),
                    l_nRow,
                    l_nColumn;

                l_aBlanks.forEach(i_nBlankSpot => {
                    l_nRow = Math.floor(i_nBlankSpot / 9);
                    l_nColumn = i_nBlankSpot % 9;
                    l_aPlaySheet[l_nRow][l_nColumn] = "";
                });

                l_aPlaySheets.push(l_aPlaySheet);
            });

            g_oPrivateVars.set(this, {
                playSheets: l_aPlaySheets
            });
        } else {
            throw ("Invalid signature received...");
        }
    }

    /*
     * pretty prints the sudoku board
     * if no board specified, will print solution board
     */
    //=============================================================================
    prettyPrint(i_aBoard) {
        let i,
            k,
            l_aBoard = i_aBoard || this.board,
            l_sBoard = " |  ";

        for (i = 0; i < l_aBoard.length; i++) {
            for (k = 0; k < l_aBoard[i].length; k++) {
                l_sBoard += `${l_aBoard[i][k]||" "} `;
                if (k !== 0 && (k + 1) % 3 === 0) {
                    l_sBoard += " |  ";
                }
            }
            l_sBoard += "\n";
            if (i + 1 < l_aBoard.length) {
                if (i !== 0 && (i + 1) % 3 === 0) {
                    l_sBoard += "\n"; // extra space between blocks
                }

                l_sBoard += " |  ";
            }
        }

        console.log(l_sBoard);
    }
}

module.exports = SudokuBoard;
