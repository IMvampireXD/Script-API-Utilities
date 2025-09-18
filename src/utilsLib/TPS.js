import { system } from "@minecraft/server"

let delta = Date.now()

const TPS = []

system.runInterval(() => {
    const currentTPS = 1000 / (Date.now() - delta)

    if (TPS.length >= 100) TPS.shift()

    TPS.push(currentTPS)

    delta = Date.now()
})

function getAvgTPS(decimals = 2) {
    return (TPS.reduce((prev, current) => prev + current) / TPS.length).toFixed(decimals)
}

export { getAvgTPS }