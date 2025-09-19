
const isVec2Symbol = Symbol("isVec2");

export function Vec2(x = 0, y = 0) {
    if (new.target) {
        this.x = Number(x);
        this.y = Number(y);
    } else {
        return {
            x: Number(x),
            y: Number(y),
            __proto__: Vec2.prototype,
        };
    }
}

Vec2.magnitude = function magnitude(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
};

Vec2.normalize = function normalize(vec) {
    const l = Vec2.magnitude(vec);
    if (l === 0) return Vec2.zero;
    return { x: vec.x / l, y: vec.y / l, __proto__: Vec2.prototype };
};

Vec2.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y;
};

Vec2.cross = function cross(a, b) {
    return a.x * b.y - a.y * b.x;
};

Vec2.angleBetween = function angleBetween(a, b) {
    return Math.acos(Vec2.dot(a, b) / (Vec2.magnitude(a) * Vec2.magnitude(b)));
};

Vec2.add = function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y, __proto__: Vec2.prototype };
};

Vec2.subtract = function subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, __proto__: Vec2.prototype };
};

Vec2.multiply = function multiply(vec, num) {
    if (typeof num === "number")
        return { x: vec.x * num, y: vec.y * num, __proto__: Vec2.prototype };
    else
        return { x: vec.x * num.x, y: vec.y * num.y, __proto__: Vec2.prototype };
};

Vec2.equals = function equals(a, b) {
    return a.x === b.x && a.y === b.y;
};

Vec2.stringify = function stringify(vec) {
    return `<${vec.x}, ${vec.y}>`;
};

Vec2.isVec2 = function isVec2(vec) {
    return vec[isVec2Symbol] === true;
};

Vec2.floor = function floor(vec) {
    return { x: Math.floor(vec.x), y: Math.floor(vec.y), __proto__: Vec2.prototype };
};

Vec2.round = function round(vec) {
    return { x: Math.round(vec.x), y: Math.round(vec.y), __proto__: Vec2.prototype };
};

Vec2.projection = function projection(a, b) {
    const scalar = Vec2.dot(a, b) / (b.x * b.x + b.y * b.y);
    return Vec2.multiply(b, scalar);
};

Vec2.rejection = function rejection(a, b) {
    return Vec2.subtract(a, Vec2.projection(a, b));
};

Vec2.reflect = function reflect(v, n) {
    return Vec2.subtract(v, Vec2.multiply(n, 2 * Vec2.dot(v, n)));
};

Vec2.lerp = function lerp(a, b, t) {
    return Vec2.multiply(a, 1 - t).add(Vec2.multiply(b, t));
};

Vec2.distance = function distance(a, b) {
    return Vec2.magnitude(Vec2.subtract(a, b));
};

Vec2.from = function from(object) {
    if (Vec2.isVec2(object)) return object;
    if (Array.isArray(object)) return Vec2(object[0], object[1]);
    if (typeof object == "number") return Vec2(object, object);
    const { x = 0, y = 0 } = object ?? {};
    return { x: Number(x), y: Number(y), __proto__: Vec2.prototype };
};

Vec2.sort = function sort(vec1, vec2) {
    const [x1, x2] = vec1.x < vec2.x ? [vec1.x, vec2.x] : [vec2.x, vec1.x];
    const [y1, y2] = vec1.y < vec2.y ? [vec1.y, vec2.y] : [vec2.y, vec1.y];
    return [
        { x: x1, y: y1, __proto__: Vec2.prototype },
        { x: x2, y: y2, __proto__: Vec2.prototype },
    ];
};

Vec2.rotate = function rotate(vec, angle) {
    const rad = angle * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
        x: vec.x * cos - vec.y * sin,
        y: vec.x * sin + vec.y * cos,
        __proto__: Vec2.prototype,
    };
};

Vec2.up = { x: 0, y: 1, __proto__: Vec2.prototype };
Vec2.down = { x: 0, y: -1, __proto__: Vec2.prototype };
Vec2.right = { x: 1, y: 0, __proto__: Vec2.prototype };
Vec2.left = { x: -1, y: 0, __proto__: Vec2.prototype };
Vec2.zero = { x: 0, y: 0, __proto__: Vec2.prototype };

Vec2.prototype = {
    distance(vec) {
        return Vec2.distance(this, vec);
    },
    lerp(vec, t) {
        return Vec2.lerp(this, vec, t);
    },
    projection(vec) {
        return Vec2.projection(this, vec);
    },
    rejection(vec) {
        return Vec2.rejection(this, vec);
    },
    reflect(vec) {
        return Vec2.reflect(this, vec);
    },
    cross(vec) {
        return Vec2.cross(this, vec);
    },
    dot(vec) {
        return Vec2.dot(this, vec);
    },
    floor() {
        return Vec2.floor(this);
    },
    round() {
        return Vec2.round(this);
    },
    add(vec) {
        return Vec2.add(this, vec);
    },
    subtract(vec) {
        return Vec2.subtract(this, vec);
    },
    multiply(num) {
        return Vec2.multiply(this, num);
    },
    rotate(angle) {
        return Vec2.rotate(this, angle);
    },
    equals(vec) {
        return Vec2.equals(this, vec);
    },
    get length() {
        return Vec2.magnitude(this);
    },
    get normalized() {
        return Vec2.normalize(this);
    },
    x: 0,
    y: 0,
    [isVec2Symbol]: true,
    toString() {
        return Vec2.stringify(this);
    },
};
