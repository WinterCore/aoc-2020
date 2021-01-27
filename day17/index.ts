type Cell = boolean;
type Dimension1D = Cell[];
type Dimension2D = Dimension1D[];
type Dimension3D = Dimension2D[];
type Dimension4D = Dimension3D[];

function countActiveNeighbors4D(dimension: Dimension4D, w: number, z: number, y: number, x: number): number {
    let active = 0;

    for (let wi = -1; wi <= 1; wi += 1) {
        for (let zi = -1; zi <= 1; zi += 1) {
            for (let yi = -1; yi <= 1; yi += 1) {
                for (let xi = -1; xi <= 1; xi += 1) {
                    let cw = w + wi, cz = z + zi, cy = y + yi, cx = x + xi;
                    if (
                        (zi !== 0 || yi !== 0 || xi !== 0 || wi !== 0)
                        && (cw >= 0 && cw < dimension.length)
                        && (cz >= 0 && cz < dimension[cw].length)
                        && (cy >= 0 && cy < dimension[cw][cz].length)
                        && (cx >= 0 && cx < dimension[cw][cz][cy].length)
                        && dimension[cw][cz][cy][cx]
                    ) {
                        active += 1;
                    }
                }
            }
        }
    }
    return active;
}

function getNextCycle4D(dimension: Dimension4D): Dimension4D {
    const newDimension: Dimension4D = []
    const mw = dimension.length,
        mz = dimension[0].length,
        my = dimension[0][0].length,
        mx = dimension[0][0][0].length;

    for (let w = -1; w <= mw; w += 1) {
        let zs: Dimension3D = [];
        for (let z = -1; z <= mz; z += 1) {
            let ys: Dimension2D = [];
            for (let y = -1; y <= my; y += 1) {
                let xs: Dimension1D = [];
                for (let x = -1; x <= mx; x += 1) {
                    const activeCount = countActiveNeighbors4D(dimension, w, z, y, x);
                    if (
                        (w >= 0 && w < mw)
                        && (z >= 0 && z < mz)
                        && (y >= 0 && y < my)
                        && (x >= 0 && x < mx)
                        && dimension[w][z][y][x]
                    ) {
                        xs.push(activeCount === 2 || activeCount === 3);
                    } else {
                        xs.push(activeCount === 3);
                    }
                }
                ys.push(xs);
            }
            zs.push(ys);
        }
        newDimension.push(zs);
    }

    return newDimension;
}

function countActive4D(dimension: Dimension4D): number {
    let count = 0;

    for (let w = 0; w < dimension.length; w += 1) {
        for (let z = 0; z < dimension[w].length; z += 1) {
            for (let y = 0; y < dimension[w][z].length; y += 1) {
                for (let x = 0; x < dimension[w][z][y].length; x += 1) {
                    if (dimension[w][z][y][x])
                        count += 1;
                }
            }
        }
    }

    return count;
}

function countActiveNeighbors3D(dimension: Dimension3D, z: number, y: number, x: number): number {
    let active = 0;

    for (let zi = -1; zi <= 1; zi += 1) {
        for (let yi = -1; yi <= 1; yi += 1) {
            for (let xi = -1; xi <= 1; xi += 1) {
                let cz = z + zi, cy = y + yi, cx = x + xi;
                if (
                    (zi !== 0 || yi !== 0 || xi !== 0)
                    && (cz >= 0 && cz < dimension.length)
                    && (cy >= 0 && cy < dimension[cz].length)
                    && (cx >= 0 && cx < dimension[cz][cy].length)
                    && dimension[cz][cy][cx]
                ) {
                    active += 1;
                }
            }
        }
    }
    return active;
}

function getNextCycle3D(dimension: Dimension3D): Dimension3D {
    const newDimension: Dimension3D = []
    const mz = dimension.length, my = dimension[0].length, mx = dimension[0][0].length;

    for (let z = -1; z <= mz; z += 1) {
        let ys: Cell[][] = [];
        for (let y = -1; y <= my; y += 1) {
            let xs: Cell[] = [];
            for (let x = -1; x <= mx; x += 1) {
                const activeCount = countActiveNeighbors3D(dimension, z, y, x);
                if (
                    (z >= 0 && z < mz)
                    && (y >= 0 && y < my)
                    && (x >= 0 && x < mx)
                    && dimension[z][y][x]
                ) {
                    xs.push(activeCount === 2 || activeCount === 3);
                } else {
                    xs.push(activeCount === 3);
                }
            }
            ys.push(xs);
        }
        newDimension.push(ys);
    }

    return newDimension;
}

function countActive3D(dimension: Dimension3D): number {
    let count = 0;

    for (let z = 0; z < dimension.length; z += 1) {
        for (let y = 0; y < dimension[z].length; y += 1) {
            for (let x = 0; x < dimension[z][y].length; x += 1) {
                if (dimension[z][y][x])
                    count += 1;
            }
        }
    }

    return count;
}

function part1(lines: string[]): string {
    let dimension: Dimension3D = parse(lines);

    for (let i = 0; i < 6; i += 1) {
        dimension = getNextCycle3D(dimension);
    }

    return `Part 1 answer = ${countActive3D(dimension)}`;
}

function part2(lines: string[]): string {
    let dimension: Dimension4D = [parse(lines)];

    for (let i = 0; i < 6; i += 1) {
        dimension = getNextCycle4D(dimension);
    }

    return `Part 2 answer = ${countActive4D(dimension)}`;
}

function parse(lines: string[]): Dimension3D {
    let dimension: Dimension3D = [[]];

    for (let i = 0; i < lines.length; i += 1) {
        dimension[0].push(lines[i].split('').map(x => x === '#'));
    }

    return dimension;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');

    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
