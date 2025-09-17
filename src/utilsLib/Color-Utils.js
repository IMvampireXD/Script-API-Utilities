const SECTION_SIGN = "§"

// detail: https://minecraft.fandom.com/wiki/Formatting_codes
const colorCodes = {
    black: "0",
    darkBlue: "1",
    darkGreen: "2",
    darkAqua: "3",
    darkRed: "4",
    darkPurple: "5",
    gold: "6",
    gray: "7",
    darkGray: "8",
    blue: "9",
    green: "a",
    aqua: "b",
    red: "c",
    lightPurple: "d",
    yellow: "e",
    white: "f",
    minecoinGold: "g",
    materialQuartz: "h",
    materialIron: "i",
    materialNetherite: "j",
    obfuscated: "k",
    bold: "l",
    materialRedstone: "m",
    materialCopper: "n",
    italic: "o",
    materialGold: "p",
    materialEmerald: "q",
    reset: "r",
    materialDiamond: "s",
    materialLapis: "t",
    materialAmethyst: "u"
}

for (const key in colorCodes) {
    const _key = key
    colorCodes[_key] = SECTION_SIGN + colorCodes[_key]
}

function createStylizer(extend) {
    const handlerColor = (...args) => [...extend, ...args].join("")

    const proxy = new Proxy(handlerColor, {
        get(target, key, receiver) {
            const _key = key
            const code = colorCodes[_key]

            if (code) return createStylizer([...extend, code])

            return Reflect.get(target, key, receiver)
        }
    })

    return proxy
}

/**
 * Text color
 * @example
 * ```js
 * color.green.italic.bold('Dedicated Ser') + color.reset('ver') + color.red.obfuscated('!!!')
 * // => '§a§o§lDedicated Ser§rver§c§k!!!'
 *
 * color.green.italic.bold('Dedicated Ser', color.reset('ver'), color.red.obfuscated('!!!'))
 * // => '§a§o§lDedicated Ser§rver§c§k!!!'
 * ```
 */
export const color = /*#__PURE__*/ createStylizer([])
