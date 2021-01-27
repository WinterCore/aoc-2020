type Operator = '+' | '*';
type Token = number | Operator | '(' | ')';
type Expression = Token[];

class Stack<T> {
    size = 0
    private stack: T[];

    constructor(arr: T[] = []) {
        this.stack = arr;
    }

    push(val: T): void {
        this.stack.push(val);
    }

    pop(): T {
        if (this.empty()) throw new Error('The stack is empty!');
        return this.stack.pop() as T;
    }

    top(): T {
        if (this.empty()) throw new Error('The stack is empty!');
        return this.stack[this.stack.length - 1];
    }

    empty(): boolean {
        return !!this.size;
    }
}


function calculate(a: number, b: number, op: Operator): number {
    switch (op) {
    case '+':
        return a + b;
    case '*':
        return a * b;
    }
}

function performOperation(ops: Stack<Operator>, nums: Stack<number>, parens: Stack<{ c: number }>, allowed: Operator[]): void {
    if (parens.top().c >= 2 && allowed.indexOf(ops.top()) > -1) {
        const b = nums.pop(), a = nums.pop();
        nums.push(calculate(a, b, ops.pop()));
        parens.top().c -= 1;
        performOperation(ops, nums, parens, allowed);
    }
}

function evaluateExpression2(expression: Expression): number {
    let ops    = new Stack<Operator>();
    let nums   = new Stack<number>();
    let parens = new Stack<{ c: number }>([{ c: 0 }]);

    for (let token of expression) {
        if (typeof token === 'number') {
            nums.push(token);
            parens.top().c += 1;
            performOperation(ops, nums, parens, ['+']);
        } else {
            switch (token) {
            case '(':
                parens.push({ c: 0 });
                break;
            case ')':
                performOperation(ops, nums, parens, ['*']);
                parens.pop();
                parens.top().c += 1;
                performOperation(ops, nums, parens, ['+']);
                break;
            case '+':
            case '*':
                ops.push(token);
                break;
            }
        }
    }
    performOperation(ops, nums, parens, ['*']);

    return nums.pop();
}


function evaluateExpression(expression: Expression): number {
    let ops    = new Stack<Operator>();
    let nums   = new Stack<number>();
    let parens = new Stack<{ c: number }>([{ c: 0 }]);

    for (let token of expression) {
        if (typeof token === 'number') {
            nums.push(token);
            parens.top().c += 1;
            performOperation(ops, nums, parens, ['+', '*']);
        } else {
            switch (token) {
            case '(':
                parens.push({ c: 0 });
                break;
            case ')':
                parens.pop();
                parens.top().c += 1;
                performOperation(ops, nums, parens, ['+', '*']);
                break;
            case '+':
            case '*':
                ops.push(token);
                break;
            }
        }
    }

    return nums.pop();
}

function part1(lines: string[]): string {
    const expressions: Expression[] = parse(lines);
    let results: number[] = [];

    for (let expression of expressions) {
        results.push(evaluateExpression(expression));
    }

    return `Part 1 answer = ${results.reduce((a, b) => a + b, 0)}`;
}

function part2(lines: string[]): string {
    const expressions: Expression[] = parse(lines);
    let results: number[] = [];

    for (let expression of expressions) {
        results.push(evaluateExpression2(expression));
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
