import * as mc from '@minecraft/server'
import MT from './src/mt.js'

export const getChunk = (vec, divide_floor = 16, product = divide_floor) => {
    /**  floor(A/B)*C  */
    divide_floor = Math.abs(divide_floor);
    let result = Array.isArray(vec) ? [] : {};
    for (const key of Object.getOwnPropertyNames(vec))
        typeof vec[key] === "number"
            && key !== "length"
            && (result[key] = Math.floor(vec[key] / divide_floor) * product);
    return result;
};

export default class Chunk {
	#baseX;
	#baseZ; 
	
	constructor (x, z) {
		this.#baseX = x;
		this.#baseZ = z;
		this.minX = Math.floor(x / 16) * 16;
		this.minZ = Math.floor(z / 16) * 16;
		this.maxX = this.minX + 15;
		this.maxZ = this.minZ + 15;
		this.worldX = Math.floor(this.minX / 16);
		this.worldZ = Math.floor(this.minZ / 16);
		this.center = { x: this.minX + 7.5, z: this.minZ + 7.5 }
	}
	
	isSlime() {
		const chunkX = Math.floor(this.#baseX / 16) >>> 0;
		const chunkZ = Math.floor(this.#baseZ / 16) >>> 0;
		const seed = ((a, b) => {
			let a00 = a & 0xffff;
			let a16 = a >>> 16;
			let b00 = b & 0xffff;
			let b16 = b >>> 16;
			let c00 = a00 * b00;
			let c16 = c00 >>> 16; 
				
			c16 += a16 * b00;
			c16 &= 0xffff;
			c16 += a00 * b16; 
			
			let lo = c00 & 0xffff;
			let hi = c16 & 0xffff; 
				
			return((hi << 16) | lo) >>> 0;
		})(chunkX, 0x1f1f1f1f) ^ chunkZ;
		
		const mt = new MT(seed);
		const n = mt.nextInt();
		const isSlime = (n % 10 == 0);
			
		return(isSlime);
	}
}

/////////////////////////////////


function isSlimeChunkPos(coordX, coordZ) {
    let chunkX = Math.floor(coordX / 16) >>> 0;
    let chunkZ = Math.floor(coordZ / 16) >>> 0;
    let seed = mul32_lo(chunkX, 0x1f1f1f1f) ^ chunkZ;
    let mt = new MersenneTwister(seed);
    let n = mt.nextInt();
    let isSlimechunk = (n % 10 == 0);

    return isSlimechunk;
}


//MersenneTwister
function MersenneTwister(seed) {
    if (arguments.length == 0)
        seed = new Date().getTime();

    this._mt = new Array(624);
    this.setSeed(seed);
}

MersenneTwister._mulUint32 = function (a, b) {
    var a1 = a >>> 16, a2 = a & 0xffff;
    var b1 = b >>> 16, b2 = b & 0xffff;
    return (((a1 * b2 + a2 * b1) << 16) + a2 * b2) >>> 0;
};

MersenneTwister._toNumber = function (x) {
    return (typeof x == "number" && !isNaN(x)) ? Math.ceil(x) : 0;
};

MersenneTwister.prototype.setSeed = function (seed) {
    var mt = this._mt;
    if (typeof seed == "number") {
        mt[0] = seed >>> 0;
        for (var i = 1; i < mt.length; i++) {
            var x = mt[i - 1] ^ (mt[i - 1] >>> 30);
            mt[i] = MersenneTwister._mulUint32(1812433253, x) + i;
        }
        this._index = mt.length;
    } else if (seed instanceof Array) {
        var i = 1, j = 0;
        this.setSeed(19650218);
        for (var k = Math.max(mt.length, seed.length); k > 0; k--) {
            var x = mt[i - 1] ^ (mt[i - 1] >>> 30);
            x = MersenneTwister._mulUint32(x, 1664525);
            mt[i] = (mt[i] ^ x) + (seed[j] >>> 0) + j;
            if (++i >= mt.length) {
                mt[0] = mt[mt.length - 1];
                i = 1;
            }
            if (++j >= seed.length) {
                j = 0;
            }
        }
        for (var k = mt.length - 1; k > 0; k--) {
            var x = mt[i - 1] ^ (mt[i - 1] >>> 30);
            x = MersenneTwister._mulUint32(x, 1566083941);
            mt[i] = (mt[i] ^ x) - i;
            if (++i >= mt.length) {
                mt[0] = mt[mt.length - 1];
                i = 1;
            }
        }
        mt[0] = 0x80000000;
    } else {
        throw new TypeError("MersenneTwister: illegal seed.");
    }
};

MersenneTwister.prototype._nextInt = function () {
    var mt = this._mt, value;

    if (this._index >= mt.length) {
        var k = 0, N = mt.length, M = 397;
        do {
            value = (mt[k] & 0x80000000) | (mt[k + 1] & 0x7fffffff);
            mt[k] = mt[k + M] ^ (value >>> 1) ^ ((value & 1) ? 0x9908b0df : 0);
        } while (++k < N - M);
        do {
            value = (mt[k] & 0x80000000) | (mt[k + 1] & 0x7fffffff);
            mt[k] = mt[k + M - N] ^ (value >>> 1) ^ ((value & 1) ? 0x9908b0df : 0);
        } while (++k < N - 1);
        value = (mt[N - 1] & 0x80000000) | (mt[0] & 0x7fffffff);
        mt[N - 1] = mt[M - 1] ^ (value >>> 1) ^ ((value & 1) ? 0x9908b0df : 0);
        this._index = 0;
    }

    value = mt[this._index++];
    value ^= value >>> 11;
    value ^= (value << 7) & 0x9d2c5680;
    value ^= (value << 15) & 0xefc60000;
    value ^= value >>> 18;
    return value >>> 0;
};

MersenneTwister.prototype.nextInt = function () {
    var min, sup;
    switch (arguments.length) {
        case 0:
            return this._nextInt();
        case 1:
            min = 0;
            sup = MersenneTwister._toNumber(arguments[0]);
            break;
        default:
            min = MersenneTwister._toNumber(arguments[0]);
            sup = MersenneTwister._toNumber(arguments[1]) - min;
            break;
    }

    if (!(0 < sup && sup < 0x100000000))
        return this._nextInt() + min;
    if ((sup & (~sup + 1)) == sup)
        return ((sup - 1) & this._nextInt()) + min;

    var value;
    do {
        value = this._nextInt();
    } while (sup > 4294967296 - (value - (value %= sup)));
    return value + min;
};

MersenneTwister.prototype.next = function () {
    var a = this._nextInt() >>> 5, b = this._nextInt() >>> 6;
    return (a * 0x4000000 + b) / 0x20000000000000;
};

function mul32_lo(a, b) {
    let a00 = a & 0xffff;
    let a16 = a >>> 16;
    let b00 = b & 0xffff;
    let b16 = b >>> 16;

    let c00 = a00 * b00;
    let c16 = c00 >>> 16;

    c16 += a16 * b00;
    c16 &= 0xffff;
    c16 += a00 * b16;

    let lo = c00 & 0xffff;
    let hi = c16 & 0xffff;

    return ((hi << 16) | lo) >>> 0;
}
