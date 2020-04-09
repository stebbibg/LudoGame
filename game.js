let gui = "on";
let winner = false;

// WHEN PLACED ON A STAR AND OTHER PAWNS MOVES FORWARD A WHOLE STAR IT IS NOT OUT

const currentDelay = 0;

const positions = [{x: 314, y: 683}, {x: 314, y: 633, homeSafe: "red"}, {x: 314, y: 583}, {x: 314, y: 538}, {x: 314, y: 490}, {x: 314, y: 441},
    {x: 277, y: 407, star: true}, {x: 231, y: 407}, {x: 183, y: 407}, {x: 135, y: 407, globe: true}, {x: 87, y: 407}, {x: 39, y: 407},
    {x: 39, y: 350, star: true}, {x: 39, y: 297}, 
    {x: 87, y: 297, homeSafe: "green"}, {x: 135, y: 297}, {x: 183, y: 297}, {x: 231, y: 297}, {x: 277, y: 297},
    {x: 314, y: 266, star: true}, {x: 314, y: 214}, {x: 314, y: 166}, {x: 314, y: 118, globe: true}, {x: 314, y: 70}, {x: 314, y: 22},
    {x: 367, y: 22, star: true}, {x: 424, y: 22},   
    {x: 424, y: 70, homeSafe: "yellow"}, {x: 424, y: 118}, {x: 424, y: 166}, {x: 424, y: 214}, {x: 424, y: 262},
    {x: 457, y: 297, star: true}, {x: 506, y: 297}, {x: 555, y: 297}, {x: 603, y: 297, globe: true}, {x: 651, y: 297},{x: 699, y: 297},
    {x: 699, y: 351, star:true}, {x: 699, y: 407}, 
    {x: 651, y: 407, homeSafe: "blue"}, {x: 603, y: 407}, {x: 555, y: 407}, {x: 506, y: 407},{x: 458, y: 407},
    {x: 424, y: 441, star: true}, {x: 424, y: 490}, {x: 424, y: 538}, {x: 424, y: 585, globe: true}, {x: 424, y: 635},{x: 424, y: 683},
    {x: 368, y: 683, star:true}];

const homeRuns = {red: [{x: 369, y: 635},{x: 369, y: 586},{x: 369, y: 538},{x: 369, y: 490},{x: 369, y: 442}],
                green: [{x: 87, y: 352},{x: 135, y: 352},{x: 183, y: 352},{x: 231, y: 352},{x: 279, y: 352}],
                yellow: [{x: 369, y: 70},{x: 369, y: 118},{x: 369, y: 166},{x: 369, y: 214},{x: 369, y: 263}],
                blue: [{x: 651, y: 352},{x: 603, y: 352},{x: 555, y: 352},{x: 507, y: 352},{x: 459, y: 352}]};

const ranges = // The start and end index in positions[]
    {blue: {start: 40, end: 38}, red:{start: 1, end: 51}, green:{start: 14, end: 12}, yellow: {start: 27, end: 25}};


let onboard = [];

const homes = [
    {id: "redpawn1", home: {x: 187, y: 624}}, {id: "redpawn2", home: {x: 221, y: 590}},  
    {id: "redpawn3", home: {x: 221, y: 659}}, {id: "redpawn4", home: {x: 255, y: 624}},
    {id: "greenpawn1", home: {x: 56, y: 190}}, {id: "greenpawn2", home: {x: 90, y: 155}},  
    {id: "greenpawn3", home: {x: 90, y: 224}}, {id: "greenpawn4", home: {x: 125, y: 190}},
    {id: "yellowpawn1", home: {x: 489, y: 73}}, {id: "yellowpawn2", home: {x: 523, y: 38}},  
    {id: "yellowpawn3", home: {x: 523, y: 107}}, {id: "yellowpawn4", home: {x: 558, y: 73}},
    {id: "bluepawn1", home: {x: 606, y: 496}}, {id: "bluepawn2", home: {x: 640, y: 462}},  
    {id: "bluepawn3", home: {x: 640, y: 531}}, {id: "bluepawn4", home: {x: 674, y: 496}}
]

let pawns = [
    {id: "redpawn1", pos: "home", homerun: false, goal: false}, {id: "redpawn2", pos: "home", homerun: false, goal: false},  
    {id: "redpawn3", pos: "home", homerun: false, goal: false}, {id: "redpawn4", pos: "home", homerun: false, goal: false},
    {id: "greenpawn1", pos: "home", homerun: false, goal: false}, {id: "greenpawn2", pos: "home", homerun: false, goal: false},  
    {id: "greenpawn3", pos: "home", homerun: false, goal: false}, {id: "greenpawn4", pos: "home", homerun: false,goal: false},
    {id: "yellowpawn1", pos: "home", homerun: false, goal: false}, {id: "yellowpawn2", pos: "home", homerun: false, goal: false},  
    {id: "yellowpawn3", pos: "home", homerun: false, goal: false}, {id: "yellowpawn4", pos: "home", homerun: false, goal: false},
    {id: "bluepawn1", pos: "home", homerun: false, goal: false}, {id: "bluepawn2", pos: "home", homerun: false, goal: false},  
    {id: "bluepawn3", pos: "home", homerun: false, goal: false}, {id: "bluepawn4", pos: "home", homerun: false, goal: false}
]

const players = ["red", "green", "blue", "yellow"];
let currentPlayer = 3;

class LudoGame{

    playManyGames(){
        const c = 10000000;
        let res = {green:0, red: 0, yellow: 0, blue: 0};
        for (let i = 0; i < c; i++){
            currentPlayer = Math.floor(Math.random() * 4);
            if (i % 10000 === 0){
                console.log(currentPlayer)
                console.log(res)
            }
            this.playRandomGame();
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
            this.resetGame();
        }

        console.log(res);
    }

    playRandomGame(){
        if (winner !== false){
            let status = document.getElementById('dice');
            dice.innerText = winner;
        }else{

        }
        /*
        let counter = 0;
        function makeDelay(t){
            if (winner !== false){
                return;
            }else{
                var _this = t;
                setTimeout(() => {
                    _this.makeRandomMove();
                    makeDelay(_this);
                }, currentDelay);
            }
        }
        makeDelay(this);
        */
       while(winner === false){
           this.makeRandomMove();
       }
        
    }

    checkIfFinished(color){
        let finished = true;
        pawns.forEach(function(item){
            let pawnColor = item.id.substr(0, item.id.indexOf("pawn"));
            if (item.goal === false && color === pawnColor){
                finished = false;
            }
        });
        if (finished === true){
            winner = color;
            let status = document.getElementById('gameStatus');
            status.innerText = winner;
        }
    }

    makeRandomMove(){
        const diceVal = this.throwDice(players[currentPlayer]);
        let player = this.chooseRandomPlayer(diceVal);
        if (diceVal !== 6){
            this.updateNextPlayer();
        }
        if (player === null){
            return;
        }
        this.movePawn(player,diceVal)
    }

    chooseRandomPlayer(val){
        if (val === 6){
            const possibleValues = pawns.filter(function(result) {
                return result.id.substr(0, result.id.indexOf("pawn")) === players[currentPlayer] && result.goal === false;
            });
            if (possibleValues.length === 0){
                return null;
            }
            const randomElement = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            return randomElement;
        }else{
            let possibleValues = onboard.filter(function(result) {
                return result.id.substr(0, result.id.indexOf("pawn")) === players[currentPlayer] && result.goal === false;
            });
            if (possibleValues.length === 0){
                return null;
            }
            const randomElement = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            return randomElement;
        }
    }

    throwDice(color){
        const diceValue = Math.floor(Math.random() * 6) + 1;

        if (gui === "on"){
            let dice = document.getElementById('dice');
            dice.innerText = diceValue;
            dice.style.color = players[currentPlayer];
        }
        return diceValue;
    }

    resetGame(){
        pawns.forEach(element => {
            let htmlEl = document.getElementById(element.id)
            element.pos = "home";
            element.homerun = false;
            element.goal = false;
            delete element.firstValue;
            htmlEl.style.visibility = 'visible';
        });
        currentPlayer = 0;
        winner = false;
        onboard = [];
        let status = document.getElementById('gameStatus');
        status.innerText = "";
        if (gui === "on"){
            this.updateGraphics();
        }
    }

    updateNextPlayer(){
        if (currentPlayer === players.length - 1){
            currentPlayer = 0;
        }else{
            currentPlayer++;
        }
    }

    movePawn(pawn, val){

        let currentPawn = findPawn(pawn.id);
        pawn = pawn.id;
        if (currentPawn.homerun === true){
            this.moveHomerun(pawn,val);
            return;
        }
        let currentPos = currentPawn.pos;
        let newPos;
        let color = pawn.substr(0,pawn.indexOf("pawn"));
        const lastIndex = ranges[color].end;
        if (currentPos === "home"){
            newPos = ranges[color].start;
            currentPawn.firstValue = true;
            onboard.push(currentPawn)
        }else{
            if ((currentPos + val > lastIndex) && (currentPos <= lastIndex) && (currentPawn.firstValue === false)){
                newPos = lastIndex;
                const mod = currentPos + val - lastIndex;
                if (mod > 0){
                    currentPawn.pos = -1;
                    this.moveHomerun(pawn,mod);
                    return;
                }
            }else{
                newPos = currentPos + val;
            }
            if (currentPawn.firstValue === true){
                currentPawn.firstValue = false;
            }
        }
        if (newPos >= positions.length){
            newPos = newPos - positions.length;
        }
        currentPawn.pos = newPos;
        this.checkPosition(currentPawn.id, newPos, val)
    }

    moveHomerun(pawn, val){
        // Now the pawn is on the end index and needs to be moved to the homerun
        let color = pawn.substr(0,pawn.indexOf("pawn"));
        let currentPawn = findPawn(pawn);
        currentPawn.homerun = true;
        if (currentPawn.pos + val === homeRuns[color].length){
            currentPawn.goal = true;
            currentPawn.pos = "goal"
            const index = onboard.findIndex(el => el.id === currentPawn.id);
            onboard.splice(index,1);
            this.checkIfFinished(color);
        }else if (currentPawn.pos + val > homeRuns[color].length){
            currentPawn.pos -= currentPawn.pos + val - homeRuns[color].length - 1;
        }else{
            currentPawn.pos += val;
        }
        this.updateGraphics();
    }

    checkPosition(pawn, pos, val){
        // If val = 6
        this.checkCollision(pawn, pos, val);
        this.checkStar(pawn,pos);
        this.updateGraphics();
    }

    checkStar(pawn, pos){
        let currentPos = pos;
        if (positions[pos].star === true && ranges[pawn.substr(0,pawn.indexOf("pawn"))].end !== pos){
            if (currentPos >= positions.length - 1){
                currentPos = 0;
            }else{
                currentPos++;
            }
            while (positions[currentPos].star !== true){
                if (currentPos >= positions.length - 1){
                    currentPos = 0;
                }else{
                    currentPos++;
                }
            }
            let currentPawn = findPawn(pawn);
            currentPawn.pos = currentPos;
            // Check if there is a collision on the new star, val is null since you 
            this.checkCollision(pawn, currentPawn.pos, null);
        }
    }

    checkCollision(pawn, pos,val){
        pawns.forEach(element => {
            if (element.pos === pos && (element.id !== pawn) && (element.homerun !== true)){
                let enemyColor = element.id.substr(0,element.id.indexOf("pawn"));
                if ((positions[pos].globe === true) || positions[pos].homeSafe === enemyColor){
                    if (val === 6){
                        this.sendHome(element.id);
                    }else{
                        this.sendHome(pawn);
                    }
                }else{
                    this.sendHome(element.id);
                }
            }
        });
    }

    updateGraphics(){

        if (gui === "off"){
            return;
        }
        pawns.forEach(element =>{
            let currentPawn = document.getElementById(element.id);
            if (element.pos === "home"){
                const pawnHome = homes.find(homeel => homeel.id === element.id);
                currentPawn.style.top = pawnHome.home.y + 'px';
                currentPawn.style.left = pawnHome.home.x + 'px';     
            }else{
                if (element.homerun === false){
                    let currentPawn = document.getElementById(element.id);
                    currentPawn.style.top = positions[element.pos].y + 'px';
                    currentPawn.style.left = positions[element.pos].x + 'px';
                }else{
                    let color = element.id.substr(0,element.id.indexOf("pawn"));
                    let currentPawn = document.getElementById(element.id);
                    if (element.pos !== -1 && element.pos !== "goal"){
                        currentPawn.style.top = homeRuns[color][element.pos].y + 'px';
                        currentPawn.style.left = homeRuns[color][element.pos].x + 'px';
                    }
                }
            }
            if (element.goal === true){
                currentPawn.style.visibility = "hidden";
            }
        })
    }

    sendHome(pawn){
        let thisPawn = findPawn(pawn);
        thisPawn.pos = "home";
        const index = onboard.findIndex(el => el.id === thisPawn.id);
        onboard.splice(index,1);
    }

}

function findPawn(id){
    for (let i = 0; i < pawns.length; i++){
        if (pawns[i].id === id){
            return pawns[i];
        }
    }
    return null;
}

function printMousePos(event) {
    console.log(event.clientX);
    console.log(event.clientY);
}
  
document.addEventListener("click", printMousePos);
