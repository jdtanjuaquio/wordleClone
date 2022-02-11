document.addEventListener("alpine:init", () => {
  Alpine.data("wordleGame", () => ({
    host: "http://localhost:5050/",
    wordle: "",

    init() {
      fetch(this.host + "word")
        .then((response) => response.json())
        .then((data) => {
          this.wordle = data.toUpperCase();
          console.log(data);
        })
        .catch((err) => console.error(err));
    },

    keys: [
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "ENTER",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      "<<",
    ],

    guessRows: [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ],

    currentRow: 0,
    currentTile: 0,

    async enteredKey(letter) {
      if (letter === "<<") {
        this.deleteLetter(letter);
        return;
      }

      if (letter === "ENTER") {
        const guessWord = this.guessRows[this.currentRow].join("");
        if (guessWord == "" || guessWord.length != 5) {
          return;
        }

        let exists = await fetch(this.host + "check?word=" + guessWord).then(
          (response) => response.json()
        );

        if (!exists) {
          alert("This word don't exists");
          reuturn;
        }

        this.enterGuess(guessWord);
        return;
      }

      if (this.currentTile >= 5 || this.currentRow >= 6) {
        return;
      }

      const tile = this.getCurrentTile(this.currentRow, this.currentTile);
      tile.textContent = letter;
      this.setLetter(letter, this.currentRow, this.currentTile);
      this.currentTile++;
    },

    enterGuess(guessWord) {
      this.flipTile(guessWord);
      if (guessWord == this.wordle) {
        setTimeout(() => {
          alert("congratulations! you've guess the word > " + this.wordle);
          document.location.reload();
        }, 100);
      }

      //Flip
      this.flipTile(guessWord);
      this.currentRow++;
      this.currentTile = 0;

      if (this.currentRow == 6) {
        alert("Game Over! the Word is ->" + this.wordle);
        document.location.reload();
      }
    },

    flipTile() {
      const guessWord = this.guessRows[this.currentRow];
      guessWord.forEach((letter, index) => {
        const tile = this.getCurrentTile(this.currentRow, index);
        const keyboard = document.getElementById(letter);
        if (letter == this.wordle[index]) {
          tile.classList.add("bg-green-600");
          keyboard.classList.add("bg-green-600");
        } else if (this.wordle.includes(letter)) {
          tile.classList.add("bg-yellow-600");
          keyboard.classList.add("bg-yellow-600");
        } else {
          tile.classList.add("bg-gray-600");
          keyboard.classList.add("bg-gray-600");
        }
      });
    },

    deleteLetter() {
      if (this.currentTile === 0) {
        return;
      }

      const tile = this.getCurrentTile(this.currentRow, this.currentTile - 1);
      tile.textContent = "";
      this.setLetter("", this.currentRow, this.currentTile - 1);
      this.currentTile--;
    },

    setLetter(letter, row, tile) {
      this.guessRows[row][tile] = letter;
    },

    getCurrentTile(row, tile) {
      return document.getElementById("row-" + row + "-tile-" + tile);
    },

    keyPress() {
      let letter = this.$event.key.toUpperCase();
      if (letter === "BACKSPACE") {
        letter = "<<";
      }

      if (!this.keys.includes(letter)) {
        return;
      }
      this.enteredKey(letter);
    },
  }));
});
