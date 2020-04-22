class Population{
    constructor(totalSize, noDNA){

        function dec2bin(dec){
            return (dec >>> 0).toString(2);
        }

        var dna = [];
        var _pop = [];
        for (let i = 0; i < totalSize; i++){
            var dna = [];
            for (let j = 0; j < 4; j++){
                var pawnDNA = [];
                for (let k = 0; k < noDNA; k++){
                    /*
                    let randomDNA = dec2bin(Math.floor(Math.random() * 16));   // 4 bit gene
                    let pad = 4 - randomDNA.length;
                    let padstring = "";
                    for (let j = 0; j < pad; j++){
                        padstring += "0";
                    }
                    
                    randomDNA = Math.round(Math.random()) + padstring + randomDNA; // Positive or negative sign in front
                    */
                //    let randomDNA = Math.sign(Math.random() - 0.5) * Math.floor(Math.random() * Math.floor(127));
                    let randomDNA = Math.random();
                    pawnDNA.push(randomDNA);
                }
                dna.push({pawnDNA: pawnDNA, pawnNo: j});
            }
            _pop.push(dna);
        }
        this.getPopulation = function(){return _pop;};
        this.setPopulation = function(p){ _pop = p; };
    }



}