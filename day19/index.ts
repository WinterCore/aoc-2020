type Rule = string | number[][];
type NKeyObj<T> = { [key: number]: T };
type Stream = {
    rules: NKeyObj<Rule>;
    messages: string[];
};

function arrProduct<T>(arr1: T[], arr2: T[]): T[][] {
    if (arr1.length === 0) return arr2.map(x => [x]);
    if (arr2.length === 0) return arr1.map(x => [x]);

    let result: T[][] = [];
    for (let item1 of arr1) {
        for (let item2 of arr2) {
            result.push([item1, item2]);
        }
    }

    return result;
}

function buildRef(rules: NKeyObj<Rule>, key: number, cache: NKeyObj<string[]> = {}): string[] {
    if (typeof rules[key] === 'string') return [rules[key] as string];

    cache[key] = (rules[key] as number[][]).map(refs =>
        refs.reduce((a, b) =>
            arrProduct(a, buildRef(rules, b, cache)).map(x => x.join(''), [])
            , [] as string[]
        )
    ).flat();

    return cache[key];
}

function part1(lines: string[]): string {
    const stream: Stream = parse(lines);

    const optionsSet = new Set(buildRef(stream.rules, 0));

    const result: number = stream.messages.reduce((r, x) => optionsSet.has(x) ? r + 1 : r, 0);

    return `Part 1 answer = ${result}`;
}

function part2(lines: string[]): string {
    return `Part 2 answer = ${0}`;
}


function parse(lines: string[]): Stream {
    const stream: Stream = { rules: {}, messages: [] };

    let i = 0;
    do {
        const [key, val] = lines[i].split(': ');
        stream.rules[+key] = val.startsWith('"')
            ? val.slice(1, -1)
            : val.split(' | ').map(x => x.split(' ').map(y => +y));
    } while (lines[++i].length);

    i += 1;

    stream.messages = lines.slice(i);

    return stream;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');

    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
