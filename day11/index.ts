enum Seat {
    EMPTY = 'L',
    OCCUPIED = '#',
    FLOOR = '.',
};

type Point = [number, number];
type Stats = { occupied: number; };

function getNeighborsP1(y: number, x: number, set: Seat[][]): Stats {
    let h = set.length, w = set[0].length;
    let stats: Stats = { occupied: 0 };
    for (let i = -1; i < 2; i += 1) {
        for (let j = -1; j < 2; j += 1) {
            let cy = y + i, cx = x + j;
            if ((i !== 0 || j !== 0) && (cy >= 0 && cy < h && cx >= 0 && cx < w)) {
                let cell = set[cy][cx];
                if (cell === Seat.OCCUPIED)
                    stats.occupied += 1;
            }
        }
    }
    return stats;
}

function getNeighborsP2(y: number, x: number, set: Seat[][]): Stats {
    let h = set.length, w = set[0].length;
    let stats: Stats = { occupied: 0 };
    for (let i = -1; i < 2; i += 1) {
        for (let j = -1; j < 2; j += 1) {
            let cy = y + i, cx = x + j;
            if (i === 0 && j === 0) continue;
            while (cy >= 0 && cy < h && cx >= 0 && cx < w) {
                if (set[cy][cx] === Seat.OCCUPIED) {
                    stats.occupied += 1;
                    break;
                } else if (set[cy][cx] === Seat.EMPTY) {
                    break;
                } else {
                    cy += i;
                    cx += j;
                }
            }
        }
    }
    return stats;
}

function advanceGeneration(data: Seat[][], tolerance: number, getNeighbors: (y: number, x: number, set: Seat[][]) => Stats) {
    const result: Seat[][] = [];
    for (let i = 0; i < data.length; i += 1) {
        result[i] = [];
        for (let j = 0; j < data[i].length; j += 1) {
            const seat = data[i][j];
            if (seat === Seat.FLOOR) {
                result[i][j] = data[i][j];
                continue;
            }
            let stats: Stats = getNeighbors(i, j, data);

            if (seat === Seat.EMPTY && stats.occupied === 0)
                result[i][j] = Seat.OCCUPIED;
            else if (seat === Seat.OCCUPIED && stats.occupied >= tolerance)
                result[i][j] = Seat.EMPTY;
            else
                result[i][j] = data[i][j];
        }
    }
    return result;
}

function areIdentical(set1: Seat[][], set2: Seat[][]): boolean {
    for (let i = 0; i < set1.length; i += 1) {
        for (let j = 0; j < set1[i].length; j += 1) {
            if (set1[i][j] !== set2[i][j]) return false;
        }
    }
    return true;
}

function part2(data: Seat[][]): string {
    let prev: Seat[][] = data;
    let current: Seat[][] = advanceGeneration(data, 5, getNeighborsP2);
    while (!areIdentical(prev, current)) {
        prev = current;
        current = advanceGeneration(prev, 5, getNeighborsP2);
    }

    const occupied = current
        .map((row) => row.filter((x) => x === Seat.OCCUPIED).length)
        .reduce((a, b) => a + b, 0);

    return `Part 2 answer = ${occupied}`;
}

function part1(data: Seat[][]): string {
    let prev: Seat[][] = data;
    let current: Seat[][] = advanceGeneration(data, 4, getNeighborsP1);
    while (!areIdentical(prev, current)) {
        prev = current;
        current = advanceGeneration(prev, 4, getNeighborsP1);
    }

    const occupied = current
        .map((row) => row.filter((x) => x === Seat.OCCUPIED).length)
        .reduce((a, b) => a + b, 0);

    return `Part 1 answer = ${occupied}`;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n').map(x => x.split('')) as Seat[][];

    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
