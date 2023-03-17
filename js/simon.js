const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');

class Simon{
    constructor(simonButtons, startButton, round){
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 10;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = {
            startButton,
            round
        }
        this.errorSound = new Audio('./sound/error.wav');
        this.buttonSounds = [
            new Audio('./sound/1.mp3'),
            new Audio('./sound/2.mp3'),
            new Audio('./sound/3.mp3'),
            new Audio('./sound/4.mp3'),
        ]
    }

    //INICIA EL SIMON
    init(){
        this.display.startButton.onclick  = () => this.startGame();
    }

    //COMIENZA EL JUEGO
    startGame(){
        this.display.startButton.disabled = true;
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    //ACTUALIZA LA RONDA Y EL TABLERO
    updateRound(value){
        this.round = value;
        this.display.round.textContent = `Round ${this.round}`;
    }

    //CREAR EL ARRAY ALEATORIO DE BOTONES
    createSequence(){
        return Array.from({length: this.totalRounds},() => this.getRandomColor());
    }

    //DEVUELVE UN NUMERO AL AZAR ENTRE 0 Y 3
    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    //EJECUTA UNA FUNCION CUANDO SE HACE CLICK EN UN BOTON
    buttonClick(value){
        !this.blockedButtons && this.validateChosenColor(value);

    }

    //VALIDAR SI EL BOTON QUE TOCA EL USUARIO CORRESPONDE A EL VALOR DE LA SECUENCIA
    validateChosenColor(value){
        if(this.sequence[this.userPosition] === value){
            this.buttonSounds[value].play();
            if(this.round === this.userPosition){
                this.updateRound(this.round + 1);
                this.speed /= 1.02;
                this.isGameOver();
            }else{
                this.userPosition++;
            }
        }else{
            this.gameLost();
        }
    }

    //VERIFICA QUE NO HATA ACABADO EL JUEGO
    isGameOver(){
        if(this.round === this.totalRounds){
            this.gameWon();
        }else{
            this.userPosition = 0;
            this.showSequence();
        }
    }

    //MUESTRA LA SECUENCIA DE BOTONES QUE VA A TENER QUE TOCAR EL USUARIO
    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button)
            setTimeout( () => this.toggleButtonStyle(button), this.speed / 2)
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

        //PINTA LOS BOTONES PARA CUANDO SE ESTA MOSTRANDO LA SECUENCIA
        toggleButtonStyle(button) {
            button.classList.toggle('active');
        }
        

        //ACTUALIZA EL SIMON CUANDO EL JUGADOR PIERDE
        gameLost() {
            this.errorSound.play();
            this.display.startButton.disabled = false; 
            this.blockedButtons = true;
        }

        //MUESTRA LA ANIMACION DE TRINFO Y ACTUALIZA EL SIMON 
        gameWon() {
            this.display.startButton.disabled = false; 
            this.blockedButtons = true;
            this.buttons.forEach(element =>{
                element.classList.add('winner');
            });
            this.updateRound('🏆');
        }
    }
    const simon = new Simon(simonButtons, startButton, round);
    simon.init();