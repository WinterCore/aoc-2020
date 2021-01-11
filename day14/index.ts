type InstructionGroup = {
    mask        : string;
    assignments : [number, number][];
};

function part2(data: string[]): string {
    const groups = parse(data);

    const mem = new Map<number, number>();

    for (let group of groups) {
        let mask = group.mask.split('');

        for (let [addr, val] of group.assignments) {
            let modifiedAddr = addr.toString(2).padStart(36, '0').split('').map((x, i) => {
                if (mask[i] === '1')
                    return '1';
                if (mask[i] === 'X')
                    return 'X';
                return x;
            });
            const floatingBitsIndices = modifiedAddr.map((x, i) => x === 'X' ? i : -1).filter(x => x >= 0);
            const nums = Array.from({ length: 1 << floatingBitsIndices.length }).map((_, i) => i);
            for (let num of nums) {
                let numBits = num.toString(2).padStart(nums[nums.length - 1].toString(2).length, '0').split('');
                let i = 0;
                let newAddr = modifiedAddr;
                for (let j of floatingBitsIndices) {
                    newAddr[j] = numBits[i];
                    i += 1;
                }
                mem.set(parseInt(newAddr.join(''), 2), val);
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
        let bits = group.mask
            .split('')
            .map((x, i) => x === 'X' ? [-1, -1] : [+x, group.mask.length - i - 1])
            .filter(x => x[0] !== -1);

        for (let [addr, val] of group.assignments) {
            let n = val.toString(2).split('');
            n = Array.from({ length: 36 - n.length }).map(_ => '0').concat(n)
            for (let [bit, i] of bits) {
                n[36 - i - 1] = bit.toString();
            }

            mem[addr] = parseInt(n.join(''), 2);
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
