const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");

const rl = readline.createInterface({ input, output });

const users = [
    { name: "Alex", traits: ["creative", "social", "organized"] },
    { name: "Jordan", traits: ["technical", "quiet", "organized"] },
    { name: "Taylor", traits: ["creative", "adventurous", "social"] },
    { name: "Morgan", traits: ["technical", "competitive", "independent"] },
    { name: "Casey", traits: ["social", "collaborative", "creative"] }
];

const traitChoices = [
    "creative",
    "social",
    "organized",
    "technical",
    "quiet",
    "adventurous",
    "competitive",
    "independent",
    "collaborative"
];

async function chooseTrait(number, selectedTraits) {
    console.log(`\nChoose Trait ${number}:`);

    traitChoices.forEach((trait, index) => {
        console.log(`${index + 1}. ${trait}`);
    });

    while (true) {
        const answer = await rl.question("\nEnter a number: ");
        const choice = Number(answer);

        if (choice < 1 || choice > traitChoices.length || isNaN(choice)) {
            console.log("Invalid choice. Enter a number from 1-9.");
            continue;
        }

        const selectedTrait = traitChoices[choice - 1];

        if (selectedTraits.includes(selectedTrait)) {
            console.log("You already selected that trait. Choose another.");
            continue;
        }

        return selectedTrait;
    }
}

async function main() {
    console.log("==============================");
    console.log("  ToreroForge Trait Matcher");
    console.log("==============================");

    const userTraits = [];

    userTraits.push(await chooseTrait(1, userTraits));
    userTraits.push(await chooseTrait(2, userTraits));
    userTraits.push(await chooseTrait(3, userTraits));

    const results = [];

    for (const person of users) {
        let matches = 0;

        for (const trait of userTraits) {
            if (person.traits.includes(trait)) {
                matches++;
            }
        }

        const similarity = (matches / 3) * 100;

        results.push({
            name: person.name,
            traits: person.traits,
            similarity: similarity
        });
    }

    results.sort((a, b) => b.similarity - a.similarity);

    console.log("\n==============================");
    console.log("Your Traits:");
    console.log(userTraits.join(", "));

    console.log("\nMatches:");
    console.log("==============================");

    for (const result of results) {
        console.log(
            `${result.name}: ${result.similarity.toFixed(0)}% match`
        );
        console.log(`Traits: ${result.traits.join(", ")}\n`);
    }

    console.log("==============================");
    console.log(`Best Match: ${results[0].name}`);
    console.log("==============================");

    rl.close();
}

main();