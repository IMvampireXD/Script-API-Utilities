/**
 * A Perlin Noise library for JavaScript.
 * 
 * Based on implementations by Ken Perlin (Java, C) & Stefan Gustavson (C).
 * 
 * MIT License.
 * Copyright (c) 2018 Leonardo de S.L.F.
 * http://leodeslf.com/
 */

// Permutation table.
const p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
    75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
    149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
    27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
    92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
    209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
    164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
    147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
    28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153,
    101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224,
    232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144,
    12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214,
    31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150,
    254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66,
    215, 61, 156, 180
];
const P = [...p, ...p];

// Utility functions.

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t, a, b) {
    return a + t * (b - a);
}

// Helper functions to find gradients for each vertex.

function gradient1D(hash, x) {
    return hash & 1 ? -x : x;
}

function gradient2D(hash, x, y) {
    const H = hash & 3;
    return (H < 2 ? x : -x) + (H === 0 || H === 2 ? y : -y);
}

function gradient3D(hash, x, y, z) {
    const
        H = hash & 15,
        U = H < 8 ? x : y,
        V = H < 4 ? y : H === 12 || H === 14 ? x : z;
    return ((H & 1) ? -U : U) + ((H & 2) ? -V : V);
}

function gradient4D(hash, x, y, z, t) {
    const
        H = hash & 31,
        U = H < 24 ? x : y,
        V = H < 16 ? y : z,
        W = H < 8 ? z : t;
    return ((H & 1) ? -U : U) + ((H & 2) ? -V : V) + ((H & 4) ? -W : W);
}

// Perlin Noise functions.

/**
 * Returns a one-dimensional noise value between -1 and 1.
 * @param {number} x A numeric expression.
 * @returns {number} Perlin Noise value.
 */
function perlin1D(x) {
    const
        FX = Math.floor(x),
        X = FX & 255;

    x = x - FX;

    return lerp(
        fade(x),
        gradient1D(P[P[X]], x),
        gradient1D(P[P[X + 1]], x - 1)
    );
}

/**
 * Returns a two-dimensional noise value between -1 and 1.
 * @param {number} x A numeric expression.
 * @param {number} y A numeric expression.
 * @returns {number} Perlin Noise value.
 */
function perlin2D(x, y) {
    const
        FX = Math.floor(x),
        FY = Math.floor(y),
        X = FX & 255,
        Y = FY & 255,
        A = P[X] + Y,
        B = P[X + 1] + Y;

    x = x - FX;
    y = y - FY;

    const
        FDX = fade(x),
        x1 = x - 1,
        y1 = y - 1;

    return lerp(
        fade(y),
        lerp(
            FDX,
            gradient2D(P[A], x, y),
            gradient2D(P[B], x1, y)
        ),
        lerp(
            FDX,
            gradient2D(P[A + 1], x, y1),
            gradient2D(P[B + 1], x1, y1)
        )
    );
}

/**
 * Returns a three-dimensional noise value between -1 and 1.
 * @param {number} x A numeric expression.
 * @param {number} y A numeric expression.
 * @param {number} z A numeric expression.
 * @returns {number} Perlin Noise value.
 */
function perlin3D(x, y, z) {
    const
        FX = Math.floor(x),
        FY = Math.floor(y),
        FZ = Math.floor(z),
        X = FX & 255,
        Y = FY & 255,
        Z = FZ & 255,
        A = P[X] + Y,
        B = P[X + 1] + Y,
        AA = P[A] + Z,
        BA = P[B] + Z,
        AB = P[A + 1] + Z,
        BB = P[B + 1] + Z;

    x = x - FX;
    y = y - FY;
    z = z - FZ;

    const
        FDX = fade(x),
        FDY = fade(y),
        x1 = x - 1,
        y1 = y - 1,
        z1 = z - 1;

    return lerp(
        fade(z),
        lerp(
            FDY,
            lerp(
                FDX,
                gradient3D(P[AA], x, y, z),
                gradient3D(P[BA], x1, y, z)
            ),
            lerp(
                FDX,
                gradient3D(P[AB], x, y1, z),
                gradient3D(P[BB], x1, y1, z)
            )
        ),
        lerp(
            FDY,
            lerp(
                FDX,
                gradient3D(P[AA + 1], x, y, z1),
                gradient3D(P[BA + 1], x1, y, z1)
            ),
            lerp(
                FDX,
                gradient3D(P[AB + 1], x, y1, z1),
                gradient3D(P[BB + 1], x1, y1, z1)
            )
        )
    );
}

/**
 * Returns a four-dimensional noise value between -1 and 1.
 * @param {number} x A numeric expression.
 * @param {number} y A numeric expression.
 * @param {number} z A numeric expression.
 * @param {number} t A numeric expression.
 * @returns {number} Perlin Noise value.
 */
function perlin4D(x, y, z, t) {
    const
        FX = Math.floor(x),
        FY = Math.floor(y),
        FZ = Math.floor(z),
        FT = Math.floor(t),
        X = FX & 255,
        Y = FY & 255,
        Z = FZ & 255,
        T = FT & 255,
        A = P[X] + Y,
        B = P[X + 1] + Y,
        AA = P[A] + Z,
        BA = P[B] + Z,
        AB = P[A + 1] + Z,
        BB = P[B + 1] + Z,
        AAA = P[AA] + T,
        BAA = P[BA] + T,
        ABA = P[AB] + T,
        BBA = P[BB] + T,
        AAB = P[AA + 1] + T,
        BAB = P[BA + 1] + T,
        ABB = P[AB + 1] + T,
        BBB = P[BB + 1] + T;

    x = x - FX;
    y = y - FY;
    z = z - FZ;
    t = t - FT;

    const
        FDX = fade(x),
        FDY = fade(y),
        FDZ = fade(z),
        x1 = x - 1,
        y1 = y - 1,
        z1 = z - 1,
        t1 = t - 1;

    return lerp(
        fade(t),
        lerp(
            FDZ,
            lerp(
                FDY,
                lerp(
                    FDX,
                    gradient4D(P[AAA], x, y, z, t),
                    gradient4D(P[BAA], x1, y, z, t)
                ),
                lerp(
                    FDX,
                    gradient4D(P[ABA], x, y1, z, t),
                    gradient4D(P[BBA], x1, y1, z, t)
                )
            ),
            lerp(
                FDY,
                lerp(
                    FDX,
                    gradient4D(P[AAB], x, y, z1, t),
                    gradient4D(P[BAB], x1, y, z1, t)
                ),
                lerp(
                    FDX,
                    gradient4D(P[ABB], x, y1, z1, t),
                    gradient4D(P[BBB], x1, y1, z1, t)
                )
            )
        ),
        lerp(
            FDZ,
            lerp(
                FDY,
                lerp(
                    FDX,
                    gradient4D(P[AAA + 1], x, y, z, t1),
                    gradient4D(P[BAA + 1], x1, y, z, t1)
                ),
                lerp(
                    FDX,
                    gradient4D(P[ABA + 1], x, y1, z, t1),
                    gradient4D(P[BBA + 1], x1, y1, z, t1)
                )
            ),
            lerp(
                FDY,
                lerp(
                    FDX,
                    gradient4D(P[AAB + 1], x, y, z1, t1),
                    gradient4D(P[BAB + 1], x1, y, z1, t1)
                ),
                lerp(
                    FDX,
                    gradient4D(P[ABB + 1], x, y1, z1, t1),
                    gradient4D(P[BBB + 1], x1, y1, z1, t1)
                )
            )
        )
    );
}

export { perlin1D, perlin2D, perlin3D, perlin4D };