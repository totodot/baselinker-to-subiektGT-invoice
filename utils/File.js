const fs = require('fs');

class File {
  constructor() {
    this.path = 'files/subiekt.json';
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          this.json = JSON.parse(data);
          resolve();
        }
      });
    });
  }

  save() {
    const json = JSON.stringify(this.json);
    fs.writeFile(this.path, json, 'utf8');
  }
}

module.exports = File;
