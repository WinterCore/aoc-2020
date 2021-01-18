type Validator = { min: number; max: number; };
type Data = {
    validators    : Map<string, Validator[]>;
    myTicket      : number[];
    nearbyTickets : number[][];
};

function validate(num: number, validator: Validator[]) {
    return validator.some(({ min, max }) => num >= min && num <= max);
}

function part2(lines: string[]): string {
    const data = parse(lines);

    const validators = Array.from(data.validators.values());

    const filteredTickets = data.nearbyTickets.filter((ticket) => (
        !ticket.some(num => validators.every(vv => !validate(num, vv)))
    ));

    const entries = Array.from(data.validators.entries());
    let columnMappings: { [key: number]: string[] } = {};
    for (let i = 0; i < entries.length; i += 1) {
        const [validatorName, validator] = entries[i];
        for (let j = 0; j < entries.length; j += 1) {
            // if (columnMappings.has(j)) // If the appropriate field has been found for this position, then skip
            //    continue;
            if (filteredTickets.every(ticket => validate(ticket[j], validator))) {
                // console.log(validatorName, j);
                columnMappings[j] = columnMappings[j] ? columnMappings[j].concat([validatorName]) : [validatorName];
            }
        }
    }

    const finalMappings: Map<number, string> = new Map();

    // Assign columns
    // This shit is a disaster
    while (Object.keys(columnMappings).length) {
        for (let [key, value] of Object.entries(columnMappings)) {
            for (let column of value) {
                let count = 0;
                for (let [curKey, curValue] of Object.entries(columnMappings)) {
                    if (key === curKey) continue;
                    if (curValue.indexOf(column) > -1)
                        count += 1;
                }
                if (count === 0) {
                    finalMappings.set(+key, column);
                    delete columnMappings[+key];
                }
            }
        }
    }

    const result = Array
        .from(finalMappings.entries())
        .reduce((res, [i, name]) => name.startsWith('departure') ? data.myTicket[i] * res : res, 1);

    return `Part 2 answer = ${result}`;
}

function part1(lines: string[]): string {
    const data = parse(lines);

    let invalidSum = 0;

    for (let ticket of data.nearbyTickets) {
        const validators = Array.from(data.validators.values());
        invalidSum += ticket.reduce((sum, num) => (
            validators.every(vv => !validate(num, vv))
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
