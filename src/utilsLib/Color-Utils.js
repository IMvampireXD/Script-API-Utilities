
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Combinations of different RGB values, useful for setting colors in Particles with MolangVariableMap
////////////////////////////////////////////////////////////////////////////////////////////////////////

const ColorPalette = {
    // Red variations
    redLight: { red: 1.0, green: 0.6, blue: 0.6, alpha: 1.0 },
    red: { red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0 },
    redDark: { red: 0.6, green: 0.0, blue: 0.0, alpha: 1.0 },

    // Green variations
    greenLight: { red: 0.6, green: 1.0, blue: 0.6, alpha: 1.0 },
    green: { red: 0.0, green: 0.8, blue: 0.0, alpha: 1.0 },
    greenDark: { red: 0.0, green: 0.5, blue: 0.0, alpha: 1.0 },

    // Blue variations
    blueLight: { red: 0.6, green: 0.6, blue: 1.0, alpha: 1.0 },
    blue: { red: 0.0, green: 0.0, blue: 1.0, alpha: 1.0 },
    blueDark: { red: 0.0, green: 0.0, blue: 0.6, alpha: 1.0 },

    // Yellow variations
    yellowLight: { red: 1.0, green: 1.0, blue: 0.6, alpha: 1.0 },
    yellow: { red: 1.0, green: 1.0, blue: 0.0, alpha: 1.0 },
    yellowDark: { red: 0.7, green: 0.7, blue: 0.0, alpha: 1.0 },

    // Cyan variations
    cyanLight: { red: 0.6, green: 1.0, blue: 1.0, alpha: 1.0 },
    cyan: { red: 0.0, green: 1.0, blue: 1.0, alpha: 1.0 },
    cyanDark: { red: 0.0, green: 0.6, blue: 0.6, alpha: 1.0 },

    // Magenta variations
    magentaLight: { red: 1.0, green: 0.6, blue: 1.0, alpha: 1.0 },
    magenta: { red: 1.0, green: 0.0, blue: 1.0, alpha: 1.0 },
    magentaDark: { red: 0.6, green: 0.0, blue: 0.6, alpha: 1.0 },

    // Orange variations
    orangeLight: { red: 1.0, green: 0.8, blue: 0.5, alpha: 1.0 },
    orange: { red: 1.0, green: 0.65, blue: 0.0, alpha: 1.0 },
    orangeDark: { red: 0.7, green: 0.45, blue: 0.0, alpha: 1.0 },

    // Purple variations
    purpleLight: { red: 0.8, green: 0.4, blue: 0.8, alpha: 1.0 },
    purple: { red: 0.5, green: 0.0, blue: 0.5, alpha: 1.0 },
    purpleDark: { red: 0.35, green: 0.0, blue: 0.35, alpha: 1.0 },

    // Pink variations
    pinkLight: { red: 1.0, green: 0.85, blue: 0.9, alpha: 1.0 },
    pink: { red: 1.0, green: 0.75, blue: 0.8, alpha: 1.0 },
    pinkDark: { red: 0.7, green: 0.53, blue: 0.57, alpha: 1.0 },

    // Brown variations
    brownLight: { red: 0.83, green: 0.41, blue: 0.41, alpha: 1.0 },
    brown: { red: 0.65, green: 0.16, blue: 0.16, alpha: 1.0 },
    brownDark: { red: 0.45, green: 0.12, blue: 0.12, alpha: 1.0 },

    // Gray variations
    grayLight: { red: 0.75, green: 0.75, blue: 0.75, alpha: 1.0 },
    gray: { red: 0.5, green: 0.5, blue: 0.5, alpha: 1.0 },
    grayDark: { red: 0.35, green: 0.35, blue: 0.35, alpha: 1.0 },

    // Teal variations
    tealLight: { red: 0.5, green: 0.8, blue: 0.8, alpha: 1.0 },
    teal: { red: 0.0, green: 0.5, blue: 0.5, alpha: 1.0 },
    tealDark: { red: 0.0, green: 0.35, blue: 0.35, alpha: 1.0 },

    // Lime variations
    limeLight: { red: 0.8, green: 1.0, blue: 0.5, alpha: 1.0 },
    lime: { red: 0.5, green: 1.0, blue: 0.0, alpha: 1.0 },
    limeDark: { red: 0.35, green: 0.7, blue: 0.0, alpha: 1.0 },

    // Indigo variations
    indigoLight: { red: 0.58, green: 0.44, blue: 0.86, alpha: 1.0 },
    indigo: { red: 0.29, green: 0.0, blue: 0.51, alpha: 1.0 },
    indigoDark: { red: 0.2, green: 0.0, blue: 0.35, alpha: 1.0 },

    // Gold variations
    goldLight: { red: 1.0, green: 0.85, blue: 0.0, alpha: 1.0 },
    gold: { red: 0.83, green: 0.69, blue: 0.22, alpha: 1.0 },
    goldDark: { red: 0.58, green: 0.48, blue: 0.15, alpha: 1.0 },

    // Silver variations
    silverLight: { red: 0.9, green: 0.91, blue: 0.98, alpha: 1.0 },
    silver: { red: 0.75, green: 0.75, blue: 0.75, alpha: 1.0 },
    silverDark: { red: 0.55, green: 0.55, blue: 0.55, alpha: 1.0 },

    // Olive variations
    oliveLight: { red: 0.77, green: 0.70, blue: 0.30, alpha: 1.0 },
    olive: { red: 0.50, green: 0.50, blue: 0.0, alpha: 1.0 },
    oliveDark: { red: 0.35, green: 0.35, blue: 0.0, alpha: 1.0 },

    // Coral variations
    coralLight: { red: 1.0, green: 0.60, blue: 0.60, alpha: 1.0 },
    coral: { red: 1.0, green: 0.50, blue: 0.31, alpha: 1.0 },
    coralDark: { red: 0.70, green: 0.35, blue: 0.22, alpha: 1.0 },

    // Slate variations
    slateLight: { red: 0.69, green: 0.77, blue: 0.87, alpha: 1.0 },
    slate: { red: 0.44, green: 0.50, blue: 0.57, alpha: 1.0 },
    slateDark: { red: 0.31, green: 0.35, blue: 0.39, alpha: 1.0 },

    // Turquoise variations
    turquoiseLight: { red: 0.69, green: 0.93, blue: 0.93, alpha: 1.0 },
    turquoise: { red: 0.25, green: 0.88, blue: 0.82, alpha: 1.0 },
    turquoiseDark: { red: 0.18, green: 0.63, blue: 0.58, alpha: 1.0 },

    // Maroon variations
    maroonLight: { red: 0.8, green: 0.27, blue: 0.33, alpha: 1.0 },
    maroon: { red: 0.5, green: 0.0, blue: 0.0, alpha: 1.0 },
    maroonDark: { red: 0.35, green: 0.0, blue: 0.0, alpha: 1.0 },

    // Navy variations
    navyLight: { red: 0.69, green: 0.78, blue: 0.93, alpha: 1.0 },
    navy: { red: 0.0, green: 0.0, blue: 0.50, alpha: 1.0 },
    navyDark: { red: 0.0, green: 0.0, blue: 0.35, alpha: 1.0 },

    // Peach variations
    peachLight: { red: 1.0, green: 0.88, blue: 0.62, alpha: 1.0 },
    peach: { red: 1.0, green: 0.75, blue: 0.53, alpha: 1.0 },
    peachDark: { red: 0.7, green: 0.53, blue: 0.37, alpha: 1.0 },

    // Lavender variations
    lavenderLight: { red: 0.90, green: 0.90, blue: 0.98, alpha: 1.0 },
    lavender: { red: 0.71, green: 0.49, blue: 0.91, alpha: 1.0 },
    lavenderDark: { red: 0.50, green: 0.35, blue: 0.65, alpha: 1.0 },

    // Mint variations
    mintLight: { red: 0.75, green: 1.0, blue: 0.80, alpha: 1.0 },
    mint: { red: 0.50, green: 1.0, blue: 0.83, alpha: 1.0 },
    mintDark: { red: 0.35, green: 0.70, blue: 0.58, alpha: 1.0 },
};

export { ColorPalette };

////////////////////////////////////////////////////////////////////////////////////
// Chat Color utils for text styling in Minecraft
///////////////////////////////////////////////////////////////////////////////////

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
};

for (const key in colorCodes) {
    const _key = key;
    colorCodes[_key] = SECTION_SIGN + colorCodes[_key];
}

function createStylizer(extend) {
    const handlerColor = (...args) => [...extend, ...args].join("");

    const proxy = new Proxy(handlerColor, {
        get(target, key, receiver) {
            const _key = key;
            const code = colorCodes[_key];

            if (code) return createStylizer([...extend, code]);

            return Reflect.get(target, key, receiver);
        }
    });

    return proxy;
}

/**
 * Text color
 * @example
 * ```js
 * color.green.italic.bold('Dedicated Ser') + color.reset('ver') + color.red.obfuscated('!!!')
 * => '§a§o§lDedicated Ser§rver§c§k!!!'
 *
 * color.green.italic.bold('Dedicated Ser', color.reset('ver'), color.red.obfuscated('!!!'))
 * => '§a§o§lDedicated Ser§rver§c§k!!!'
 * ```
 */
const color = /*#__PURE__*/ createStylizer([]);

export { color }