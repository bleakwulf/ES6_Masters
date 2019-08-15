{
    const noOfRounds = 5;

    console.log(`====================================================================================================`);
    console.log(`\tRound#\t\tPlayer 1\t\tPlayer 2\t\t\tResult`);
    console.log(`----------------------------------------------------------------------------------------------------`);

    class RoundResult {
        constructor(roundNo, p1Weapon, p2Weapon, winningPlayer) {
            this.roundNo = roundNo;
            this.p1 = p1Weapon;
            this.p2 = p2Weapon;
            this.winner = winningPlayer
        }
    }

    const weapons = new Set()
        .add('\u{0270A}')    // rock
        .add('\u{1F590}')   // paper
        .add('\u{0270C}');   // scissors

    // match results, throws paired via P1 perspective 
    const matchMatrix = new Map()
        .set('\u{0270A}\u{1F590}', 	2)  // rock vs. paper
        .set('\u{0270A}\u{0270A}', 	0)  // rock vs. rock
        .set('\u{0270A}\u{0270C}', 	1)  // rock vs. scissors
        .set('\u{1F590}\u{0270A}', 	1)  // paper vs. rock
        .set('\u{1F590}\u{1F590}', 	0)  // paper vs. paper
        .set('\u{1F590}\u{0270C}', 	2)  // paper vs. scissors
        .set('\u{0270C}\u{0270A}', 	2)  // scissors vs. rock
        .set('\u{0270C}\u{1F590}', 	1)  // scissors vs. paper
        .set('\u{0270C}\u{0270C}', 	0); // scissors vs. scissors

    const generateWeapon = async() => {
        // randomize among weapons Set
        var weapon = await [...weapons][Math.ceil(Math.random() * 10) % 3];
        return weapon;
    };

    let game = new Set();

    const simulateGamePlay = async() => {
        for (i = 1; i <= noOfRounds; i++) {
            
            // run async parallel for each player's throw 
            let displayMessage = await Promise.all([
                (async() => await generateWeapon())(), 
                (async() => await generateWeapon())()
            ]).then((result) => {
                let [p1Weapon, p2Weapon] = result;
                let matchKey = `${p1Weapon}${p2Weapon}`;
                let winFlag = matchMatrix.get(matchKey);

                // add match result into game Set object
                game.add(new RoundResult(i, p1Weapon, p2Weapon, winFlag));

                let winFlagText = winFlag === 0 ? `Draw.` : `Player ${winFlag} wins!`;

                return `\t${i}\t\t\t${p1Weapon}\t\t\t\t${p2Weapon}\t\t\t\t${winFlagText}`;
                
            }).catch(error => {
                return `ERROR: round failed.`; 
            });

            console.log(displayMessage);
        };

        await arbitrateGameResults();
    };

    const arbitrateGameResults = async() => {
        let p1score = [...game].filter((roundResult) => roundResult.winner === 1).length;
        let p2score = [...game].filter((roundResult) => roundResult.winner === 2).length;

        let finalResult = p1score === p2score 
            ? `It's a draw ` 
            : `Player ${p1score > p2score ? 1 : 2} wins! `;

        finalResult += p1score > p2score 
            ? `(${p1score} : ${p2score})`
            : `(${p2score} : ${p1score})`;
            
        console.log(`----------------------------------------------------------------------------------------------------`);
        await console.log(finalResult);
        console.log(`====================================================================================================`);
    }

    simulateGamePlay();
}