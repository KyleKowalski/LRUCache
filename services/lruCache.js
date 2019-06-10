const LRUCACHESIZE = 3; // Test Size - will set properly later
let lruCacheHitNotFull = 0;
let lruCacheHitFull = 0;
let lruCacheMissNotFull = 0;
let lruCacheMissFull = 0;
let theCacheItself = new Map();

function getLRUCacheStats(){
    return('you asked for LRU cache stats... here they are... soon(TM)');

}

/* 
What we need here...
Get - an item from the lru cache
if it's there, great!  cache hit ++ //// full, not full?
TODO how do we find cache full?
If it is a hit - pop the old, push the new, timestamp updated
If it is not a hit - push the new, timestamp updated

*/
lruCache(-10,10);
lruCache(-99,99);
lruCache(-10,10);
lruCache(-10,10);
lruCache(1,1);
lruCache(1,2);
lruCache(1,3);
lruCache(1,4);
lruCache(1,2);
lruCache(1,5);
lruCache(1,6);
lruCache(1,7);
lruCache(1,8);

function lruCache(latitude, longitude) {
    this.get = function(latitude,longitude) {
        let key = latitude+'/'+longitude
        console.log(`Changed to key: ${key}`);
        if (theCacheItself.has(key)) {
            console.log(`Cool a cache hit!`);
            if(this.sizeCheck()) {
                lruCacheHitFull++;
            }
            else {
                lruCacheHitNotFull++;
            }
            this.pop(key);
            this.push(key);
            return 0;
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
            return 0;
        }
        
    },
    this.push = function(key) {
        theCacheItself.set(key,[this.getImageURL(), this.getDate()]);
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
    }
    this.clearCache = function() {
        theCacheItself.clear();
        console.log(`Should be empty: ${theCacheItself}`);
        return 0;
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

    this.get(latitude,longitude);

    return;
}

module.exports = {
    getLRUCacheStats:getLRUCacheStats,
    lruCache:lruCache
}