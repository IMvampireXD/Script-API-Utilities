
/**
 * 3x3 matrix implementation.
 */
export class Matrix3x3 {
    /**
     * Creates a 3x3 matrix.
     */
    constructor(m11 = 1, m12 = 0, m13 = 0, m21 = 0, m22 = 1, m23 = 0, m31 = 0, m32 = 0, m33 = 1) {
        if (Array.isArray(m11)) {
            if (m11.length === 9) {
                [this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33] = m11;
            } else if (m11.length === 3 && Array.isArray(m11[0])) {
                const [u, v, w] = m11;
                [this.m11, this.m12, this.m13] = [u[0], v[0], w[0]];
                [this.m21, this.m22, this.m23] = [u[1], v[1], w[1]];
                [this.m31, this.m32, this.m33] = [u[2], v[2], w[2]];
            }
        } else {
            this.m11 = m11; this.m12 = m12; this.m13 = m13;
            this.m21 = m21; this.m22 = m22; this.m23 = m23;
            this.m31 = m31; this.m32 = m32; this.m33 = m33;
        }
    }

    /**
     * Returns the identity 3x3 matrix.
     */
    static Identity() {
        return new Matrix3x3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    /**
     * Creates a copy of the matrix.
     */
    clone() {
        return new Matrix3x3(
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23,
            this.m31, this.m32, this.m33
        );
    }

    /**
     * Converts the matrix to an array.
     */
    toArray() {
        return [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23,
            this.m31, this.m32, this.m33
        ];
    }

    /**
     * Multiplies the matrix by a scalar, vector, or another matrix.
     */
    mul(value) {
        if (typeof value === "number") {
            return new Matrix3x3(
                this.m11 * value, this.m12 * value, this.m13 * value,
                this.m21 * value, this.m22 * value, this.m23 * value,
                this.m31 * value, this.m32 * value, this.m33 * value
            );
        } else if (Array.isArray(value) && value.length === 3) {
            return [
                this.m11 * value[0] + this.m12 * value[1] + this.m13 * value[2],
                this.m21 * value[0] + this.m22 * value[1] + this.m23 * value[2],
                this.m31 * value[0] + this.m32 * value[1] + this.m33 * value[2]
            ];
        } else if (value instanceof Matrix3x3) {
            return new Matrix3x3(
                this.m11 * value.m11 + this.m12 * value.m21 + this.m13 * value.m31,
                this.m11 * value.m12 + this.m12 * value.m22 + this.m13 * value.m32,
                this.m11 * value.m13 + this.m12 * value.m23 + this.m13 * value.m33,
                this.m21 * value.m11 + this.m22 * value.m21 + this.m23 * value.m31,
                this.m21 * value.m12 + this.m22 * value.m22 + this.m23 * value.m32,
                this.m21 * value.m13 + this.m22 * value.m23 + this.m23 * value.m33,
                this.m31 * value.m11 + this.m32 * value.m21 + this.m33 * value.m31,
                this.m31 * value.m12 + this.m32 * value.m22 + this.m33 * value.m32,
                this.m31 * value.m13 + this.m32 * value.m23 + this.m33 * value.m33
            );
        }
        throw new Error("Invalid multiplication operand.");
    }

    /**
     * Returns the trace (sum of diagonal elements).
     */
    trace() {
        return this.m11 + this.m22 + this.m33;
    }

    /**
     * Returns the determinant of the matrix.
     */
    determinant() {
        return (
            this.m11 * (this.m22 * this.m33 - this.m23 * this.m32) -
            this.m12 * (this.m21 * this.m33 - this.m23 * this.m31) +
            this.m13 * (this.m21 * this.m32 - this.m22 * this.m31)
        );
    }

    /**
     * Returns the transpose of the matrix.
     */
    transpose() {
        return new Matrix3x3(
            this.m11, this.m21, this.m31,
            this.m12, this.m22, this.m32,
            this.m13, this.m23, this.m33
        );
    }

    /**
     * Returns the cofactor matrix.
     */
    cofactor() {
        return new Matrix3x3(
            this.m22 * this.m33 - this.m23 * this.m32,
            this.m23 * this.m31 - this.m21 * this.m33,
            this.m21 * this.m32 - this.m22 * this.m31,
            this.m13 * this.m32 - this.m12 * this.m33,
            this.m11 * this.m33 - this.m13 * this.m31,
            this.m12 * this.m31 - this.m11 * this.m32,
            this.m12 * this.m23 - this.m13 * this.m22,
            this.m13 * this.m21 - this.m11 * this.m23,
            this.m11 * this.m22 - this.m12 * this.m21
        );
    }

    /**
     * Returns the adjugate matrix.
     */
    adjugate() {
        return this.cofactor().transpose();
    }

    /**
     * Returns the inverse of the matrix.
     */
    inverse() {
        const det = this.determinant();
        if (det === 0) throw new Error("Matrix not invertible.");
        return this.adjugate().mul(1 / det);
    }

    /**
     * Builds a TNB (Tangent-Normal-Binormal) frame from a normal vector.
     */
    static buildTNB(n) {
        const len = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
        const norm = [n[0] / len, n[1] / len, n[2] / len];

        let t;
        if (Math.abs(norm[1]) === 1) {
            t = [1, 0, 0];
        } else {
            const lenT = Math.sqrt(norm[2] * norm[2] + norm[0] * norm[0]);
            t = [norm[2] / lenT, 0, -norm[0] / lenT];
        }

        const b = [
            norm[1] * t[2] - norm[2] * t[1],
            norm[2] * t[0] - norm[0] * t[2],
            norm[0] * t[1] - norm[1] * t[0]
        ];

        return new Matrix3x3(t, norm, b);
    }
}
