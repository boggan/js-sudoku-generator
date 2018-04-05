/*
 * Name: SudokuCluster
 * Description: Class to represent a Sudoku cluster (9x9)
 * Author: Thomas Lanteigne
 * Date: 03/04/2018
 */
const
    CLUSTER_END = 2, // 0 -> 2
    POOL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class SudokuCluster {
    constructor(i_nClusterIdx, i_nStartRow, i_nStartColumn) {
        this.idx = i_nClusterIdx;
        this.srow = i_nStartRow; // start row
        this.erow = i_nStartRow + CLUSTER_END; // end row
        this.scol = i_nStartColumn; // start col
        this.ecol = i_nStartColumn + CLUSTER_END; // end col
        this.availNumbers = new Set(POOL_NUMBERS); // available numbers in pool
        this.cells = new Set(); // cells allocated in pool
    }
}

module.exports = SudokuCluster;
