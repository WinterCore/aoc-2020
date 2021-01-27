type Operator   = '+' | '*';
type Token      = number | Operator | '(' | ')';
type Expression = Token[];

type OperatorTable = {
    [key in Operator] ?: (a: number, b: number) => number;
}[];

type EvaluatorState = {
    expression: Expression;
    i: number;
};

abstract class Evaluator {
    private expression: Expression;
    private i: number = 0;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    get peek(): Token {
        return this.expression[this.i];
    }

    eval(): number {
        return this.level1();
    }

    advance(): Token {
        return this.expression[this.i++];
    }

    factor(): number {
        if (typeof this.peek === 'number') {
            return this.advance() as number;
        } else if (this.peek === '(') {
            this.advance(); // (
            let result = this.level1();
            this.advance(); // )
            return result;
        }

        throw new Error(`Unexpected token ${this.peek}`);
    }

    abstract level1(): number;
}

class Evaluator1 extends Evaluator {
    level1(): number {
        let result = this.factor();
        while (this.peek === '+' || this.peek === '*') {
            if (this.advance() === '+')
                result += this.factor();
            else
                result *= this.factor();
        }
        return result;
    }
}

class Evaluator2 extends Evaluator {
    level2(): number { // Highest precedence (Level 2)
        let result = this.factor();
        while (this.peek === '+') {
            this.advance();
            result += this.factor();
        }
        return result;
    }

    level1(): number { // Second highest precedence (Level 1)
        let result = this.level2();
        while (this.peek === '*') {
            this.advance();
            result *= this.level2();
        }
        return result;
    }
}

function part1(lines: string[]): string {
    const expressions: Expression[] = parse(lines);
    let results: number[] = [];

    for (let expression of expressions) {
        results.push((new Evaluator1(expression)).eval());
    }

    return `Part 1 answer = ${results.reduce((a, b) => a + b, 0)}`;
}

function part2(lines: string[]): string {
    const expressions: Expression[] = parse(lines);
    let results: number[] = [];

    for (let expression of expressions) {
        results.push((new Evaluator2(expression)).eval());
    }

    return `Part 2 answer = ${results.reduce((a, b) => a + b, 0)}`;
}

function isNumeric(c: string): boolean {
    return c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0);
}

function parse(lines: string[]): Expression[] {
    let expressions: Expression[] = [];

    for (let [ix, line] of lines.entries()) {
        let tokens: Token[] = [];
        let i = 0;
        while (i < line.length) {
            const c = line[i];
            switch (c) {
            case ' ':
                i += 1;
                continue;
            case '+':
            case '*':
            case '(':
            case ')':
                i += 1;
                tokens.push(c);
                break;
            default:
                if (isNumeric(c)) {
                    let num = 0;
                    while (i < line.length) {
                        let c = line[i];
                        if (!isNumeric(c)) break;
                        num *= 10;
                        num += +c;
                        i += 1;
                    }
                    tokens.push(num);
                } else {
                    throw new Error(`Invalid character '${c}' at position: ${i + 1}, line: ${ix + 1}`);
                }
                break;
            }
        }
        expressions.push(tokens);
    }

    return expressions;
}

async function main() {
    const input = await Deno.readTextFile('input');
    const data = input.trim().split('\n');

    return [part1(data), part2(data)].join('\n');
}

main()
    .then(console.log)
    .catch(console.log);
