// The solution was inspired by Tsoding https://www.youtube.com/watch?v=95ooXiwVeMM

type InstructionGroup = {
    mask        : string;
    assignments : [number, number][];
};

const xMask = (maskStr: string): bigint => (
    maskStr
        .split('')
        .reduce((mask, x) => x === 'X' ? (mask << 1n) | 1n : mask << 1n, 0n)
);

const onMask = (maskStr: string): bigint => (
    maskStr
        .split('')
        .reduce((mask, x) => x === '1' ? (mask << 1n) | 1n : mask << 1n, 0n)
);


const spreadMask = (mask: bigint, n: bigint): bigint => {
    let reversedResult = 0n;
    for (let i = 0; i < 36; i += 1) {
        reversedResult <<= 1n;
        if ((mask & 1n) === 1n) {
            reversedResult  |= (n & 1n);
            n              >>= 1n;
        }
        mask >>= 1n;
    }

    let result = 0n;

    for (let i = 0; i < 36; i += 1) {
        result         <<= 1n;
        result          |= (reversedResult & 1n);
        reversedResult >>= 1n;
    }

    return result;
};

const countOnBits = (n: bigint): number => {
    let result = 0;
    while (n > 0) {
        result += Number(n & 1n);
        n >>= 1n;
    }
    return result;
};

function part2(data: string[]): string {
    const groups = parse(data);

    const mem = new Map<number, number>();

    for (let group of groups) {
        let xm = xMask(group.mask);
        let onm = onMask(group.mask);

        for (let [addr, val] of group.assignments) {
            const max = 1 << countOnBits(xm);
            for (let i = 0; i < max; i += 1) {
                let modifiedAddr = Number((BigInt(addr) | onm) & (~xm) | spreadMask(xm, BigInt(i)));
                mem.set(modifiedAddr, val);
            }
        }
    }

    const sum = Array.from(mem.values()).reduce((a, b) => a + b, 0);

    return `Part 2 answer = ${sum}`;
}

function part1(data: string[]): string {
    const groups = parse(data);

    const mem: { [key: number]: number; } = {};

    for (let group of groups) {
        const xm = xMask(group.mask);
        const onm = onMask(group.mask);
        for (let [addr, val] of group.assignments) {
            mem[addr] = Number((BigInt(val) & xm) | onm);
        }
    }

    const sum = Object.values(mem).reduce((a, b) => a + b, 0);

    return `Part 1 answer = ${sum}`;
}

function parse(lines: string[]): InstructionGroup[] {
    let groups: InstructionGroup[] = [];
    let current: InstructionGroup;
    for (let line of lines) {
        if (line.startsWith('mask')) {
            current = { mask: line.split(' = ')[1], assignments: [] };
            groups.push(current);
        } else {
            let [, rest] = line.split('[');
            let [address, rest1] = rest.split(']');
            let value = rest1.slice(3);
            current!.assignments.push([+address, +value]);
        }
    }

    return groups;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');

    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
