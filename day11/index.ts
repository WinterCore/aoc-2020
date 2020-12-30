enum Seat {
    EMPTY = 'L',
    OCCUPIED = '#',
    FLOOR = '.',
};

type Point = [number, number];
type Stats = { occupied: number; empty: number; total: number; };

function advanceGeneration(data: Seat[][]) {
    const result: Seat[][] = [];
    for (let i = 0; i < data.length; i += 1) {
        result[i] = [];
        for (let j = 0; j < data[i].length; j += 1) {
            const seat = data[i][j];
            if (seat === Seat.FLOOR) {
                result[i][j] = data[i][j];
                continue;
            }
            let positions: Point[] = [
                [i - 1, j - 1], // top left
                [i - 1, j], // top
                [i - 1, j + 1], // top right
                [i, j + 1], // right
                [i + 1, j + 1], // bottom right
                [i + 1, j], // bottom
                [i + 1, j - 1], // bottom left
                [i, j - 1], // left
            ];
            const stats: Stats = positions
                .filter(([y, x]) => y >= 0 && x >= 0 && y < data.length && x < data[y].length)
                .reduce((acc, [y, x]) => {
                    const neighbor = data[y][x];
                    if (neighbor === Seat.FLOOR) return acc;
                    if (neighbor === Seat.OCCUPIED)
                        acc.occupied += 1;
                    else if (neighbor === Seat.EMPTY)
                        acc.empty += 1;
                    acc.total += 1;
                    return acc;
                }, { occupied: 0, empty: 0, total: 0 });

            if (seat === Seat.EMPTY && stats.occupied === 0)
                result[i][j] = Seat.OCCUPIED;
            else if (seat === Seat.OCCUPIED && stats.occupied >= 4)
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

function part2(foo: any): string {

    return `Part 2 answer = ${0}`;
}

function part1(data: Seat[][]): string {
    let prev: Seat[][] = data;
    let current: Seat[][] = advanceGeneration(data);
    while (!areIdentical(prev, current)) {
        prev = current;
        current = advanceGeneration(prev);
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
