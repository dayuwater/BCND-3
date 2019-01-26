/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.get(key, function(err, value) {
                if (err) { 
                    console.log('Not found!', err);
                    reject(err);
                }
                console.log('Value = ' + value);
                resolve(value);
            })
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject() 
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
            });
            resolve({key:value});
        });
    }

    // Add data to LevelDB with generated key.
    addDataToLevelDB(value) {
        const self = this;
        let i = 0;

        return new Promise((resolve, reject) => {
            self.db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                console.log('Unable to read data stream!', err);
                reject(err);
            }).on('close', function() {
                console.log('Block #' + i);

                self.addLevelDBData(i, value)
                .then(value => resolve(value))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
                
            });
        });
        
    }

    // Method that return the height
    getBlocksCount() {
        const self = this;
        let i = 0;

        return new Promise((resolve, reject) => {
            self.db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                console.log('Unable to read data stream!', err);
                reject(err);
            }).on('close', function() {
                console.log(`The next Block will be Block ${i}, which is the block height`);    
                resolve(i);
            });
        });
    }
        

}

module.exports = LevelSandbox;