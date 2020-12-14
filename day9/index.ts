const N = 25;

function part1(nums: number[]): string {
    for (let i = N; i < nums.length; i += 1) {
        let cache: Record<number, boolean> = {};
        for (let j = i - N; j < i; j += 1) {
            cache[nums[j]] = true;
        }
        let found = false;
        for (let j = i - N; j < i; j += 1) {
            if (cache[nums[i] - nums[j]]) {
                found = true;
            }
        }
        if (!found) return `Part 1 answer = ${nums[i]}`;
    }
    throw new Error("Unreachable");
}

function part2(nums: number[], invalid: number): string {

    for (let i = 0; i < nums.length; i += 1) {
        let result = 0;
        let found = [];
        for (let j = i; j < nums.length && result < invalid; j += 1) {
            result += nums[j];
            found.push(nums[j]);
        }
        if (result === invalid) {
            return `Part 2 answer = ${Math.min(...found) + Math.max(...found)}`;
        }
    }
    throw new Error("Unreachable");
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n').map(n => +n);


    return [part1(data), part2(data, 373803594)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
