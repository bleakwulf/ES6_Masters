const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ':'
});

const MIN_SCORE = 1;
const MAX_SCORE = 10;

let participantCount = 0;
let participants = [];
let isToProvideNames = false;

// helper functions
const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n)
}

const addOrdinalSuffix = (i) => {
    let j = i % 10,
        k = i % 100;

    if (j == 1 && k != 11) {
        return i + "st";
    }

    if (j == 2 && k != 12) {
        return i + "nd";
    }

    if (j == 3 && k != 13) {
        return i + "rd";
    }

    return i + "th";
}

const promptForParticipantCount = () => {
    rl.question(`Please provide number of participants: `, (answer) => {
        participantCount = parseInt(answer);

        if (isNumeric(participantCount)) {
            promptIfToEnterNames();
        } else {
            console.log(`\tERROR: Your input was not recognized as a number. Please try again.\n`)
            promptForParticipantCount();
        }

    });
}

const promptIfToEnterNames = () => {
    rl.question(`Would you like to provide the participants' names [Y if yes]? `, (answer) => {
        isToProvideNames = answer.toLowerCase().replace(/^\s+|\s+$/g, '') === 'y';
        promptEntryOfParticipants();
    });
}

const promptEntryOfParticipants = () => {
    if (isToProvideNames) {
        promptForParticipantName();
    } else {
        promptForParticipantScore(0);
    }
}

const promptForParticipantName = () => {
    if (participants.length >= participantCount) {
        promptForParticipantScore(0);
    } else {
        let seqNo = participants.length + 1;
        rl.question(`Please enter name of ${addOrdinalSuffix(seqNo)} contestant: `, (answer) => {
            let name = answer.replace(/^\s+|\s+$/g, '');

            if (name !== '') {
                let participant = { seqNo, name };
                participants.push(participant);
            } else {
                console.log(`\tERROR: No name provided.\n`)
            }

            promptForParticipantName();
        });
    }
}

const promptForParticipantScore = (participantIndex) => {
    let seqNo = isToProvideNames ? participantIndex : participants.length;

    if (seqNo >= participantCount) {
        console.log(participants);
        rankParticipantsByScore();
        rl.close();

    } else {
        let participantSeqNo = seqNo + 1;
        let question = `Please enter score [${MIN_SCORE}-${MAX_SCORE} only] of ${addOrdinalSuffix(participantSeqNo)} contestant : `;
        if (isToProvideNames) {
            question = question.replace('contestant', `contestant (${participants[seqNo].name})`);
        }

        rl.question(question, (answer) => {
            let score = parseInt(answer);

            if (isNumeric(score) && score >= MIN_SCORE && score <= MAX_SCORE ) {
                if (isToProvideNames) {
                    // Exercise 4: implement spread operator (1)
                    let participant = { ...participants[seqNo], score };
                    
                    // Exercise 4: implement spread operator (2)
                    participants[seqNo] = { ...participant };
                    seqNo += 1;

                } else {
                    let participant = {
                        'seqNo':  participantSeqNo,
                        score
                    };
                    participants.push(participant);
                }
            } else {
                console.log(`\tERROR: Invalid score. Please try again.\n`)
            }

            promptForParticipantScore(seqNo);
        });
    }
}

const rankParticipantsByScore = () => {
    // group participants according to their scores 
    const rankedParticipants = groupParticipantsByAttr(participants, 'score');

    // destructuring part 1: sort unique score values descending in descneding order 
    //      and extract available top 3 scores, default each to 0 if none found
    let [topScore1 = 0, 
        topScore2 = 0, 
        topScore3 = 0] = Object.keys(rankedParticipants).sort((a, b) => b - a);

    // destructuring part 2: extract participant names according to matching top 3 scores
    let {
        [topScore1]: top1Participants, 
        [topScore2]: top2Participants, 
        [topScore3]: top3Participants} = rankedParticipants;

    // display rankings
    parseInt(topScore1) === 0 || displayRankDetail(1, topScore1, top1Participants);
    parseInt(topScore2) === 0 || displayRankDetail(2, topScore2, top2Participants);
    parseInt(topScore3) === 0 || displayRankDetail(3, topScore3, top3Participants);

}

const displayRankDetail = (rank, score, participants) => {
    const displayName = participants.length > 1 ? participants.length + ` contestants`
        : isToProvideNames ? participants[0].name 
        : addOrdinalSuffix(participants[0].seqNo) + ` contestant`;

    console.log(`\t(${addOrdinalSuffix(rank)}) ${displayName} scored ${score} out of ${MAX_SCORE}`);
}

const groupParticipantsByAttr = (participantsList, groupByAttr) => {
    return participantsList.reduce(
        function(rankedParticipants, participant) {
            const scoreKey = participant[groupByAttr];

            if (!rankedParticipants[scoreKey]) {
                rankedParticipants[scoreKey] = [];
            }

            rankedParticipants[scoreKey].push(participant);
            return rankedParticipants;
        }, {});
};

console.log(`Press Ctrl + 'C' to exit at any time`);
promptForParticipantCount();