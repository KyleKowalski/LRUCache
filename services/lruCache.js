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
    }

    let lruCacheStats = {
        hit: lruCacheHit,
        hitNumbers: lruCacheHitTime,
        hitAvg: this.getAvg(lruCacheHitTime),
        missFull: lruCacheMissFull,
        missFullNumbers: lruCacheMissFullTime,
        missFullAvg: this.getAvg(lruCacheMissFullTime),
        missNotFull: lruCacheMissNotFull,
        missNotFullNumbers: lruCacheMissNotFullTime,
        missNotFullAvg: this.getAvg(lruCacheMissNotFullTime)
    }
    console.log(lruCacheStats);
    return(lruCacheStats);
}

function lruStatsClear() {
    lruCacheHit = 0;
    lruCacheHitTime = [];
    lruCacheMissNotFull = 0;
    lruCacheMissNotFullTime = [];
    lruCacheMissFull = 0;
    lruCacheMissFullTime = [];
    
    return 'stats cleared';
}

function lruCache(latitude, longitude) {

    
    this.get = function(latitude,longitude) {
        // timer, target and key are reset on every get
        // an interesting timer functionality in node
        //https://leapforwards.wordpress.com/2015/09/20/how-to-measure-execution-time-in-node-js-javascript/
        let hrTime0 = process.hrtime(); 
        let timeTarget = null;
        let key = latitude+'/'+longitude

        if (theCacheItself.has(key)) {
            let url = theCacheItself.get(key)[0]; // grab the url to re-use it
            
            lruCacheHit++;
            timeTarget = 'hit';
            // reset the timer and order so we don't drop this from cache
            this.pop(key);
            this.push(key, url); 
        }
        else {
            if(this.sizeCheck()) {
                lruCacheMissFull++;
                timeTarget = 'missFull';
            }
            else {
                lruCacheMissNotFull++;
                timeTarget = 'missNotFull';
            }
            this.push(key);
        }

        const totalTime = process.hrtime(hrTime0);
        let timeInMs = (totalTime[0] + totalTime[1]/1000000);
        if (timeTarget === 'hit') {
            lruCacheHitTime.push(timeInMs);
        }
        else if (timeTarget === 'missFull') {
            lruCacheMissFullTime.push(timeInMs);
        }
        else if (timeTarget === 'missNotFull') {
            lruCacheMissNotFullTime.push(timeInMs);
        }
        else (
            console.log('Error in our timer')
        )

        return theCacheItself.get(key)[0];
    },
    this.push = function(key, url) {
        if (url == null) {
            url = this.getImageURL()
        }
        else {
            // re-using the url... 
            // TODO some sort of age timeout?  
        }
        theCacheItself.set(key,[url, this.getDate()]);
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
        if (currentSize >= LRUCACHESIZE) {
            sizeCheck = true
            let firstItemKey = theCacheItself.keys().next().value // list all keys, take 'next' or first value... which is a key
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
    return 'cache cleared';
}

module.exports = {
    lruCacheStats:lruCacheStats,
    lruCache:lruCache,
    lruCacheClear:lruCacheClear,
    lruStatsClear:lruStatsClear
}