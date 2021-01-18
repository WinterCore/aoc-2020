type Validator = { min: number; max: number; };
type Data = {
    validators    : Map<string, Validator[]>;
    myTicket      : number[];
    nearbyTickets : number[][];
};

function part2(lines: string[]): string {

    return `Part 2 answer = ${0}`;
}

function part1(lines: string[]): string {
    const data = parse(lines);

    let invalidSum = 0;

    for (let ticket of data.nearbyTickets) {
        const validators = Array.from(data.validators.values());
        invalidSum += ticket.reduce((sum, num) => (
            validators.every((vv) => vv.every(({ min, max }) => num < min || num > max))
                ? sum + num
                : sum
        ), 0);
    }

    return `Part 1 answer = ${invalidSum}`;
}

function parse(lines: string[]): Data {
    let i = 0;
    let validators: Map<string, Validator[]> = new Map();

    while (lines[i] !== '') {
        let [key, values] = lines[i].split(':');
        let currValidators: Validator[] = [];

        let validatorsStrings = values.split('or');

        for (let validatorString of validatorsStrings) {
            let [min, max] = validatorString.trim().split('-');
            currValidators.push({ min: +min, max: +max });
        }

        validators.set(key.trim(), currValidators);
        i += 1;
    }

    i += 2; // Skip the line containing "your ticket:"

    let myTicket = lines[i].split(',').map(x => +x);

    i += 3; // Skip the line containing "nearby tickets:"

    let nearbyTickets: number[][] = [];

    while (i < lines.length)
        nearbyTickets.push(lines[i++].split(',').map(x => +x));

    return {
        myTicket,
        nearbyTickets,
        validators
    };
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');

    // Part 1 and part 2 are the same
    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
