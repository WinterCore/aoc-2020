// I couldn't solve this on my own cuz I'm a pepega.
// Ref: https://github.com/tsoding/aoc-2020/blob/master/10-c/main.c
function countArrangements(nums: number[]): number {
    nums.push(nums[nums.length - 1] + 3);
    let dp = [1];
    for (let i = 1; i < nums.length; i += 1) {
        dp[i] = 0;
        for (let j = i - 1; j >= 0 && nums[i] - nums[j] <= 3; j -= 1) {
            dp[i] += dp[j];
        }
    }
    return dp[nums.length - 1];
}


function part2(nums: number[]): string {
    const adapters = [0, ...nums].sort((a, b) => a - b);

    const result = countArrangements(adapters);

    return `Part 2 answer = ${result}`;
}

function part1(nums: number[]): string {
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
    const input = await Deno.readTextFile('exampleinput2');
    const data = input.trim().split('\n').map(n => +n);

    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
