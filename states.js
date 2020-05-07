class State{
    getState(pawnID, diceVal){
        let currentState = {
            id: pawnID,
            bouncedOffGoal: 0,
            friendPosBehind: [], 
            friendPosFront: [], 
            enemyPosBehind: [], 
            enemyPosFront: [], 
            distanceToStar: [], 
            distanceToGlobe: [],
            previousEnemyPosBehind: [],
            previousEnemyPosFront: [],
            moreEnemiesBehind: 0,
            moreEnemiesFront: 0,
            lessEnemiesFront: 0,
            lessEnemiesBehind: 0,
            atHome: 0,
            hitGlobe: 0,
            atGlobe: 0,
            hitFriend: 0,
            knockedOutAtGlobe: 0,
            hitEnemy: 0,
            enemyAtSafeZone: 0,
            distanceToGoal: 1,
            inFront: 0,
            atAStar: 0,
            justHitHomeRun: 0,
            pawnNumber: null,
            hitGoal: 0
        };

        let currentPawn = findPawn(pawnID);

        let currentPos = currentPawn.pos;
        let pawnColor = pawnID.substr(0, pawnID.indexOf("pawn"));

        // If the pawn is at home
        if (currentPawn.pos === "home"){
            currentState.atHome = 1;
            // Check if other pawns are there
            pawns.forEach(element =>{
                let otherPawnColor = element.id.substr(0, element.id.indexOf("pawn"));
                if (otherPawnColor !== pawnColor){
                    if (element.pos === ranges[pawnColor].start){
                        currentState.hitEnemy = 1;
                    }
                    const newPos = ranges[pawnColor].start;
                    let dist = this.getDistanceFromPawn(currentPawn, element, pawnColor, otherPawnColor, newPos);
                    if (dist.distanceFromOther !== null) {
                        currentState.enemyPosBehind.push(dist.distanceFromOther);
                        if (dist.distanceFromOther < 7){
                            currentState.moreEnemiesBehind = 1;
                        }
                    }
                    if (dist.distanceToOther !== null){
                      currentState.enemyPosFront.push(dist.distanceToOther);
                      if (dist.distanceToOther < 7){
                        currentState.moreEnemiesFront = 1;
                    }
                    }
                }else{
                    if (element.pos === ranges[pawnColor].start){
                        currentState.hitFriend = 1;
                    }
                }

            })
            let pawnNumber = this.checkPawnNumber(currentPawn, pawnColor);
            currentState.pawnNumber = pawnNumber;
            return currentState;
        }

        if (positions[currentPawn.pos].globe === true) currentState.atGlobe = 1;

        let newPos = currentPos + diceVal;
        if (newPos > ranges[pawnColor].end && (currentPos <= ranges[pawnColor].end) && currentPawn.homerun === false){
            currentState.justHitHomeRun = 1;
            newPos = newPos - ranges[pawnColor].end - 1;
            if (newPos === homeRuns[pawnColor].length) currentState.hitGoal = 1;
        }
        if (newPos >= positions.length){
            newPos = newPos - positions.length;
        }

        if (currentPawn.homerun === true){
            if (newPos === homeRuns[pawnColor].length) currentState.hitGoal = 1;
            else if (newPos > homeRuns[pawnColor].length){
                newPos = homeRuns[pawnColor].length - (newPos - homeRuns[pawnColor].length);
                currentState.bouncedOffGoal = 1;
            }
        }

        if (isNaN(currentPawn.pos)){
            return null;
        }

        const frontPawn = this.checkFrontPawn(currentPawn, pawnColor, currentPos, currentState.justHitHomeRun);
        (frontPawn === true ? currentState.inFront = 1 : currentState.inFront = 0);
        let pawnNumber = this.checkPawnNumber(currentPawn, pawnColor);
        currentState.pawnNumber = pawnNumber;

        if (currentPawn.homerun !== true && currentState.justHitHomeRun !== 1){
            pawns.forEach(element => {
                let otherPawnColor = element.id.substr(0, element.id.indexOf("pawn"));
                if (element.id !== pawnID && element.homerun !== true){
                    if (otherPawnColor !== pawnColor){
                        if (!(isNaN(element.pos))){
                            // Check distance to/from others in the state moved to
                            let dist = this.getDistanceFromPawn(currentPawn, element, pawnColor, otherPawnColor, newPos);
                            if (dist.distanceFromOther !== null){
                                if (dist.distanceFromOther === 0) {
                                    // If the element is positioned at a globe or a safe zone, the dice needs to hit 6 in order to knock it out
                                    if (positions[newPos].globe === true || element.pos === ranges[otherPawnColor].start){
                                        if (diceVal === 6){
                                            currentState.hitEnemy = 1;
                                        }else{
                                            currentState.knockedOutAtGlobe = 1;
                                        }
                                    }else{
                                        currentState.hitEnemy = 1;
                                    }
                                }
                                else currentState.enemyPosBehind.push(dist.distanceFromOther);
                            }
                            if (dist.distanceToOther !== null){
                                if (dist.distanceToOther === 0){
                                    // If the element is positioned at a globe or a safe zone, the dice needs to hit 6 in order to knock it out
                                    if (positions[newPos].globe === true || element.pos === ranges[otherPawnColor].start){
                                        if (diceVal === 6){
                                            currentState.hitEnemy = 1;
                                        }else{
                                            currentState.knockedOutAtGlobe = 1;
                                        }
                                    }else{
                                        currentState.hitEnemy = 1;
                                    }
                                }
                                else currentState.enemyPosFront.push(dist.distanceToOther);
                            }

                            // Check distance to others in previous state
                            let prevDist = this.getDistanceFromPawn(currentPawn, element, pawnColor, otherPawnColor, currentPawn.pos)
                            if (prevDist.distanceFromOther !== null){
                                currentState.previousEnemyPosBehind.push(prevDist.distanceFromOther);
                            }
                            if (prevDist.distanceToOther !== null){
                                currentState.previousEnemyPosFront.push(prevDist.distanceToOther);
                            }
                        }  
                    }else{
                        if (!(isNaN(element.pos))){
                            if (element.homerun !== true){
                                let dist = this.getDistanceFromPawn(currentPawn, element, pawnColor, otherPawnColor, newPos);
                                if (dist.distanceFromOther !== null){
                                    if (dist.distanceFromOther === 0) currentState.hitFriend = 1;
                                    else currentState.friendPosBehind.push(dist.distanceFromOther);
                                }
                                if (dist.distanceToOther !== null){
                                    if (dist.distanceToOther === 0) currentState.hitFriend = 1;
                                    else currentState.friendPosFront.push(dist.distanceToOther);
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
                if (Array.isArray(distToStar)){
                    distToStar.forEach(element => {
                        if (element === 0) currentState.atAStar = 1;
                        else currentState.distanceToStar.push(element);
                    });
                }else currentState.distanceToStar.push(distToStar);
            }
            const distToGlobe = this.getDistanceToGlobe(pawnColor, newPos);
            if (Array.isArray(distToGlobe)){
                distToGlobe.forEach(element => {
                    if (element === 0){
                        if (currentState.knockedOutAtGlobe !== 1) currentState.hitGlobe = 1;
                    }
                    else {currentState.distanceToGlobe.push(element)};
                });
            } else if (distToGlobe !== null){
                currentState.distanceToGlobe.push(distToGlobe);
            }
            const distanceToGoal = this.getDistanceToGoal(pawnColor, newPos);
            currentState.distanceToGoal = distanceToGoal;
            if (positions[currentPos].hasOwnProperty('homeSafe')) currentState.isAtEnemyHomeSafe = this.isAtEnemyHomeSafe();

            let differenceEnemies = this.getDifferenceInEnemyDistances(currentState.enemyPosFront, currentState.enemyPosBehind, currentState.previousEnemyPosBehind,
                currentState.previousEnemyPosFront, diceVal);
            if (differenceEnemies.differenceEnemiesFront > 0) currentState.moreEnemiesFront = 1;
            if (differenceEnemies.differenceEnemiesFront < 0) currentState.lessEnemiesFront = 1;
            if (differenceEnemies.differenceEnemiesBehind > 0) currentState.moreEnemiesBehind = 1;
            if (differenceEnemies.differenceEnemiesBehind < 0) currentState.lessEnemiesBehind = 1;
        }else{
            const state = this.getStatesAtHomeRun(currentPawn, pawnColor, newPos);
            state.distToPawns.forEach(element => {
                if (element < 0) currentState.friendPosBehind.push(-element);
                else currentState.friendPosFront.push(element);
                
            });
            currentState.hitFriend = state.hitFriend;
            currentState.distanceToGoal = state.distToGoal
        }
        if (currentState.hitEnemy === 1) currentState.differenceEnemiesFront++;

        return currentState;
    }

    // Check where the pawn is located relative to other pawns
    checkPawnNumber(pawn, pawnColor){
        let currentValue = 0; // In front of the row
        for (let i = 0; i < pawns.length; i++){
            if (pawnColor !== pawns[i].id.substr(0, pawns[i].id.indexOf("pawn"))) continue;
            if (pawn.pos === "home"){
                if (pawns[i].pos !== "home" && pawns[i].pos !== "goal") currentValue++;
            }else if (pawn.homerun === true){
                if (pawns[i].homerun === true && pawns[i].pos > pawn.pos) currentValue++;
            }else{  // If the pawn is placed at the main track
                if (pawns[i].pos > pawn.pos && ranges[pawnColor].end > pawns[i].pos) currentValue++;
                else if (pawns[i].pos < ranges[pawnColor].end && pawn.pos > ranges[pawnColor].end) currentValue++
                else if (pawns[i].homerun === true && pawns[i].pos !== "goal") currentValue++;
            }
        }
        return currentValue;
    }

    // Check if the pawn is number one in the row (OLD)
    checkFrontPawn(pawn, pawnColor, pos, homerun){
        for (let i = 0; i < pawns.length; i++){
            let otherColor = pawn.id.substr(0, pawn.id.indexOf("pawn"));
            if (otherColor !== pawnColor || pawns[i].id === pawn.id) continue;
            if (pawn.homerun === true){
                if (pawns[i].homerun === true && pawns[i].pos >= pos){
                    return false;
                }
            }else{
                if (pawns[i].pos >= pos || pawns[i].homerun === true) return false;
            }
        }
        return true;
    }

    // Check if the pawn just reached the safe zone
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

    getDifferenceInEnemyDistances(enemyPosFront, enemyPosBehind, prevEnemiesBehind, prevEnemiesFront){

        let previousEnemiesFront = prevEnemiesFront.filter(thres => thres < 7).length;   // All the reachable enemies
        let previousEnemiesBehind = prevEnemiesBehind.filter(thres => thres < 7).length; // All the enemies that can reach the pawn
        let newEnemiesFront = enemyPosFront.filter(thres => thres < 7).length;   // All the reachable enemies after move
        let newEnemiesBehind = enemyPosBehind.filter(thres => thres < 7).length;   // All the enemies that can reach the pawn after move
        const differenceEnemiesFront = newEnemiesFront - previousEnemiesFront;
        const differenceEnemiesBehind = newEnemiesBehind - previousEnemiesBehind;

        return {differenceEnemiesFront: differenceEnemiesFront, differenceEnemiesBehind: differenceEnemiesBehind};

    }

    getStatesAtHomeRun(pawn, currentColor, pos){
        let distToGoal = (5 - pos) / 58;
        let distToPawns = [];
        let hitFriend = 0;
        pawns.forEach(element => {
            let currentPos = pos;
            let counter = 0;
            if (element.id.substr(0, element.id.indexOf("pawn")) === currentColor){
                if ((!(isNaN(element.pos)) && (element.id !== pawn.id))){
                    if(element.homerun === true){
                        distToPawns.push(element.pos - pos);
                    }else{
                    //    if (pawn.homerun === true) counter  = currentPos + 1;
                     //   else 
                        counter = pos - ranges[currentColor].end;
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

        // Check if there is a friend at the pos
        for (let i = 0; i < distToPawns.length; i++){
            if (distToPawns[i] === 0){
                distToPawns.splice(i,1);
                hitFriend = 1;
            }
        }

        // The distance to homerun

        return {distToGoal: distToGoal, distToPawns: distToPawns, hitFriend: hitFriend};
    }

    getDistanceToGoal(color, pos){
        let currentPos = pos;
        let counter = 0;
        while(1){
            if (currentPos === ranges[color].end){
                return  (counter + 6) /58;
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
            if (counter === 0 && positions[currentPos].star === true) dist = counter;
            if (currentPos === ranges[color].end){
                break;
            }
            counter++;
            currentPos++;
            if (currentPos >= positions.length){
                currentPos = 0;
            }
            if (currentPos === ranges[color].end){
                break;
            }
            if (positions[currentPos].star === true){ 
                if (dist !== null) dist = [dist, counter];
                else dist = counter;
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
            if (p1 === p2) return 0;
            else if (p1 < p2) return p2 - p1;
            else return boardLength - p1 + p2;
        }

        const pawn1pos = pos;

        let currentPos = pos;
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