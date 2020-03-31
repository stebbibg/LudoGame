class States{
    getState(pawnID){
        let currentState = {
            friendPosBehind: [], 
            friendPosFront: [], 
            enemyPosBehind: [], 
            enemyPosFront: [], 
            distanceToStar: [], 
            distanceToGlobe: [],
            distanceToGoal: []
        };
        let currentPawn = findPawn(pawnID)
        if (isNaN(currentPawn.pos)){
            return null;
        }
        let pawnColor = pawnID.substr(0, pawnID.indexOf("pawn"));
        pawns.forEach(element => {
            let otherPawnColor = element.id.substr(0, element.id.indexOf("pawn"));
            if (element.id !== pawnID){
                if (otherPawnColor !== pawnColor){
                    console.log(element.homerun)
                    if (!(isNaN(element.pos) && element.homerun !== true)){
                        let dist = this.getDistanceFromPawn(currentPawn, element, pawnColor, otherPawnColor);
                        (dist > 0 ? currentState.enemyPosFront.push(dist) : currentState.enemyPosBehind.push(-dist));
                    }  
                }
            }
        });
        console.log(currentState)
    }

    getDistanceFromPawn(pawn1, pawn2, currentColor, otherPawnColor){
        // Recalculate the range so that the currentPawn is positioned at 0
        let boardLength = positions.length;

        let pawn1End = ranges[currentColor].end;
        let pawn2End = ranges[otherPawnColor].end;
        let distanceEnd1, distanceEnd2; // Distance from pawn1 to end and pawn2 to end
        if (pawn1End < pawn1.pos){
            distanceEnd1 = boardLength - pawn1.pos + pawn1End;
        }else{
            distanceEnd1 = pawn1End - pawn1.pos;
        }

        if (pawn2End < pawn2.pos){
            distanceEnd2 = boardLength - pawn2.pos + pawn2End;
        }else{
            distanceEnd2 = pawn2End - pawn2.pos;
        }

        // Now find the distance from pawn1 to pawn2
        // If pawn2 is in front of pawn1
        if (pawn1.pos < pawn2.pos){
            if (distanceEnd1 > (pawn2.pos - pawn1.pos)){
                console.log(pawn2.pos - pawn1.pos)
                return pawn2.pos - pawn1.pos;
            }
            else{
                if (distanceEnd2 < -(pawn2.pos - pawn1.pos - boardLength)){
                    return null
                }else{
                    console.log(pawn1);
                    console.log(pawn2)
                    console.log(boardLength)
                    console.log(pawn2.pos - pawn1.pos - boardLength)
                    return pawn2.pos - pawn1.pos - boardLength; 
                }
            }
        }else{
            if (distanceEnd2 < (pawn1.pos - pawn2.pos)){
                console.log(-(pawn1.pos - pawn2.pos))
                return (-(pawn1.pos - pawn2.pos));
            }else{
                console.log(pawn2.pos + boardLength - pawn1.pos)
                return pawn2.pos + boardLength - pawn1.pos;
            }
        }
        
        return null;
    }

}