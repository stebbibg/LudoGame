function evaluate(){
    currentPlayer = Math.floor(Math.random() * players.length);
    let mutationRate = 0.002//.002;//0.005;// 0.01;//.01;//.01;
    gui = "off";
    var playGame = new LudoGame();
    var state = new State();
    const noPopulations = 100;
    const noGenes = 13;
    const noRounds = 1000;
    const breedingRate = 0.1//;0.1;//0.1;// 0.2;
    var population = new Population(noPopulations, noGenes);
    const noGenerations = 60;
    for (let i = 0; i < noGenerations; i++){
        gameHistory = [];

        let res = testRound(playGame, state, population, noPopulations,noRounds,i, breedingRate, mutationRate)
        function compare( a, b ) {
            if ( a.res < b.res ) return -1;  
            if ( a.res > b.res ) return 1;
            return 0;
        }
          
        res.sort( compare );
        let avg = 0;
        for (let i = 0; i < res.length; i++){
            avg += res[i].res;
        }
        avg = avg/res.length;
        console.log("Generation: " + i + "  - Average: " + (Math.round(avg*100000)/1000) + "\% - Best: " + res[res.length-1].res * 100+ "\%");
    //    const pooledData = poolPopulation(res);
     //   console.log(res)
        console.log(res[res.length - 1])
        let currentPop = population.getPopulation();
    //    console.log(currentPop)
        let newGenes = breed(res, currentPop, breedingRate);
        updatePopulation(res, currentPop, newGenes);
        mutate(population, mutationRate)
        population.setPopulation(currentPop);
    }
}

function updatePopulation(res, population, newGenes){
    let deleteArray = [];
    for (let i = 0; i < newGenes.length; i++){
        deleteArray.push(res[i].gene);
    }
    deleteArray.sort(function(a, b){return b - a});
    for (let i = 0; i < deleteArray.length; i++){
        population.splice(deleteArray[i],1);
    }
    for (let i = 0; i < newGenes.length; i++){
        population.push(newGenes[i])
    }
}

function mutate(population, rate){
    for (let i = 0; i < population.length; i++){
        for (let j = 0; j < population[i].DNA.length; j++){
            if (Math.random() < rate){
            //    let randomDNA = Math.sign(Math.random() - 0.5) * Math.floor(Math.random() * Math.floor(127));
                let randomDNA = Math.random();
                population[i].DNA[j] = randomDNA;
            }
        }
    }
}

function breed(res, population, breedingRate){
    let noBreds = Math.round(res.length*breedingRate);
    let newGenes = [];
    for (let i = 0; i < noBreds; i++){
        let resindx1 = population.length -  1 - i;
        let resindx2 = population.length - 2 - i;
        let indx1 = res[resindx1];
        let indx2 = res[resindx2];

        let gene1 = population[indx1.gene]
        let gene2 = population[indx2.gene]
        let newPawnGene = [];
            console.log("BREED")

        for (let k = 0; k < 4; k++){
            const lastEl = newGenes.length - 1;
            newPawnGene.push({pawnDNA: [], pawnNo: k})
            for (let j = 0; j < gene1[k].pawnDNA.length; j++){
                let randomGene;
                // Randomly take a gene in 1% of the case
                if (Math.random() > 0.01){
                    randomGene = (Math.random() > 0.5 ? gene1[k].pawnDNA[j] : gene2[k].pawnDNA[j])
                }else{
                    randomGene = gene1[Math.floor(Math.random() * gene1.length)].pawnDNA[j];    // Take a random gene instead
                }
            //    newPawnGene[lastEl].pawnDNA.push(randomGene)
                newPawnGene[k].pawnDNA.push(randomGene);
            }
        }
        newGenes.push(newPawnGene);
    }
    return newGenes;
}

function testRound(playGame, state, population, noPopulations, noRounds, iteration, breedingRate, mutationRate){

    let res = {red: 0, blue: 0, yellow: 0, green:0};
    let totalres = [];

    function makeRedMove(gene){
    
        possiblePlayers = getPlayers(playGame);
        const currentpop = population.getPopulation();
        let possibleStates = [];
        for (let i = 0; i < possiblePlayers.length; i++){
            possibleStates.push(state.getState(possiblePlayers[i].id, dice));
        }

        if (possibleStates.length === 0) 
        {
        //    gameHistory.push({color: "red", value: dice, madeMove: false})
            return null;      // play another round since there are no available players
        }
        let chosenPlayer = choosePlayer(possibleStates, currentpop[gene]);
        playGame.movePawn(chosenPlayer, dice);
    //    gameHistory.push({color: "red", value: dice, madeMove: chosenPlayer})
    }

    for (let i = 0; i < noPopulations; i++){
        let counter = 0;
        for (let j = 0; j < noRounds; j++){
            counter = 0;
            while(1){
                counter++;
                if (counter > 500) break;
                playGame.updateNextPlayer();
                playGame.playRound();
                if (winner !== false) break;
                playGame.throwDice();
                makeRedMove(i);
                while(dice === 6){
                    playGame.throwDice();
                    makeRedMove(i);
                }
                
                if (winner !== false){
                //    console.log("winner true")
                    break
                }
            }
    
            switch (winner) {
                case "red":
                    res.red++;
                    break;
                case "green":
                    res.green++;
                    break;
                case "blue":
                    res.blue++;
                    break;
                case "yellow":
                    res.yellow++;
                    break;
                default:
                    break;
            }
            playGame.resetGame();
        }
    //    console.log(res)
        
        const fs = require('fs')
        const outputstring = iteration + " " + res.red + " " + res.green + " " + res.blue + " " + res.yellow + " " + breedingRate + " " + mutationRate +"\n";
        fs.appendFileSync("results.txt", outputstring, (err) => {
            if (err) console.log(err);

        });
        totalres.push({res: res.red /(res.blue + res.yellow + res.green + res.red), gene: i});
    //    allRes.push()
        res = {red: 0, blue: 0, yellow: 0, green:0};
    }
    return (totalres);
}

function getPlayers(playGame){
    let possiblePlayers = [];
    if (dice === 6){
        for (let i = 0; i < 4; i++){    // only red pawns
            if (pawns[i].goal !== true) possiblePlayers.push(pawns[i]);
        }
    }else{
        for (let i = 0; i < onboard.length; i++){
            if (onboard[i].id.substr(0, onboard[i].id.indexOf("pawn")) === "red") possiblePlayers.push(onboard[i])
        }
    }

    for (let i = possiblePlayers.length - 1; i >= 0; i--){
        if (playGame.checkIfOverlap(possiblePlayers[i], dice)) {
            possiblePlayers.splice(i,1);
        }
    }
    return possiblePlayers;
}

function choosePlayer(possibleStates, dna){
    possibleStates.sort((a,b) =>  (a.pawnNumber > b.pawnNumber) ? 1 : -1);  // Sort by the positions of the pawns, the first pawn is at 0
//    let maxScore = {player: possibleStates[0].id, index: dna[0].pawnDNA.length};
    let maxScore = {player: null, index: Infinity}
    // If there is a pawn in the middle that cannot be moved, the pawnNo should be updated
    for (let i = 0; i < possibleStates.length; i++){
        possibleStates[i].pawnNumber = i;
    }
    let noPawns = Math.max.apply(Math, possibleStates.map(function(o) { return o.pawnNumber; })) + 1;
    for (let i = 0; i < noPawns; i++){ 
        /*
        console.log(pawns)
        console.log("dice: " + dice)
        console.log(possibleStates)
        console.log(i)
        */
        const statePlayer = possibleStates[i].id; 
    //    let inputs = [possibleStates[i].hitGoal]
        
        let inputs = [possibleStates[i].hitGoal,
                    possibleStates[i].hitEnemy,
                    possibleStates[i].hitGlobe,
                    possibleStates[i].atAStar,
                    possibleStates[i].moreEnemiesFront,
                    possibleStates[i].lessEnemiesBehind,
                    possibleStates[i].atHome,
                    1
                ]


        let weights = [dna[i].pawnDNA[0], dna[i].pawnDNA[1], dna[i].pawnDNA[2], dna[i].pawnDNA[3], dna[i].pawnDNA[4], dna[i].pawnDNA[5],
            dna[i].pawnDNA[6], dna[i].pawnDNA[7]];
        var len = weights.length;
        var sorted = [...weights];
    //    indices.sort(function (a, b) { return indices[a] < indices[b] ? -1 : indices[a] > indices[b] ? 1 : 0; });   // The indexes of the weights, sor
        sorted.sort();
        let indices = [];
        for (var j = len-1; j >= 0; j--){
            for (let k = 0; k < weights.length; k++){
                if (weights[k] === sorted[j]) indices.push(k)
            }
        } 

        let index = null;
        for (let j = 0; j < weights.length; j++){
            if (inputs[indices[j]] !== 0){
                index = indices[j];
                break;
            }
        }

        // Scale the index
        if (possibleStates[i].moreEnemiesBehind === 1) index = index/dna[i].pawnDNA[8];
        if (possibleStates[i].atGlobe === 1) index = index/dna[i].pawnDNA[9];
        if (possibleStates[i].bouncedOfGoal === 1) index = index/dna[i].pawnDNA[10];
        if (possibleStates[i].knockedOutAtGlobe === 1) index = index/dna[i].pawnDNA[11];

        index = index /dna[i].pawnDNA[11];  // Take into account which pawn it is

    //    let flag = false;
        let flag = (Math.random() < 0.00001 ? true : false)
        flag = false;
        if (index < maxScore.index){
            maxScore.index = index;
            maxScore.player = statePlayer;
        }
        if (flag === true){
            console.log(maxScore)
            console.log(inputs);
            console.log(weights);
            console.log(index)
        }
    }
 //   return findPawn(possibleStates[Math.floor(Math.random() * possibleStates.length)].id)
    return findPawn(maxScore.player);
}