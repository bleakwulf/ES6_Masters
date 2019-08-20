const express = require('express');
const app = express();

app.use(express.json());

class PokerHand {
    constructor(rank, pokerHandName, isSameSuit, isInSequence, cardRanksRatio, requiredHighRankCard) {
        this.rank = rank;
        this.pokerHandName = pokerHandName;
        this.isSameSuit = isSameSuit;
        this.isInSequence = isInSequence;
        this.cardRanksRatio = cardRanksRatio;
        this.requiredHighRankCard = requiredHighRankCard;
    }
;}

const pokerHandsMatrix = [
    new PokerHand( 1, 'Royal Flush',        true,   true,   null,       'A' ), 
    new PokerHand( 2, 'Straight Flush',     true,   true,   null,       null ), 
    new PokerHand( 3, 'Four of a Kind',     false,  false,  '4:1',      null ), 
    new PokerHand( 4, 'Full House',         false,  false,  '3:2',      null ), 
    new PokerHand( 5, 'Flush',              true,   false,  null,       null ), 
    new PokerHand( 6, 'Straight',           false,  true,   null,       null ), 
    new PokerHand( 7, 'Three of a Kind',    false,  false,  '3:1:1',    null ), 
    new PokerHand( 8, 'Two Pair',           false,  false,  '2:2:1',    null ), 
    new PokerHand( 9, 'One Pair',           false,  false,  '2:1:1:1',  null ), 
    new PokerHand( 10, 'High Card',         false,  false,  null,       null ) 
];

const allCardSuits = new Map()
    .set(`C`, `clubs`)
    .set(`D`, `diamonds`)
    .set(`H`, `hearts`)
    .set(`S`, `spades`);
 
const allCardRanks = new Map()
    .set(`A`, 14)
    .set(`K`, 13)
    .set(`Q`, 12)
    .set(`J`, 11)
    .set(`10`, 10)
    .set(`9`, 9)
    .set(`8`, 8)
    .set(`7`, 7)
    .set(`6`, 6)
    .set(`5`, 5)
    .set(`4`, 4)
    .set(`3`, 3)
    .set(`2`, 2);

app.get('/', (req, res) => {
    res.send(`Hello World!`);
});

app.post('/pokerhand/api/check', (req, res) => {

    if (!req.body) {
        return res.status(400).send(`Empty request.`);
    };

    let pokerHand = req.body.hand;

    if (!pokerHand || !Array.isArray(pokerHand) || pokerHand.length === 0) {
        return res.status(400).send(`No cards to evaluate.`);
    };

    if (pokerHand.length < 5) {
        return res.status(400).send(`Can't evaluate with insufficient cards in hand.`);
    };

    if (pokerHand.length > 5) {
        return res.status(400).send(`Excess cards found in your hand.`);
    };

    let { isValidSuits, pokerHandSuits } = validatePokerHandSuits(pokerHand);
    let { isValidRanks, pokerHandRanks } = validatePokerHandRanks(pokerHand);

    if (!isValidSuits || !isValidRanks) {
        return res.status(404).send(`An unknown card was found among cards in your hand.`)
    }

    if (new Set(pokerHand).size < 5) {
        return res.status(400).send(`Duplicate card found among cards in your hand`);
    }

    let isSameSuit = new Set(pokerHandSuits).size === 1;

    // pairs occur ONLY on card combo with varying suits, and they also diminish count of unique card rank
    let isCheckCardRankRatio = !isSameSuit && new Set(pokerHandRanks).size < 5;

    // card rank sequence check to be performed ONLY when NO paired cards in combo
    let isCheckCardRankSequence = !isCheckCardRankRatio; 

    // prepare version of poker hand with its ace card possibly being a low ace, i.e., by replacing ace with 1 
    let altPokerHandRanks = Array.from(pokerHandRanks);
    if (!isCheckCardRankRatio && pokerHandRanks.includes('A')) {
        altPokerHandRanks.splice(altPokerHandRanks.indexOf('A'), 1, '1');
    }

    let cardRanksRatio = isCheckCardRankRatio ? getCardRankRatio(pokerHandRanks) : null;
    let isInSequence = isCheckCardRankSequence ? isCardRankInSequence(pokerHandRanks) : false;
    let highCard = getHighRankCard(pokerHandRanks);

    // re-do sequence check (i.e., for low ace, e.g., 5-4-3-2-A) if it initially fails for high aces, i.e., by replacing ace with 1 
    //  NOTE: high ace via A-K-Q-J-10
    if (isCheckCardRankSequence && !isInSequence && pokerHandRanks.includes('A')) {
        isInSequence = isCardRankInSequence(altPokerHandRanks);

        // recalculate high card if card rank sequence is valid with low ace 
        if (isInSequence) highCard = getHighRankCard(altPokerHandRanks);
    }

    let pokerHandRank = pokerHandsMatrix.find(pokerHandDetail => 
        pokerHandDetail.isSameSuit === isSameSuit
        && pokerHandDetail.isInSequence === isInSequence
        && pokerHandDetail.cardRanksRatio === cardRanksRatio
        && (pokerHandDetail.requiredHighRankCard === null || (pokerHandDetail.requiredHighRankCard !== null && pokerHandDetail.requiredHighRankCard === highCard))
    );

    return res.send({
        'Result': pokerHandRank.pokerHandName
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} . . . `));

const validatePokerHandSuits = (pokerHand) => {
    let pokerHandSuits = pokerHand.map(playCard => Array.from(playCard).shift());
    let isValidSuits = pokerHandSuits.every(userCardSuit => allCardSuits.has(userCardSuit));
    return { isValidSuits, pokerHandSuits };
};

const validatePokerHandRanks = (pokerHand) => {
    let pokerHandRanks = pokerHand.map(playCard => Array.from(playCard).splice(1).join(''));
    let isValidRanks = pokerHandRanks.every(userCardRank => allCardRanks.has(userCardRank));
    return { isValidRanks, pokerHandRanks };
}

const getCardRankRatio = (pokerHandRanks) => {
    let cardRanksByValue = pokerHandRanks.map(cardRank => allCardRanks.get(cardRank));
    let cardRankRatio = Array.from(new Set(pokerHandRanks))
        .map(cardRank => allCardRanks.get(cardRank))
        .sort((a, b) => b - a)
        .map(rankValue => cardRanksByValue.filter(cardValue => cardValue === rankValue).length)
        .sort((a, b) => b - a)
        .join(":");

    return cardRankRatio;
}

const isCardRankInSequence = (pokerHandRanks) => {
    //  create modified version of ranks where low ace is recognized with value of 1
    let completeRankMatrix = new Map(Array.from(allCardRanks))
        .set(`1`, 1);

    // create string sequence of all card rank sorted descending by value
    let expectedFullRankSequence = Array.from(completeRankMatrix.keys())
        .map(key => [ parseInt(completeRankMatrix.get(key)), key ])
        .sort((a, b) => b[0] - a[0])
        .map(key => key[1])
        .join('');

    // create string sequence of card rank from poker hand, also sorted descending by value
    let pokerHandRanksSequence = pokerHandRanks
        .map(cardRank => [ cardRank, parseInt(completeRankMatrix.get(cardRank)) ])
        .sort((a, b) => b[1] - a[1])
        .map(key => key[0])
        .join('');

    return expectedFullRankSequence.indexOf(pokerHandRanksSequence) > -1;
}

const getHighRankCard = (pokerHandRanks) => {
    //  create modified version of ranks where low ace is recognized with value of 1
    let completeRankMatrix = new Map(Array.from(allCardRanks))
        .set(`1`, 1);

    let highCard = Array.from(new Set(pokerHandRanks))
        .map(cardRank => [ cardRank, parseInt(completeRankMatrix.get(cardRank)) ])
        .sort((a, b) => b[1] - a[1])
        .map(key => key[0])
        .shift();
    
    // console.log(highCard);
    return highCard;

}