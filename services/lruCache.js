const LRUCACHESIZE = 3; // Test Size - will set properly later
let lruCacheHit = 0;
let lruCacheHitTime = [];
let lruCacheMissNotFull = 0;
let lruCacheMissNotFullTime = [];
let lruCacheMissFull = 0;
let lruCacheMissFullTime = [];
let theCacheItself = new Map();

/* 
What we need here...
Get - an item from the lru cache
if it's there, great!  cache hit ++ //// full, not full?
TODO how do we find cache full?
If it is a hit - pop the old, push the new, timestamp updated
If it is not a hit - push the new, timestamp updated

*/

// lruCache(1,1);
// lruCache(1,2);
// lruCache(1,3);
// lruCache(-10,10);
// // lruCache(-99,99);
// lruCache(-10,10);
// lruCache(-10,10);
// // lruCache(1,4);
// // lruCache(1,2);
// // lruCache(1,5);
// lruCache(1,6);
// lruCache(1,7);
// lruCache(1,8);
// lruCacheClear();
// lruCache(1,1);

// lruCacheStats();

function lruCacheStats() {
    this.getAvg = function(thingToAvg) {
        let sumAvg = 0;
        let countAvg = 0;
        thingToAvg.forEach((timeItem) => {
            countAvg++;
            sumAvg += timeItem;
        });
        let avg = sumAvg/countAvg;
        return avg;
    },
    this.clearStats = function() {
        lruCacheHit = 0;
        lruCacheHitTime = [];
        lruCacheMissNotFull = 0;
        lruCacheMissNotFullTime = [];
        lruCacheMissFull = 0;
        lruCacheMissFullTime = [];
        
        return 0;
    }

    let lruCacheStats = {
        hit: lruCacheHit,
        hitAvg: this.getAvg(lruCacheHitTime),
        missFull: lruCacheMissFull,
        missFullAvg: this.getAvg(lruCacheMissFullTime),
        missNotFull: lruCacheMissNotFull,
        missNotFullAvg: this.getAvg(lruCacheMissNotFullTime)
    }
    console.log(lruCacheStats);
    return(lruCacheStats);
}

function lruCache(latitude, longitude) {
    this.get = function(latitude,longitude) {
        let key = latitude+'/'+longitude
        console.log(`Changed to key: ${key}`);
        if (theCacheItself.has(key)) {
            console.log(`Cool a cache hit!`);
            let url = theCacheItself.get(key)[0]; // grab the url to re-use it
            console.log(`Re-using url: ${url}`);
            
            lruCacheHit++;

            this.pop(key);
            this.push(key, url);
        }
        else {
            console.log(`Cache miss - adding key ${key}`);
            if(this.sizeCheck()) {
                lruCacheMissFull++;
            }
            else {
                lruCacheMissNotFull++;
            }
            this.push(key);
        }
        return theCacheItself.get(key)[0];
    },
    this.push = function(key, url) {
        if (url == null) {
            url = this.getImageURL()
        }
        else {
            console.log(`url was re-used.... ${url}... it's a cache...`);
            // TODO some sort of age timeout?  
        }
        theCacheItself.set(key,[url, this.getDate()]);
        console.log(theCacheItself);
        return 0;
    },
    this.pop = function(key) {
        theCacheItself.delete(key);
        return 0;
    },
    this.sizeCheck = function() {
        let sizeCheck; // True = over size ---- False = under size
        let currentSize = theCacheItself.size;
        // We are including AT SIZE in the TRUE portion as another push at this point would put us over size
        console.log(`Current Size = ${currentSize} - MAX: ${LRUCACHESIZE}`)
        if (currentSize >= LRUCACHESIZE) {
            sizeCheck = true
            let firstItemKey = theCacheItself.keys().next().value // list all keys, take 'next' or first value... which is a key
            console.log(`removing first item... ${firstItemKey}`)
            this.pop(firstItemKey)
        }
        else if (currentSize < LRUCACHESIZE) {
            sizeCheck = false
        }
        else {
            let error = 'somehow we have an issue with our size'
        }
        return sizeCheck;
    },
    this.getImageURL = function() {
        // this is our expensive operation that we are faking
        let random = Math.floor((Math.random() * 10000) + 1);
        return (`https://somepage.com/marsCoords/image/${random}`);
    },
    this.getDate = function() {
        let currentDate = new Date();
        return currentDate;
    }

    let returnValue = this.get(latitude,longitude);
    return returnValue;
}

function lruCacheClear() {
    theCacheItself.clear();
    console.log(`Should be empty: ${theCacheItself}`);
    return 0;
}

module.exports = {
    lruCacheStats:lruCacheStats,
    lruCache:lruCache,
    lruCacheClear:lruCacheClear
}