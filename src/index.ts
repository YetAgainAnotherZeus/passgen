import crypto from 'node:crypto';
import { Command } from 'commander';

const isWindows = process.platform === "win32";
if (!isWindows) {
    console.log("This program only works on Windows");
    process.exit(1);
}

const CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$";

function generatePassword(length: number) {
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
        .map((x) => CHARACTERS[x % CHARACTERS.length])
        .join('');
}

const cli = new Command();
cli.version('1.0.0')
    .description('Password Generator CLI')
    .argument('[length]', 'length of password', '8')
    .option('-p, --print', 'print password')
    .option('-b, --bulk <number>', 'generate multiple passwords')
    .parse(process.argv);

const options = cli.opts();

if (Number.isNaN(Number(cli.processedArgs[0]))) {
    console.log("Invalid password length");
    process.exit(1);
}

if (options.bulk && Number.isNaN(Number(options.bulk))) {
    console.log("Invalid bulk password count");
    process.exit(1);
}

// $ pass [length]
if (!options.bulk && !options.print) {
    const password = generatePassword(parseInt(cli.processedArgs[0]));

    console.log("Password copied to clipboard");
    require('child_process').exec(
        `Set-Clipboard "${password}"`, { 'shell': 'powershell.exe' }
    );
}

// $ pass -p [length]
if (!options.bulk && options.print) {
    const password = generatePassword(parseInt(cli.processedArgs[0]));

    console.log(password);
}

// $ pass -b <amount> [length]
if (options.bulk && !options.print) {
    let passwords = [];
    for (let index = 0; index < options.bulk; index++) {
        const password = generatePassword(parseInt(cli.processedArgs[0]));

        passwords.push(password);
    }

    console.log("Passwords copied to clipboard");
    require('child_process').exec(
        `Set-Clipboard "${passwords.join('\n')}"`, { 'shell': 'powershell.exe' }
    );
}

// $ pass -p -b <amount> [length]
if (options.bulk && options.print) {
    console.log("Passwords:");
    for (let index = 0; index < options.bulk; index++) {
        const password = generatePassword(parseInt(cli.processedArgs[0]));

        console.log(password);
    }
}