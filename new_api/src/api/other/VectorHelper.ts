import { MathHelper } from "./MathHelper";

// Standard vector constants
export const VECTOR3_UP = { x: 0, y: 1, z: 0 };
export const VECTOR3_DOWN = { x: 0, y: -1, z: 0 };
export const VECTOR3_LEFT = { x: -1, y: 0, z: 0 };
export const VECTOR3_RIGHT = { x: 1, y: 0, z: 0 };
export const VECTOR3_FORWARD = { x: 0, y: 0, z: 1 };
export const VECTOR3_BACK = { x: 0, y: 0, z: -1 };
export const VECTOR3_ONE = { x: 1, y: 1, z: 1 };
export const VECTOR3_ZERO = { x: 0, y: 0, z: 0 };
export const VECTOR3_WEST = { x: -1, y: 0, z: 0 };
export const VECTOR3_EAST = { x: 1, y: 0, z: 0 };
export const VECTOR3_NORTH = { x: 0, y: 0, z: 1 };
export const VECTOR3_SOUTH = { x: 0, y: 0, z: -1 };
export const VECTOR3_HALF = { x: 0.5, y: 0.5, z: 0.5 };
export const VECTOR3_NEGATIVE_ONE = { x: -1, y: -1, z: -1 };

/**
 * Vector3 Helper Class
 *
 * @license MIT
 * @description Provides public static utility methods for working with 3D vectors (x,y,z coordinates)
 */
export class Vector3Helper {
  public x: number;
  public y: number;
  public z: number;

  /**
   * Creates a new Vector3Builder
   * @param first - Either x value or another vector
   * @param y - y value (if first is x)
   * @param z - z value (if first is x)
   */
  constructor(first: number | { x: number; y: number; z: number }, y?: number, z?: number) {
    if (typeof first === "object") {
      this.x = first.x;
      this.y = first.y;
      this.z = first.z;
    } else {
      this.x = first;
      this.y = y ?? 0;
      this.z = z ?? 0;
    }
  }

  /**
   * Assigns values from another vector
   * @param vec - Source vector
   * @returns This instance for chaining
   */
  public assign(vec: { x: number; y: number; z: number }): this {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    return this;
  }

  /**
   * Checks equality with another vector
   * @param v - Vector to compare
   * @returns True if equal
   */
  public equals(v: { x: number; y: number; z: number }): boolean {
    return Vector3Helper.equals(this, v);
  }

  /**
   * Adds another vector to this one
   * @param v - Vector to add
   * @returns This instance for chaining
   */
  public add(v: { x?: number; y?: number; z?: number }): this {
    return this.assign(Vector3Helper.add(this, v));
  }

  /**
   * Subtracts another vector from this one
   * @param v - Vector to subtract
   * @returns This instance for chaining
   */
  public subtract(v: { x?: number; y?: number; z?: number }): this {
    return this.assign(Vector3Helper.subtract(this, v));
  }

  /**
   * Scales this vector by a factor
   * @param val - Scaling factor
   * @returns This instance for chaining
   */
  public scale(val: number): this {
    return this.assign(Vector3Helper.scale(this, val));
  }

  /**
   * Calculates dot product with another vector
   * @param vec - Other vector
   * @returns Dot product result
   */
  public dot(vec: { x: number; y: number; z: number }): number {
    return Vector3Helper.dot(this, vec);
  }

  /**
   * Calculates cross product with another vector
   * @param vec - Other vector
   * @returns This instance for chaining
   */
  public cross(vec: { x: number; y: number; z: number }): this {
    return this.assign(Vector3Helper.cross(this, vec));
  }

  /**
   * Calculates vector magnitude
   * @returns Magnitude value
   */
  public magnitude(): number {
    return Vector3Helper.magnitude(this);
  }

  /**
   * Calculates distance to another vector
   * @param vec - Other vector
   * @returns Distance value
   */
  public distance(vec: { x: number; y: number; z: number }): number {
    return Vector3Helper.distance(this, vec);
  }

  /**
   * Normalizes this vector to unit length
   * @returns This instance for chaining
   */
  public normalize(): this {
    return this.assign(Vector3Helper.normalize(this));
  }

  /**
   * Floors all components of this vector
   * @returns This instance for chaining
   */
  public floor(): this {
    return this.assign(Vector3Helper.floor(this));
  }

  /**
   * Creates string representation
   * @param options - Formatting options
   * @returns Formatted string
   */
  public toString(options?: { decimals?: number; delimiter?: string }): string {
    return Vector3Helper.toString(this, options);
  }

  /**
   * Clamps vector components between limits
   * @param limits - Min/max boundaries
   * @returns This instance for chaining
   */
  public clamp(limits?: {
    min?: { x?: number; y?: number; z?: number };
    max?: { x?: number; y?: number; z?: number };
  }): this {
    return this.assign(Vector3Helper.clamp(this, limits));
  }

  /**
   * Performs linear interpolation with another vector
   * @param vec - Target vector
   * @param t - Interpolation factor
   * @returns This instance for chaining
   */
  public lerp(vec: { x: number; y: number; z: number }, t: number): this {
    return this.assign(Vector3Helper.lerp(this, vec, t));
  }

  /**
   * Performs spherical interpolation with another vector
   * @param vec - Target vector
   * @param t - Interpolation factor
   * @returns This instance for chaining
   */
  public slerp(vec: { x: number; y: number; z: number }, t: number): this {
    return this.assign(Vector3Helper.slerp(this, vec, t));
  }

  /**
   * Multiplies with another vector component-wise
   * @param vec - Other vector
   * @returns This instance for chaining
   */
  public multiply(vec: { x: number; y: number; z: number }): this {
    return this.assign(Vector3Helper.multiply(this, vec));
  }

  /**
   * Rotates around X axis
   * @param a - Angle in radians
   * @returns This instance for chaining
   */
  public rotateX(a: number): this {
    return this.assign(Vector3Helper.rotateX(this, a));
  }

  /**
   * Rotates around Y axis
   * @param a - Angle in radians
   * @returns This instance for chaining
   */
  public rotateY(a: number): this {
    return this.assign(Vector3Helper.rotateY(this, a));
  }

  /**
   * Rotates around Z axis
   * @param a - Angle in radians
   * @returns This instance for chaining
   */
  public rotateZ(a: number): this {
    return this.assign(Vector3Helper.rotateZ(this, a));
  }

  /**
   * Checks if two vectors are exactly equal
   * @param v1 - First vector
   * @param v2 - Second vector
   * @returns True if all components are equal
   */
  public static equals(
    v1: { x: number; y: number; z: number },
    v2: { x: number; y: number; z: number },
  ): boolean {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
  }

  /**
   * Adds two vectors component-wise
   * @param v1 - First vector
   * @param v2 - Second vector (null components treated as 0)
   * @returns New vector result
   */
  public static add(
    v1: { x: number; y: number; z: number },
    v2: { x?: number; y?: number; z?: number },
  ): { x: number; y: number; z: number } {
    return {
      x: v1.x + (v2.x ?? 0),
      y: v1.y + (v2.y ?? 0),
      z: v1.z + (v2.z ?? 0),
    };
  }

  /**
   * Subtracts two vectors component-wise (v1 - v2)
   * @param v1 - First vector
   * @param v2 - Second vector (null components treated as 0)
   * @returns New vector result
   */
  public static subtract(
    v1: { x: number; y: number; z: number },
    v2: { x?: number; y?: number; z?: number },
  ): { x: number; y: number; z: number } {
    return {
      x: v1.x - (v2.x ?? 0),
      y: v1.y - (v2.y ?? 0),
      z: v1.z - (v2.z ?? 0),
    };
  }

  /**
   * Scales a vector by a scalar value
   * @param v1 - Vector to scale
   * @param scale - Scaling factor
   * @returns New scaled vector
   */
  public static scale(
    v1: { x: number; y: number; z: number },
    scale: number,
  ): { x: number; y: number; z: number } {
    return {
      x: v1.x * scale,
      y: v1.y * scale,
      z: v1.z * scale,
    };
  }

  /**
   * Calculates the dot product of two vectors
   * @param a - First vector
   * @param b - Second vector
   * @returns Dot product result
   */
  public static dot(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
  ): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * Calculates the cross product of two vectors
   * @param a - First vector
   * @param b - Second vector
   * @returns New vector result
   */
  public static cross(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
  ): { x: number; y: number; z: number } {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    };
  }

  /**
   * Calculates the magnitude (length) of a vector
   * @param v - Input vector
   * @returns Magnitude value
   */
  public static magnitude(v: { x: number; y: number; z: number }): number {
    return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  }

  /**
   * Calculates the distance between two vectors
   * @param a - First vector
   * @param b - Second vector
   * @returns Distance between vectors
   */
  public static distance(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
  ): number {
    return Vector3Helper.magnitude(Vector3Helper.subtract(a, b));
  }

  /**
   * Normalizes a vector to unit length
   * @param v - Vector to normalize
   * @returns New normalized vector
   */
  public static normalize(v: { x: number; y: number; z: number }): {
    x: number;
    y: number;
    z: number;
  } {
    const mag = Vector3Helper.magnitude(v);
    return {
      x: v.x / mag,
      y: v.y / mag,
      z: v.z / mag,
    };
  }

  /**
   * Floors each component of a vector
   * @param v - Input vector
   * @returns New vector with floored components
   */
  public static floor(v: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
    return {
      x: Math.floor(v.x),
      y: Math.floor(v.y),
      z: Math.floor(v.z),
    };
  }

  /**
   * Creates a string representation of a vector
   * @param v - Vector to format
   * @param options - Formatting options
   * @param options.decimals - Number of decimal places (default: 2)
   * @param options.delimiter - Separator between components (default: ", ")
   * @returns Formatted string
   */
  public static toString(
    v: { x: number; y: number; z: number },
    options?: { decimals?: number; delimiter?: string },
  ): string {
    const decimals = options?.decimals ?? 2;
    const str = [v.x.toFixed(decimals), v.y.toFixed(decimals), v.z.toFixed(decimals)];
    return str.join(options?.delimiter ?? ", ");
  }

  /**
   * Clamps vector components between min/max limits
   * @param v - Vector to clamp
   * @param limits - Min/max boundaries
   * @returns New clamped vector
   */
  public static clamp(
    v: { x: number; y: number; z: number },
    limits?: {
      min?: { x?: number; y?: number; z?: number };
      max?: { x?: number; y?: number; z?: number };
    },
  ): { x: number; y: number; z: number } {
    return {
      x: MathHelper.clampNumber(
        v.x,
        limits?.min?.x ?? Number.MIN_SAFE_INTEGER,
        limits?.max?.x ?? Number.MAX_SAFE_INTEGER,
      ),
      y: MathHelper.clampNumber(
        v.y,
        limits?.min?.y ?? Number.MIN_SAFE_INTEGER,
        limits?.max?.y ?? Number.MAX_SAFE_INTEGER,
      ),
      z: MathHelper.clampNumber(
        v.z,
        limits?.min?.z ?? Number.MIN_SAFE_INTEGER,
        limits?.max?.z ?? Number.MAX_SAFE_INTEGER,
      ),
    };
  }

  /**
   * Performs linear interpolation between two vectors
   * @param a - Starting vector
   * @param b - Ending vector
   * @param t - Interpolation factor (0-1)
   * @returns New interpolated vector
   */
  public static lerp(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
    t: number,
  ): { x: number; y: number; z: number } {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      z: a.z + (b.z - a.z) * t,
    };
  }

  /**
   * Performs spherical linear interpolation between two vectors
   * @param a - Starting vector
   * @param b - Ending vector
   * @param t - Interpolation factor (0-1)
   * @returns New interpolated vector
   */
  public static slerp(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
    t: number,
  ): { x: number; y: number; z: number } {
    const theta = Math.acos(Vector3Helper.dot(a, b));
    const sinTheta = Math.sin(theta);
    const ta = Math.sin((1 - t) * theta) / sinTheta;
    const tb = Math.sin(t * theta) / sinTheta;
    return Vector3Helper.add(Vector3Helper.scale(a, ta), Vector3Helper.scale(b, tb));
  }

  /**
   * Multiplies two vectors component-wise
   * @param a - First vector
   * @param b - Second vector
   * @returns New vector result
   */
  public static multiply(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
  ): { x: number; y: number; z: number } {
    return {
      x: a.x * b.x,
      y: a.y * b.y,
      z: a.z * b.z,
    };
  }

  /**
   * Rotates a vector around the X axis
   * @param v - Vector to rotate
   * @param a - Angle in radians
   * @returns New rotated vector
   */
  public static rotateX(
    v: { x: number; y: number; z: number },
    a: number,
  ): { x: number; y: number; z: number } {
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    return {
      x: v.x,
      y: v.y * cos - v.z * sin,
      z: v.z * cos + v.y * sin,
    };
  }

  /**
   * Rotates a vector around the Y axis
   * @param v - Vector to rotate
   * @param a - Angle in radians
   * @returns New rotated vector
   */
  public static rotateY(
    v: { x: number; y: number; z: number },
    a: number,
  ): { x: number; y: number; z: number } {
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    return {
      x: v.x * cos + v.z * sin,
      y: v.y,
      z: v.z * cos - v.x * sin,
    };
  }

  /**
   * Rotates a vector around the Z axis
   * @param v - Vector to rotate
   * @param a - Angle in radians
   * @returns New rotated vector
   */
  public static rotateZ(
    v: { x: number; y: number; z: number },
    a: number,
  ): { x: number; y: number; z: number } {
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    return {
      x: v.x * cos - v.y * sin,
      y: v.y * cos + v.x * sin,
      z: v.z,
    };
  }
}

/**
 * Vector2 Helper Class
 *
 * @license MIT
 * @description Provides public static utility methods for working with 2D vectors (x,y coordinates)
 */
export class Vector2Helper {
  public x: number;
  public y: number;

  /**
   * Creates a new Vector2Builder
   * @param first - Either x value or another vector
   * @param y - y value (if first is x)
   */
  constructor(first: number | { x: number; y: number }, y?: number) {
    if (typeof first === "object") {
      this.x = first.x;
      this.y = first.y;
    } else {
      this.x = first;
      this.y = y ?? 0;
    }
  }

  /**
   * Creates string representation
   * @param options - Formatting options
   * @returns Formatted string
   */
  toString(options?: { decimals?: number; delimiter?: string }): string {
    return Vector2Helper.toString(this, options);
  }

  /**
   * Creates a string representation of a vector
   * @param v - Vector to format
   * @param options - Formatting options
   * @param options.decimals - Number of decimal places (default: 2)
   * @param options.delimiter - Separator between components (default: ", ")
   * @returns Formatted string
   */
  public static toString(
    v: { x: number; y: number },
    options?: { decimals?: number; delimiter?: string },
  ): string {
    const decimals = options?.decimals ?? 2;
    const str = [v.x.toFixed(decimals), v.y.toFixed(decimals)];
    return str.join(options?.delimiter ?? ", ");
  }
}
