type Direction = 'N' | 'S' | 'E' | 'W';
type InstructionType = Direction | 'L' | 'R' | 'F';
type Instruction = [InstructionType, number];
type Position = {
    north: number;
    south: number;
    east: number;
    west: number;
    dir: Direction;
};

function move(position: Position, dir: Direction, val: number): void {
    switch (dir) {
    case 'N':
        position.north += val;
        break;
    case 'S':
        position.south += val;
        break;
    case 'E':
        position.east += val;
        break;
    case 'W':
        position.west += val;
        break;
    }
}

function getPosition(instructions: Instruction[]): Position {
    let dirs: Direction[] = ['E', 'S', 'W', 'N'];
    let position: Position = {
        north : 0,
        south : 0,
        east  : 0,
        west  : 0,
        dir   : 'E'
    };

    for (let [type, val] of instructions) {
        switch (type) {
        case 'R':
            position.dir = dirs[(dirs.indexOf(position.dir) + val / 90) % 4]
            break;
        case 'L':
            position.dir = dirs[(((dirs.indexOf(position.dir) - val / 90) % 4) + 4) % 4]
            break;
        case 'F':
            move(position, position.dir, val);
            break;
        default:
            move(position, type, val);
            break;
        }
    }

    return position;
}

function part1(data: Instruction[]): string {

    const pos = getPosition(data);
    const manhattanDistance = Math.abs(pos.north - pos.south) + Math.abs(pos.east - pos.west);

    return `Part 1 answer = ${manhattanDistance}`;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n').map(x => [x[0], +x.slice(1)]) as Instruction[];

    return [part1(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
