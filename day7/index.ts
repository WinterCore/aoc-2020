type BagContents = [string, number][];
type Bag = string;
type BagRecord = Record<Bag, BagContents>;

function parseRecord(str: string): [Bag, BagContents] {
    const [bagStr, rest] = str.split('contain');
    const bag = bagStr.slice(0, bagStr.indexOf('bags') - 1);

    if (rest === ' no other bags.') {
        return [bag, []];
    }

    const contentsStr = rest.split(', ');
    const contents: [string, number][] = [];

    for (let item of contentsStr) {
        const words = item.trim().split(' ').slice(0, -1);
        const count = +words[0];
        const bag   = words.slice(1).join(' ');
        contents.push([bag, count]);
    }

    return [bag, contents];
}

function countNestedBagsOfType(tree: BagRecord, parent: string, child: string): number {
    const targetBag = tree[parent].find(([name]) => name === child);
    if (targetBag) {
        return targetBag[1];
    }

    return tree[parent].reduce((acc, x) => acc + countNestedBagsOfType(tree, x[0], child) * x[1], 0);
}

function countNestedBags(tree: BagRecord, parent: string): number {
    return tree[parent].reduce((acc, x) => acc + countNestedBags(tree, x[0]) * x[1] + x[1], 0);
}

function part1(bagRecords: BagRecord): string {
    let count: number = 0;
    for (let [bag] of Object.entries(bagRecords)) {
        if (countNestedBagsOfType(bagRecords, bag, 'shiny gold') > 0) {
            count += 1;
        }
    }
    return `Part 1 answer = ${count}`;
}

function part2(bagRecords: BagRecord): string {
    let count: number = countNestedBags(bagRecords, 'shiny gold');

    return `Part 2 answer = ${count}`;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');
    const hash: BagRecord = {};

    for (let line of data) {
        const [bag, contents] = parseRecord(line);
        hash[bag] = contents;
    }

    return [part1(hash), part2(hash)].join('\n');
}


main()
    .then(console.log)
    .catch(console.log);
