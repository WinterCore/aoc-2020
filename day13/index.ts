
// Thanks Ryan Palo ref: https://dev.to/rpalo/comment/196bh
function part2(time: number, rawBusses: number[]): string {
    const busses = rawBusses
        .map((bus, i) => [bus, i])
        .filter(([bus]) => bus >= 0);

    let step = busses[0][0];
    let searchIdx = 1;
    let answer = -1;

    for (let i = step; true; i += step) {
        let success = true;
        for (let j = 0; j <= searchIdx; j += 1) {
            if ((i + busses[j][1]) % busses[j][0] !== 0) {
                success = false;
                break;
            }
        }
        if (success && searchIdx === busses.length - 1) {
            answer = i;
            break;
        }
        if (success) {
            step *= busses[searchIdx][0];
            searchIdx += 1;
        }
    }

    return `Part 2 answer = ${answer}`;
}

function part1(time: number, busses: number[]): string {
    const remainders = busses.filter(x => x >= 0).map(bus => [bus, (Math.ceil(time / bus) * bus) % time]);

    const [bus, mins] = remainders.reduce((acc, x) => acc[1] > x[1] ? x : acc, [0, Number.MAX_SAFE_INTEGER]);

    return `Part 1 answer = ${bus * mins}`;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');
    const time = +data[0];
    const busses = data[1].split(',').map(x => x === 'x' ? -1 : +x);

    return [part1(time, busses), part2(time, busses)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
