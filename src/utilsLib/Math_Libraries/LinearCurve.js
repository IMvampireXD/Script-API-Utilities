export class LinearCurve {
    constructor(values) {
        this.values = values;
    }
    get(input) {
        let key_pre = null;
        let key_post = null;
        for (let key_s in this.values) {
            let key = parseInt(key_s);
            if (key <= input) {
                key_pre = key;
            }
            if (key > input && key_post === null) {
                key_post = key;
                break;
            }
        }
        if (key_pre === null || key_post === null)
            return 0;
        let val_pre = this.values[key_pre];
        let val_post = this.values[key_post];
        let blend_val = (input - key_pre) / (key_post - key_pre);
        return val_pre + (val_post - val_pre) * blend_val;
    }
}
//# sourceMappingURL=linear_curve.js.map
