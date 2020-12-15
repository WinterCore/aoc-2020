function part1(nums: number[]) {
    const adapters = [0, ...nums].sort((a, b) => a - b);
    let counts = {
        1: 0,
        2: 0,
        3: 1, // One because the device's adapter is always higher than the highest adapter by 3
    };

    for (let i = 1; i < adapters.length; i += 1) {
        const diff = adapters[i] - adapters[i - 1];
        if (diff === 1 || diff === 2 || diff === 3) {
            counts[diff] += 1;
        } else {
            throw new Error("Unreachable");
        }
    }

    return `Part 1 answer = ${counts[1] * counts[3]}`;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n').map(n => +n);

    return [part1(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
