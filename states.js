class State{
    getState(pawnID, diceVal){

        // ADD AT A STAR!!

        let currentState = {
            friendPosBehind: [], 
            friendPosFront: [], 
            enemyPosBehind: [], 
            enemyPosFront: [], 
            distanceToStar: [], 
            distanceToGlobe: [],
            atGlobe: false,
            enemyAtSafeZone: false,
            distanceToGoal: [],
            justHitHomeRun: false
        };
        let currentPawn = findPawn(pawnID);
        let currentPos = currentPawn.pos;
        let pawnColor = pawnID.substr(0, pawnID.indexOf("pawn"));

        let newPos = currentPos + diceVal;
        if (newPos > ranges[pawnColor].end && (currentPos <= ranges[pawnColor].end) && pawn.homerun === false){
            currentState.justHitHomeRun = true;
        }

        if (isNaN(currentPawn.pos)){
            return null;
        }

        if (currentPawn.homerun !== true){
            pawns.forEach(element => {
                let otherPawnColor = element.id.substr(0, element.id.indexOf("pawn"));
                if (element.id !== pawnID && element.homerun !== true){
                    if (otherPawnColor !== pawnColor){
                        if (!(isNaN(element.pos))){
                            let dist = this.getDistanceFromPawn(currentPawn, element, pawnColor, otherPawnColor, newPos);
                            if (dist.distanceFromOther !== null){
                                currentState.enemyPosBehind.push(dist.distanceFromOther);
                            }
                            if (dist.distanceToOther !== null){
                                currentState.enemyPosFront.push(dist.distanceToOther);
                            }
                        }  
                    }else{
                        if (!(isNaN(element.pos))){
                            if (element.homerun !== true){
                                let dist = this.getDistanceFromPawn(currentPawn, element, pawnColor, otherPawnColor, newPos);
                                if (dist.distanceFromOther !== null){
                                    currentState.friendPosBehind.push(dist.distanceFromOther);
                                }
                                if (dist.distanceToOther !== null){
                                    currentState.friendPosFront.push(dist.distanceToOther);
                                }
                            }else{
                                let dist = this.getDistanceToHomeRun(currentPawn, element, pawnColor, newPos);
                                currentState.friendPosFront.push(dist);
                            }
                        }
                    }
                }
            });

            const distToStar = this.getDistanceToStar(pawnColor, newPos);
            if (distToStar !== null){
                currentState.distanceToStar.push(distToStar);
            }
            const distToGlobe = this.getDistanceToGlobe(pawnColor, newPos);
            if (Array.isArray(distToGlobe)){
                distToGlobe.forEach(element => {
                    if (element === 0)  {currentState.atGlobe = true;}
                    else {currentState.distanceToGlobe.push(element)};
                });
            } else if (distToGlobe !== null){
                currentState.distanceToGlobe.push(distToGlobe);
            }
            const distanceToGoal = this.getDistanceToGoal(pawnColor, newPos);
            currentState.distanceToGoal = distanceToGoal;
            if (positions[currentPos].hasOwnProperty('homeSafe')) currentState.isAtEnemyHomeSafe = this.isAtEnemyHomeSafe;
        }else{
            const state = this.getStatesAtHomeRun(currentPawn, pawnColor, newPos);
            console.log(state)
        }
        console.log(currentState)
    }

    isAtEnemyHomeSafe(pos){
        for (let i = 0; i < pawns.length; i++){
            let element = pawns[i];
            let otherPawnColor = element.id.substr(0, element.id.indexOf("pawn"));
            if (element.pos === pos){
                if (!(isNaN(element.pos))){
                    if (positions[element.pos].homeSafe === otherPawnColor){
                        return true;
                    }
                }        
            }
        }
        return false;
    }

    getStatesAtHomeRun(pawn, currentColor, pos){
        let distToGoal = 5 - pawn.pos;
        let distToPawns = [];
        pawns.forEach(element => {
            let currentPos = pos;
            let counter = 0;
            if (element.id.substr(0, element.id.indexOf("pawn")) === currentColor){
                if ((!(isNaN(element.pos)) && (element.id !== pawn.id))){
                    if(element.homerun === true){
                        distToPawns.push(element.pos - pos);
                        console.log(element)
                    }else{
                        counter  = currentPos + 1;
                        currentPos = ranges[currentColor].end;
                        while(1){
                            currentPos--;
                            counter++;
                            if (currentPos < 0){
                                currentPos = positions.length - 1;
                            }
                            if (currentPos === element.pos){
                                distToPawns.push(-counter);
                                break;
                            }
                        }
                    }
                }
            }
        });
        return {distToGoal: distToGoal, distToPawns: distToPawns};
    }

    getDistanceToGoal(color, pos){
        let currentPos = pos;
        let counter = 0;
        while(1){
            if (currentPos === ranges[color].end){
                return counter + 6;
            }
            counter++;
            currentPos++;
            if (currentPos >= positions.length){
                currentPos = 0;
            }
        }
    }

    getDistanceToGlobe(color, pos){
        let currentPos = pos;
        let dist = null;
        let counter = 0;
        while(1){
            if (positions[currentPos].globe === true){
                ((counter === 0) ? dist = counter : ((dist === null ? dist = counter : dist = [dist, counter])) );
                if (counter !== 0) break;
            }
            counter++;
            currentPos++;
            if (currentPos >= positions.length){
                currentPos = 0;
            }
            if (currentPos === ranges[color].end){
                break;
            }
        }
        return dist;
    }

    getDistanceToStar(color, pos){
        let currentPos = pos;
        let dist = null;
        let counter = 0;
        while(1){
            counter++;
            currentPos++;
            if (currentPos >= positions.length){
                currentPos = 0;
            }
            if (currentPos === ranges[color].end){
                break;
            }
            if (positions[currentPos].star === true){
                dist = counter;
                break;
            }
        }
        return dist;
    }
    
    getDistanceToHomeRun(pawn1, pawn2, currentColor, pos){
        let boardLength = positions.length;
        let rangeLeft;
        (ranges[currentColor].end < pos ? rangeLeft = boardLength - pos + ranges[currentColor].end : rangeLeft = ranges[currentColor].end - pos);
        return (pawn2.pos + 1 + rangeLeft);
    }

    getDistanceFromPawn(pawn1, pawn2, currentColor, otherPawnColor, pos){
        let boardLength = positions.length;
        let distanceToOther = null;     // Distance from pawn1 to pawn2
        let distanceFromOther = null;   // Distance from pawn2 to pawn1

        function calculateDistance(p1, p2){
            if (p1 < p2){
                return p2 - p1;
            }else{
                return boardLength - p1 + p2;
            }
        }

        const pawn1pos = pos;

        let currentPos = pawn1.pos;
        while(1){
            if (currentPos === pawn2.pos){
                distanceToOther = calculateDistance(pawn1pos, currentPos)
                break;
            }
            if (currentPos === ranges[currentColor].end && currentPos !== pawn1pos){   // If pawn1 is initially positioned at the end range
                break;
            }
            currentPos++;
            if (currentPos >= boardLength){
                currentPos = 0;
            }
        }

        currentPos = pawn1pos;
        while(1){
            if (currentPos ===  pawn2.pos){
                distanceFromOther = calculateDistance(pawn2.pos, pawn1pos)
                break;
            }
            if (currentPos === ranges[otherPawnColor].end && currentPos !== pawn1pos){  // If pawn1 is initially positioned at the end range
                break;
            }

            currentPos--;
            if (currentPos < 0){
                currentPos = boardLength - 1;
            }
        }
        return {distanceFromOther: distanceFromOther, distanceToOther: distanceToOther};
    }
}