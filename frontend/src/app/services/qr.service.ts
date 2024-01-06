import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import * as QRCode from "qrcode";


@Injectable({
  providedIn: 'root'
})
export class QrService {
  private url  = "/api/qr"
  image = ""

  constructor(private http : HttpClient) { }

  async encodeQRCode(text: string): Promise<string> {
    try {
      const url = await QRCode.toDataURL(text);
      console.log("DONE");
      return url;
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  async encodeMultipleQRCode(texts: string[]): Promise<string[]> {
    const promises = texts.map(text => this.encodeQRCode(text));
    return Promise.all(promises);
  }

  generateQR(data : string, size : number) : Observable<any> {

    console.log("FIRE")
    let tmp = this.url;

    if (size !== 0 && size != null) {
      tmp = this.url + "/" + size;
    }

    return this.http.post(tmp, data , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: "blob"
    })
  }


/*
const NUMERIC_RE = /^\d*$/;
const ALPHANUMERIC_RE = /^[\dA-Z $%*+\-./:]*$/;
const LATIN1_RE = /^[\x00-\xff]*$/;
const KANJI_RE = /^[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]*$/u;
function getEncodingMode(string) {
  if (NUMERIC_RE.test(string)) {
    return 0b0001;
  }
  if (ALPHANUMERIC_RE.test(string)) {
    return 0b0010;
  }
  if (LATIN1_RE.test(string)) {
    return 0b0100;
  }
  if (KANJI_RE.test(string)) {
    return 0b1000;
  }
  return 0b0111;
}

const LENGTH_BITS = [
  [10, 12, 14],
  [9, 11, 13],
  [8, 16, 16],
  [8, 10, 12]
];
function getLengthBits(mode, version) {
  const modeIndex = 31 - Math.clz32(mode);
  const bitsIndex = version > 26 ? 2 : version > 9 ? 1 : 0;
  return LENGTH_BITS[modeIndex][bitsIndex];
}



function getByteData(content, lengthBits, dataCodewords) {
  const data = new Uint8Array(dataCodewords);
  const rightShift = (4 + lengthBits) & 7;
  const leftShift = 8 - rightShift;
  const andMask = (1 << rightShift) - 1;
  const dataIndexStart = lengthBits > 12 ? 2 : 1;

  data[0] = 64 byte mode + (content.length >> (lengthBits - 4));
  if (lengthBits > 12) {
  data[1] = (content.length >> rightShift) & 255;
}
data[dataIndexStart] = (content.length & andMask) << leftShift;

for (let index = 0; index < content.length; index++) {
  const byte = content.charCodeAt(index);
  data[index + dataIndexStart] |= byte >> rightShift;
  data[index + dataIndexStart + 1] = (byte & andMask) << leftShift;
}
const remaining = dataCodewords - content.length - dataIndexStart - 1;
for (let index = 0; index < remaining; index++) {
  const byte = index & 1 ? 17 : 236;
  data[index + content.length + 2] = byte;
}
return data;
}

const LOG = new Uint8Array(256);
const EXP = new Uint8Array(256);
for (let exponent = 1, value = 1; exponent < 256; exponent++) {
  value = value > 127 ? ((value << 1) ^ 285) : value << 1;
  LOG[value] = exponent % 255;
  EXP[exponent % 255] = value;
}


function mul(a, b) {
  return a && b ? EXP[(LOG[a] + LOG[b]) % 255] : 0;
}
function div(a, b) {
  return EXP[(LOG[a] + LOG[b] * 254) % 255];
}

function polyMul(poly1, poly2) {
  // This is going to be the product polynomial, that we pre-allocate.
  // We know it's going to be `poly1.length + poly2.length - 1` long.
  const coeffs = new Uint8Array(poly1.length + poly2.length - 1);

  // Instead of executing all the steps in the example, we can jump to
  // computing the coefficients of the result
  for (let index = 0; index < coeffs.length; index++) {
    let coeff = 0;
    for (let p1index = 0; p1index <= index; p1index++) {
      const p2index = index - p1index;
      // We *should* do better here, as `p1index` and `p2index` could
      // be out of range, but `mul` defined above will handle that case.
      // Just beware of that when implementing in other languages.
      coeff ^= mul(poly1[p1index], poly2[p2index]);
    }
    coeffs[index] = coeff;
  }
  return coeffs;
}


function polyRest(dividend, divisor) {
  const quotientLength = dividend.length - divisor.length + 1;
  // Let's just say that the dividend is the rest right away
  let rest = new Uint8Array(dividend);
  for (let count = 0; count < quotientLength; count++) {
    // If the first term is 0, we can just skip this iteration
    if (rest[0]) {
      const factor = div(rest[0], divisor[0]);
      const subtr = new Uint8Array(rest.length);
      subtr.set(polyMul(divisor, [factor]), 0);
      rest = rest.map((value, index) => value ^ subtr[index]).slice(1);
    } else {
      rest = rest.slice(1);
    }
  }
  return rest;
}


function getGeneratorPoly(degree) {
  let lastPoly = new Uint8Array([1]);
  for (let index = 0; index < degree; index++) {
    lastPoly = polyMul(lastPoly, new Uint8Array([1, EXP[index]]));
  }
  return lastPoly;
}


function getEDC(data, codewords) {
  const degree = codewords - data.length;
  const messagePoly = new Uint8Array(codewords);
  messagePoly.set(data, 0);
  return polyRest(messagePoly, getGeneratorPoly(degree));
}


function getSize(version) {
  return version * 4 + 17;
}
function getNewMatrix(version) {
  const length = getSize(version);
  return Array.from({ length }, () => new Uint8Array(length));
}

function fillArea(matrix, row, column, width, height, fill = 1) {
  const fillRow = new Uint8Array(width).fill(fill);
  for (let index = row; index < row + height; index++) {
    // YES, this mutates the matrix. Watch out!
    matrix[index].set(fillRow, column);
  }
}


function getModuleSequence(version) {
  const matrix = getNewMatrix(version);
  const size = getSize(version);

  // Finder patterns + divisors
  fillArea(matrix, 0, 0, 9, 9);
  fillArea(matrix, 0, size - 8, 8, 9);
  fillArea(matrix, size - 8, 0, 9, 8);
  // Alignment pattern - yes, we just place one. For the general
  // implementation, wait for the next parts in the series!
  fillArea(matrix, size - 9, size - 9, 5, 5);
  // Timing patterns
  fillArea(matrix, 6, 9, version * 4, 1);
  fillArea(matrix, 9, 6, 1, version * 4);
  // Dark module
  matrix[size - 8][8] = 1;

  let rowStep = -1;
  let row = size - 1;
  let column = size - 1;
  const sequence = [];
  let index = 0;
  while (column >= 0) {
    if (matrix[row][column] === 0) {
      sequence.push([row, column]);
    }
    // Checking the parity of the index of the current module
    if (index & 1) {
      row += rowStep;
      if (row === -1 || row === size) {
        rowStep = -rowStep;
        row += rowStep;
        column -= column === 7 ? 2 : 1;
      } else {
        column++;
      }
    } else {
      column--;
    }
    index++;
  }
  return sequence;
}



function getRawQRCode(message) {
  // One day, we'll compute these values. But not today!
  const VERSION = 2;
  const TOTAL_CODEWORDS = 44;
  const LENGTH_BITS = 8;
  const DATA_CODEWORDS = 28;

  const codewords = new Uint8Array(TOTAL_CODEWORDS);
  const byteData = getByteData(message, LENGTH_BITS, DATA_CODEWORDS);
  codewords.set(byteData, 0);
  codewords.set(getEDC(byteData, TOTAL_CODEWORDS), DATA_CODEWORDS);

  const size = getSize(VERSION);
  const qrCode = getNewMatrix(VERSION);
  const moduleSequence = getModuleSequence(VERSION);

  // Placing the fixed patterns
  // Finder patterns
  [[0, 0], [size - 7, 0], [0, size - 7]].forEach(([row, col]) => {
    fillArea(qrCode, row, col, 7, 7);
    fillArea(qrCode, row + 1, col + 1, 5, 5, 0);
    fillArea(qrCode, row + 2, col + 2, 3, 3);
  });
  // Separators
  fillArea(qrCode, 7, 0, 8, 1, 0);
  fillArea(qrCode, 0, 7, 1, 7, 0);
  fillArea(qrCode, size - 8, 0, 8, 1, 0);
  fillArea(qrCode, 0, size - 8, 1, 7, 0);
  fillArea(qrCode, 7, size - 8, 8, 1, 0);
  fillArea(qrCode, size - 7, 7, 1, 7, 0);
  // Alignment pattern
  fillArea(qrCode, size - 9, size - 9, 5, 5);
  fillArea(qrCode, size - 8, size - 8, 3, 3, 0);
  qrCode[size - 7][size - 7] = 1;
  // Timing patterns
  for (let pos = 8; pos < VERSION * 4 + 8; pos += 2) {
    qrCode[6][pos] = 1;
    qrCode[6][pos + 1] = 0;
    qrCode[pos][6] = 1;
    qrCode[pos + 1][6] = 0;
  }
  qrCode[6][size - 7] = 1;
  qrCode[size - 7][6] = 1;
  // Dark module
  qrCode[size - 8][8] = 1;

  // Placing message and error data
  let index = 0;
  for (const codeword of codewords) {
    // Counting down from the leftmost bit
    for (let shift = 7; shift >= 0; shift--;) {
      const bit = (codeword >> shift) & 1;
      const [row, column] = moduleSequence[index];
      index++;
      qrCode[row][column] = bit;
    }
  }
  return qrCode;
}


const MASK_FNS = [
  (row, column) => ((row + column) & 1) === 0,
  (row, column) => (row & 1) === 0,
  (row, column) => column % 3 === 0,
  (row, column) => (row + column) % 3 === 0,
  (row, column) => (((row >> 1) + Math.floor(column / 3)) & 1) === 0,
  (row, column) => ((row * column) & 1) + ((row * column) % 3) === 0,
  (row, column) => ((((row * column) & 1) + ((row * column) % 3)) & 1) === 0,
  (row, column) => ((((row + column) & 1) + ((row * column) % 3)) & 1) === 0,
];


function getMaskedMatrix(version, codewords, maskIndex) {
  const sequence = getModuleSequence(version);
  const matrix = getNewMatrix(version);
  sequence.forEach(([ row, column ], index) => {
    // Each codeword contains 8 modules, so shifting the index to the
    // right by 3 gives the codeword's index
    const codeword = codewords[index >> 3];
    const bitShift = 7 - (index & 7);
    const moduleBit = (codeword >> bitShift) & 1;
    matrix[row][column] = moduleBit ^ MASK_FNS[maskIndex](row, column);
  });
  return matrix;
}



const EDC_ORDER = 'MLHQ';
const errorLevelIndex = EDC_ORDER.indexOf(level);
formatPoly[0] = errorLevelIndex >> 1;
formatPoly[1] = errorLevelIndex & 1;
formatPoly[2] = maskIndex >> 2;
formatPoly[3] = (maskIndex >> 1) & 1;
formatPoly[4] = maskIndex & 1;


const FORMAT_DIVISOR = new Uint8Array([1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1]);
const rest = polyRest(formatPoly, FORMAT_DIVISOR);
formatPoly.set(rest, 5);


const FORMAT_MASK = new Uint8Array([1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]);
const maskedFormatPoly = formatPoly.map(
  (bit, index) => bit ^ FORMAT_MASK[index]
);


const EDC_ORDER = 'MLHQ';
const FORMAT_DIVISOR = new Uint8Array([1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1]);
const FORMAT_MASK = new Uint8Array([1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]);
function getFormatModules(errorLevel, maskIndex) {
  const formatPoly = new Uint8Array(15);
  const errorLevelIndex = EDC_ORDER.indexOf(errorLevel);
  formatPoly[0] = errorLevelIndex >> 1;
  formatPoly[1] = errorLevelIndex & 1;
  formatPoly[2] = maskIndex >> 2;
  formatPoly[3] = (maskIndex >> 1) & 1;
  formatPoly[4] = maskIndex & 1;
  const rest = polyRest(formatPoly, FORMAT_DIVISOR);
  formatPoly.set(rest, 5);
  const maskedFormatPoly = formatPoly.map(
    (bit, index) => bit ^ FORMAT_MASK[index]
  );
  return maskedFormatPoly;
}



matrix[8].set(maskedFormatPoly.subarray(0, 6), 0);
matrix[8].set(maskedFormatPoly.subarray(6, 8), 7);
matrix[8].set(maskedFormatPoly.subarray(7), matrix.length - 8);
matrix[7][8] = maskedFormatPoly[8];
maskedFormatPoly.subarray(0, 7).forEach(
  (cell, index) => (matrix[matrix.length - index - 1][8] = cell)
);
maskedFormatPoly.subarray(9).forEach(
  (cell, index) => (matrix[5 - index][8] = cell)
);

// WARNING: this function *mutates* the given matrix!
function placeFixedPatterns(matrix) {
  const size = matrix.length;
  // Finder patterns
  [[0, 0], [size - 7, 0], [0, size - 7]].forEach(([row, col]) => {
    fillArea(matrix, row, col, 7, 7);
    fillArea(matrix, row + 1, col + 1, 5, 5, 0);
    fillArea(matrix, row + 2, col + 2, 3, 3);
  });
  // Separators
  fillArea(matrix, 7, 0, 8, 1, 0);
  fillArea(matrix, 0, 7, 1, 7, 0);
  fillArea(matrix, size - 8, 0, 8, 1, 0);
  fillArea(matrix, 0, size - 8, 1, 7, 0);
  fillArea(matrix, 7, size - 8, 8, 1, 0);
  fillArea(matrix, size - 7, 7, 1, 7, 0);
  // Alignment pattern
  fillArea(matrix, size - 9, size - 9, 5, 5);
  fillArea(matrix, size - 8, size - 8, 3, 3, 0);
  matrix[size - 7][size - 7] = 1;
  // Timing patterns
  for (let pos = 8; pos < size - 9; pos += 2) {
    matrix[6][pos] = 1;
    matrix[6][pos + 1] = 0;
    matrix[pos][6] = 1;
    matrix[pos + 1][6] = 0;
  }
  matrix[6][size - 7] = 1;
  matrix[size - 7][6] = 1;
  // Dark module
  matrix[size - 8][8] = 1;
}


// WARNING: this function *mutates* the given matrix!
function placeFormatModules(matrix, errorLevel, maskIndex) {
  const formatModules = getFormatModules(errorLevel, maskIndex);
  matrix[8].set(formatModules.subarray(0, 6), 0);
  matrix[8].set(formatModules.subarray(6, 8), 7);
  matrix[8].set(formatModules.subarray(7), matrix.length - 8);
  matrix[7][8] = formatModules[8];
  formatModules.subarray(0, 7).forEach(
    (cell, index) => (matrix[matrix.length - index - 1][8] = cell)
  );
  formatModules.subarray(9).forEach(
    (cell, index) => (matrix[5 - index][8] = cell)
  );
}

function getMaskedQRCode(version, codewords, errorLevel, maskIndex) {
  const matrix = getMaskedMatrix(version, codewords, maskIndex);
  placeFormatModules(matrix, errorLevel, maskIndex);
  placeFixedPatterns(matrix);
  return matrix;
}



const RULE_3_PATTERN = new Uint8Array([1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0]);
const RULE_3_REVERSED_PATTERN = RULE_3_PATTERN.slice().reverse();

function getLinePenalty(line) {
  let count = 0;
  let counting = 0;
  let penalty = 0;
  for (const cell of line) {
    if (cell !== counting) {
      counting = cell;
      count = 1;
    } else {
      count++;
      if (count === 5) {
        penalty += 3;
      } else if (count > 5) {
        penalty++;
      }
    }
  }
  return penalty;
}

function getPenaltyScore(matrix) {
  let totalPenalty = 0;

  // Rule 1
  const rowPenalty = matrix.reduce(
    (sum, row) => sum + getLinePenalty(row)
  , 0);
  totalPenalty += rowPenalty;

  const columnPenalty = matrix.reduce((sum, _, columnIndex) => {
    const column = matrix.map(row => row[columnIndex]);
    return sum + getLinePenalty(column);
  }, 0);
  totalPenalty += columnPenalty;

  // Rule 2
  let blocks = 0;
  const size = matrix.length
  for (let row = 0; row < size - 1; row++) {
    for (let column = 0; column < size - 1; column++) {
      const module = matrix[row][column];
      if (
        matrix[row][column + 1] === module &&
        matrix[row + 1][column] === module &&
        matrix[row + 1][column + 1] === module
      ) {
        blocks++;
      }
    }
  }
  totalPenalty += blocks * 3;

  // Rule 3
  let patterns = 0;
  for (let index = 0; index < size; index++) {
    const row = matrix[index];
    for (let columnIndex = 0; columnIndex < size - 11; columnIndex++) {
      if ([RULE_3_PATTERN, RULE_3_REVERSED_PATTERN].some(
        pattern => pattern.every(
          (cell, ptr) => cell === row[columnIndex + ptr]
        )
      )) {
        patterns++;
      }
    }
    for (let rowIndex = 0; rowIndex < size - 11; rowIndex++) {
      if ([RULE_3_PATTERN, RULE_3_REVERSED_PATTERN].some(
        pattern => pattern.every(
          (cell, ptr) => cell === matrix[rowIndex + ptr][index]
        )
      )) {
        patterns++;
      }
    }
  }
  totalPenalty += patterns * 40;

  // Rule 4
  const totalModules = size * size;
  const darkModules = matrix.reduce(
    (sum, line) => sum + line.reduce(
      (lineSum, cell) => lineSum + cell
    , 0)
  , 0);
  const percentage = darkModules * 100 / totalModules;
  const mixPenalty = Math.abs(Math.trunc(percentage / 5 - 10)) * 10;

  return totalPenalty + mixPenalty;
}


function getOptimalMask(version, codewords, errorLevel) {
  let bestMatrix;
  let bestScore = Infinity;
  let bestMask = -1;
  for (let index = 0; index < 8; index++) {
    const matrix = getMaskedQRCode(version, codewords, errorLevel, index);
    const penaltyScore = getPenaltyScore(matrix);
    if (penaltyScore < bestScore) {
      bestScore = penaltyScore;
      bestMatrix = matrix;
      bestMask = index;
    }
  }
  return [bestMatrix, bestMask];
}


 */











}
