function part2(lines: string[]): string {
    return `Part 2 answer = ${0}`;
}

function part1(lines: string[]): string {
    const { pos, nums } = parse(lines);
    const cache: { [key: number]: number }  = {};

    let last: { num: number, i: number } = { num: 0, i: -1 };

    for (let i = 0; i < nums.length; i += 1) {
        if (i !== nums.length - 1) cache[nums[i]] = i;
        last = { i, num: nums[i] };
    }


    for (let i = nums.length; i < pos; i += 1) {
        let tempLast = { ...last };
        last = { i, num: (cache[last.num] !== undefined ? last.i - cache[last.num] : 0) };
        cache[tempLast.num] = tempLast.i;
    }

    return `Part 1 answer = ${last.num}`;
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

    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
