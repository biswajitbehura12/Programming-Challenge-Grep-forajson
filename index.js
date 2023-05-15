// const readline = require('readline');
// const commander = require('commander');

const fs = require('fs');

function isJSON(line) {
  try {
    JSON.parse(line);
    return true;
  } catch {
    return false;
  }
}

function grep(lines, pattern, opt) {
  let matches = [];
  let lcount = 0;

  for (const line of lines) {
    lcount++;

    if (!isJSON(line)) {
      if (opt.igjson) continue;
      console.log(`Invalid JSON on line number ${lcount}`);
      return;
    }

    const json = JSON.parse(line);

    if (opt.keysOnly) {
      const keys = Object.keys(json);
      if (keys.includes(pattern)) {
        if (opt.conly) {
          matches.push(lcount);
        } else {
          matches.push(line);
        }
      }
    } else if (opt.vO) {
      const values = Object.values(json);
      if (values.includes(pattern)) {
        if (opt.conly) {
          matches.push(lcount);
        } else {
          matches.push(line);
        }
      }
    } else {
      const regex = new RegExp(pattern, opt.casesen ? 'i' : '');
      if (regex.test(line)) {
        if (opt.conly) {
          matches.push(lcount);
        } else {
          matches.push(line);
        }
      }
    }
  }

  if (opt.conly) {
    console.log(matches.length);
  } else {
    console.log(matches.join('\n'));
  }
}

function jsonGrep(filename, pattern, opt) {
  const lines = fs.readFileSync(filename, 'utf8').split('\n');
  grep(lines, pattern, opt);
}

const filename = 'json_sample_err.log';
const pattern = 'Java';
const opt = {
  keysOnly: false,
  vO: false,
  igjson: false,
  casesen: false,
  conly: false,
  iMatch: false
};

jsonGrep(filename, pattern, opt);
