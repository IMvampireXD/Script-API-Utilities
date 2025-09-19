
/**
 * 2x2 matrix implementation.
 */
export class Matrix2x2 {
    /**
     * Creates a 2x2 matrix.
     */
    constructor(m11 = 1, m12 = 0, m21 = 0, m22 = 1) {
        if (Array.isArray(m11)) {
            if (m11.length === 4) {
                [this.m11, this.m12, this.m21, this.m22] = m11;
            } else if (m11.length === 2 && Array.isArray(m11[0])) {
                const [u, v] = m11;
                [this.m11, this.m12, this.m21, this.m22] = [u[0], v[0], u[1], v[1]];
            }
        } else {
            this.m11 = m11; this.m12 = m12;
            this.m21 = m21; this.m22 = m22;
        }
    }

    /**
     * Returns the identity 2x2 matrix.
     */
    static Identity() {
        return new Matrix2x2(1, 0, 0, 1);
    }

    /**
     * Creates a copy of the matrix.
     */
    clone() {
        return new Matrix2x2(this.m11, this.m12, this.m21, this.m22);
    }

    /**
     * Converts the matrix to an array.
     */
    toArray() {
        return [this.m11, this.m12, this.m21, this.m22];
    }

    /**
     * Multiplies the matrix by a scalar, vector, or another matrix.
     */
    mul(value) {
        if (typeof value === "number") {
            return new Matrix2x2(
                this.m11 * value, this.m12 * value,
                this.m21 * value, this.m22 * value
            );
        } else if (Array.isArray(value) && value.length === 2) {
            return [
                this.m11 * value[0] + this.m12 * value[1],
                this.m21 * value[0] + this.m22 * value[1]
            ];
        } else if (value instanceof Matrix2x2) {
            return new Matrix2x2(
                this.m11 * value.m11 + this.m12 * value.m21,
                this.m11 * value.m12 + this.m12 * value.m22,
                this.m21 * value.m11 + this.m22 * value.m21,
                this.m21 * value.m12 + this.m22 * value.m22
            );
        }
        throw new Error("Invalid multiplication operand.");
    }

    /**
     * Returns the trace (sum of diagonal elements).
     */
    trace() {
        return this.m11 + this.m22;
    }

    /**
     * Returns the determinant of the matrix.
     */
    determinant() {
        return this.m11 * this.m22 - this.m12 * this.m21;
    }

    /**
     * Returns the transpose of the matrix.
     */
    transpose() {
        return new Matrix2x2(this.m11, this.m21, this.m12, this.m22);
    }

    /**
     * Returns the cofactor matrix.
     */
    cofactor() {
        return new Matrix2x2(this.m22, -this.m21, -this.m12, this.m11);
    }

    /**
     * Returns the adjugate matrix.
     */
    adjugate() {
        return new Matrix2x2(this.m22, -this.m12, -this.m21, this.m11);
    }

    /**
     * Returns the inverse of the matrix.
     */
    inverse() {
        const det = this.determinant();
        if (det === 0) throw new Error("Matrix not invertible.");
        return this.adjugate().mul(1 / det);
    }
}
