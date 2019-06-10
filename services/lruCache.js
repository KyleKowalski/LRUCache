const LRUCACHESIZE = 3; // Test Size - will set properly later
let lruCacheHitNotFull = 0;
let lruCacheHitFull = 0;
let lruCacheMissNotFull = 0;
let lruCacheMissFull = 0;

function getLRUCacheStats(){
    return('you asked for LRU cache stats... here they are... soon(TM)');

}

function getLRUCache(latitude, longitude) {
    return(`You sent me lat: ${latitude} and long: ${longitude}`)

}

module.exports = {
    getLRUCacheStats:getLRUCacheStats,
    getLRUCache:getLRUCache
}