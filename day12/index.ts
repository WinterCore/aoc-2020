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

function getPositionP1(instructions: Instruction[]): Position {
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

function arrayIndexWrap(length: number, n: number) {
    if (n >= 0)
        return n % length;
    else
        return ((n % 4) + 4) % 4;
}

function rotatePosition(position: Position, dir: 'L' | 'R', val: number): Position {
    const newPosition = { ...position };
    const positions: ('north' | 'east' | 'south' | 'west')[] = ['north', 'east', 'south', 'west'];

    const change = dir === 'L' ? -(val / 90) : val / 90;
    newPosition[positions[arrayIndexWrap(positions.length, change)]] = position.north;
    newPosition[positions[arrayIndexWrap(positions.length, change + 1)]] = position.east;
    newPosition[positions[arrayIndexWrap(positions.length, change + 2)]] = position.south;
    newPosition[positions[arrayIndexWrap(positions.length, change + 3)]] = position.west;

    return newPosition;
}

function getPositionP2(instructions: Instruction[]): Position {
    const position: Position = {
        north : 0,
        south : 0,
        east  : 0,
        west  : 0,
        dir   : 'E',
    };
    let waypoint: Position = {
        north : 1,
        south : 0,
        east  : 10,
        west  : 0,
        dir   : 'E',
    };

    for (let [type, val] of instructions) {
        switch (type) {
        case 'R':
        case 'L':
            waypoint = rotatePosition(waypoint, type, val);
            break;
        case 'F':
            position.north += waypoint.north * val;
            position.south += waypoint.south * val;
            position.east  += waypoint.east * val;
            position.west  += waypoint.west * val;
            break;
        default:
            move(waypoint, type, val);
            break;
        }
    }

    return position;
}

function part2(data: Instruction[]): string {
    const pos = getPositionP2(data);
    const manhattanDistance = Math.abs(pos.north - pos.south) + Math.abs(pos.east - pos.west);

    return `Part 2 answer = ${manhattanDistance}`;
}

function part1(data: Instruction[]): string {

    const pos = getPositionP1(data);
    const manhattanDistance = Math.abs(pos.north - pos.south) + Math.abs(pos.east - pos.west);

    return `Part 1 answer = ${manhattanDistance}`;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n').map(x => [x[0], +x.slice(1)]) as Instruction[];

    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
