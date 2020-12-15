type Instruction = [string, number];

function execute(instruction: Instruction): [number, number] {
    const [name, arg] = instruction;
    switch (name) {
        case 'nop':
            return [1, 0];
        case 'acc':
            return [1, arg];
        case 'jmp':
            return [arg, 0];
    }

    throw new Error("Unreachable");
}

function part1(instructions: Instruction[]): string {
    return `Part 1 answer = ${run(instructions).acc}`;
}

function run(instructions: Instruction[], i: number = 0, acc: number = 0): { trace: number[], acc: number, terminated: boolean } {
    const visited: Record<string, boolean> = {};
    let trace: number[] = [];

    while (!visited[i] && i < instructions.length) {
        visited[i] = true;
        const [ci, cacc] = execute(instructions[i]);
        trace.push(i);
        i     += ci;
        acc   += cacc;
    }

    trace.push(i);

    return {
        trace,
        acc,
        terminated: i >= instructions.length,
    };
}

function flip(inst: string) {
    if (inst === 'jmp') return 'nop';
    else if (inst === 'nop') return 'jmp';

    throw new Error(`unknown instruction ${inst}`);
}

function part2(insts: Instruction[]) {
    let output = run(insts);
    let i = output.trace.length - 1;

    while (i >= 0) {
        const current = output.trace[i];
        const instructions = [...insts];
        if (instructions[current][0] !== 'acc') {
            instructions[current] = [flip(instructions[current][0]), instructions[current][1]];
            let result = run(instructions);
            if (result.terminated) {
                return `Part 2 answer = ${result.acc}`;
            }
        }
        i -= 1;
    }

    throw new Error("Unreachable");
}

function parseInstruction(str: string): Instruction {
    const [instruction, arg] = str.split(' ');
    return [instruction, +arg];
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');

    const instructions: Instruction[] = data.map(parseInstruction);

    return [part1(instructions), part2(instructions)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
