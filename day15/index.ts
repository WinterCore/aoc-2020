function part2(lines: string[]): string {
    const { pos, nums } = parse(lines);

    return `Part 2 answer = ${getNthSpoken(nums, pos)}`;
}

function getNthSpoken(nums: number[], n: number) {
    const cache: Map<number, number> = new Map();
    const l = nums.length;

    for (let i = 0; i < nums.length - 1; i += 1) {
        cache.set(nums[i], i);
    }

    let last: { num: number, i: number } = { num: nums[l - 1], i: l - 1 };

    for (let i = l; i < n; i += 1) {
        let tempLast = { ...last };
        let cVal = cache.get(last.num);
        last = { i, num: (cVal !== undefined ? last.i - cVal : 0) };
        cache.set(tempLast.num, tempLast.i);
    }

    return last.num;
}

function part1(lines: string[]): string {
    const { pos, nums } = parse(lines);

    return `Part 1 answer = ${getNthSpoken(nums, pos)}`;
}

function parse(lines: string[]): { pos: number, nums: number[] } {
    return {
        pos: +lines[0].trim(),
        nums: lines[1].trim().split(',').map(x => +x)
    };
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');

    // Part 1 and part 2 are the same
    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
