<template>
  <div>

    <div :class="`player ${game.points[0] < game.points[1] ? 'loser' : 'winner'}`">
      <span>Player:</span>
      <span class="points">{{ game.points[0] }}</span>
    </div>

    <div :class="`params ${isGameOver ? 'visible' : 'unvisible'}`">
      <div class="param">
        <p>Level:</p>
        <input type="radio" v-model="level" value="computerTurn" id="easy" :disabled="!isGameOver"/>
        <label for="easy">Easy</label>
        <input type="radio" v-model="level" value="computerHardTurn" id="hard" :disabled="!isGameOver"/>
        <label for="hard">Hard</label>
      </div>
      <div class="param">
        <input type="radio" v-model="player" value="o" id="o" :disabled="!isGameOver"/>
        <label for="o">O</label>
        <input type="radio" v-model="player" value="x" id="x" :disabled="!isGameOver"/>
        <label for="x">X</label>
      </div>
    </div>

    <div :class="`computer ${game.points[1] < game.points[0] ? 'loser' : 'winner'}`">
      <span>Computer:</span>
      <span class="points">{{ game.points[1] }}</span>
    </div>

    <div :class="!isGameOver && !gameStarted ? 'visible' : 'unvisible'">
      <transition name="turn-help" mode="out-in">
        <div class="turn-help" v-if="player === round.currTurn" key="player">
          Your turn
        </div>
        <div class="turn-help" v-else key="computer">
          Computer turn
        </div>
      </transition>
    </div>

    <transition name="cell-container">
      <div v-if="round.field">
        <div v-for="(i, index1) in round.field" :key="index1" class="cell-row">
          <input
            :class="`cell ${!k.value || gameStarted ? 'cell-empty' : ''} ${isGameOver ? 'game-over' : ''}`"
            v-for="(k, index2) in i"
            type="button"
            @click="turn(k)"
            :disabled="isGameOver"
            :key="index2"
            :value="k.value || player"
          />
        </div>
      </div>
    </transition>

    <transition name="result" :duration="{ enter: 300, leave: 300 }">
      <div v-if="isGameOver" class="result">{{ result }}</div>
    </transition>

    <transition name="new-game" :duration="{ enter: 2000, leave: 300 }">
      <div v-if="isGameOver">
        <input class="new-game" type="button" @click="newRound()" value="NEW GAME"/>
      </div>
    </transition>

  </div>
</template>

<script>
import Game from '../models/Game'

export default {
  data () {
    return {
      game: {},
      round: {},
      gameStarted: false,
      isGameOver: true,
      isGame: false,
      result: '',
      player: 'o',
      level: 'computerTurn',
    }
  },
  created() {
    this.game = new Game();
  },
  watch: {
    'round.currTurn'() {
      if (this.round.currTurn !== this.player) {
        // imitation thinking
        setTimeout(() => {
          this.setResult(this.round[this.level]());
        }, 600)
      }
    }
  },
  methods: {
    newRound() {
      this.isGame = true;
      this.isGameOver = false;
      this.gameStarted = true;

      setTimeout(() => {
        this.round = this.game.newRound(this.player);
        if (this.round.currTurn !== this.player) {
          this.setResult(this.round[this.level]());
        }
        this.gameStarted = false;
      }, 500);
    },
    turn(cell) {
      if (this.isGameOver || cell.value || this.round.currTurn !== this.player) {
        return;
      }
      this.setResult(this.round.turn(cell));      
    },
    setResult(result) {
      switch(result) {
        case 'next': {
          break;
        }
        case 'player': {
          this.game.points[0]++;
          this.result = 'YOU WIN';
          this.isGameOver = true;
          break;
        }
        case 'computer': {
          this.game.points[1]++;
          this.result = 'COMPUTER WIN';
          this.isGameOver = true;
          break;
        }
        case 'draw': {
          this.game.points[0]++;
          this.game.points[1]++;
          this.result = 'DRAW';
          this.isGameOver = true;
          break;
        }
        default: {
          console.log('Error in set result');
          break;
        }
      }
    }
  }
}
</script>

<style scoped>
input[type="button"] {
  cursor: pointer;
}
input[type="radio"] {
  position: absolute;
  z-index: -1;
  opacity: 0;
  margin: 10px 0 0 7px;
}
input[type="radio"] + label {
  position: relative;
  padding: 0 0 0 35px;
  cursor: pointer;
  margin-right: 10px;
}
input[type="radio"] + label:before {
  content: '';
  position: absolute;
  top: -3px;
  left: 0;
  width: 22px;
  height: 22px;
  border: 1px solid #CDD1DA;
  border-radius: 50%;
  background: #FFF;
}
input[type="radio"] + label:after {
  content: '';
  position: absolute;
  top: 1px;
  left: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #8c84f8;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.5);
  opacity: 0;
  transition: .2s;
}
input[type="radio"]:checked + label:after {
  opacity: 1;
}
input:focus {
  outline: none;
}

@media screen and (max-width: 599px) {
  .player {
    top: 20px;
    left: 10px;
  }
  .computer {
    top: 20px;
    right: 10px;
  }
  .winner {
    font-size: 20px;
  }
  .loser {
    font-size: 18px;
  }
}

@media screen and (min-width: 600px) {
  .player {
    top: 20px;
    left: 40px;
  }
  .computer {
    top: 20px;
    right: 40px;
  }
  .winner {
    font-size: 40px;
  }
  .loser {
    font-size: 32px;
  }
}

.player, .computer {
  position: fixed;
}
.winner {
  color: #41c553;
}
.loser {
  color: #db6464;
}

.cell-container {
  margin-top: 10px;
}
.cell-empty {
  color: transparent;
  transition: 300ms ease-out;
}
.cell-empty:hover:not(.game-over) {
  color: green;
  transition: 300ms ease-in;
}

.cell {
  width: 85px;
  height: 85px;
  background-color: transparent;
  font-size: 50px;
  font-weight: thin;
  border: 1px solid black;
  transition: 300ms ease-out;
}

.cell:nth-child(1) {
  border-left: none;
}
.cell:nth-last-child(1) {
  border-right: none;
}
.cell-row:nth-child(1) .cell {
  border-top: none;
}
.cell-row:nth-last-child(1) .cell {
  border-bottom: none;
}

.new-game {
  padding: 10px;
  background-color: transparent;
  border: 1px solid black;
  border-radius: 5px;
}
.new-game:hover {
  background-color: #e2f0ff;
}
.result {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 40px;
}
.turn-help {
  padding: 10px;
  font-size: 20px;
}

.params {
  margin-top: 15px;
  margin-bottom: 5px;
  display: inline-block;
}
.param {
  display: inline-block;
  padding: 7px;
}

.visible {
  opacity: 1;
  transition: opacity 1s ease-in-out;
}
.unvisible {
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.cell-container-enter {
  transform: scale(0);
}
.cell-container-enter-to {
  transform: scale(1);
  transition: transform 700ms ease;
}

.result-enter {
  opacity: 0;
}
.result-enter-to {
  opacity: 1;
  transform: scale(1.5);
  transition: all 300ms ease-in;
}
.result-leave-to {
  opacity: 0;
  transform: scale(0);
  transition: all 300ms ease-out;
}

.new-game-enter {
  opacity: 0;
}
.new-game-enter-to {
  opacity: 1;
  transition: opacity 2000ms ease-in-out;
}
.new-game-leave-to {
  opacity: 0;
  transition: opacity 300ms ease-in;
}

.turn-help-enter {
  opacity: 0;
  transform: translateX(30px);
}
.turn-help-enter-to {
  opacity: 1;
  transform: translateX(0);
  transition: all 200ms ease;
}
.turn-help-leave-to {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 200ms ease;
}

</style>
