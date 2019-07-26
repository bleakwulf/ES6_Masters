const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ':'
});

let participantCount = 0;
let participants = [];
let isToProvideNames = false;

class Participant {
    constructor() {
        // this.seqNo = seqNo;
        // this.name = name;
        // this.score = score;
        this.seqNo;
        this.name;
        this.score;
    }
}

// helper functions
const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n)
}

const addOrdinalSuffix = (i) => {
    var j = i % 10,
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
            console.log(`Your input was not recognized as a number. Please try again.\n`)
            promptForParticipantCount();
        }

    });
}

const promptIfToEnterNames = () => {
    rl.question(`Would you like to provide the participants' names [Y/N]?`, (answer) => {

        if (answer.toLowerCase().replace(/^\s+|\s+$/g, '') === 'y' || answer.toLowerCase().replace(/^\s+|\s+$/g, '') === 'n') {
            isToProvideNames = answer.toLowerCase().replace(/^\s+|\s+$/g, '') === 'y';
            promptEntryOfParticipants();
        } else {
            promptIfToEnterNames();
        }
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
                let participant = new Participant();
                participant.seqNo = participants.length + 1;
                participant.name = name;
                participants.push(participant);
            }

            promptForParticipantName();
        });
    }
}

const promptForParticipantScore = (participantIndex) => {
    let seqNo = isToProvideNames ? participantIndex : participants.length;

    if (seqNo >= participantCount) {
        sortParticipantsByScore();
        finalizeRankings();
        rl.close();

    } else {
        let participantSeqNo = seqNo + 1;
        let question = `Please enter score [1-10 only] of ${addOrdinalSuffix(seqNo + 1)} contestant : `;
        if (isToProvideNames) {
            question = question.replace('contestant', `contestant (${participants[seqNo].name})`);
        }

        rl.question(question, (answer) => {
            let score = parseInt(answer);

            if (isNumeric(score) && score > 0 && score <=10) {
                if (isToProvideNames) {
                    participants[seqNo].score = score;
                    seqNo += 1;
                } else {
                    let participant = new Participant();
                    participant.seqNo = participants.length + 1;
                    participant.score = score;
                    participants.push(participant);
                }
            }

            promptForParticipantScore(seqNo);
        });
    }
}

const sortParticipantsByScore = () => {
    participants.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? 0 : -1 );
    console.log(participants);
}

const finalizeRankings = () => {
    console.log('Yayy! [TO DO: finalize ranking stats]');
}

console.log(`Press Ctrl + 'C' to exit at any time`);
promptForParticipantCount();