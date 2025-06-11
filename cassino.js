function RandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let numeroAleatorio = RandomNumber(2, 12);
console.log("Seu número da sorte é: " + numeroAleatorio);
console.log("Jogando dados...");

setTimeout(function () {
  let dado1 = RandomNumber(1, 6);
  console.log("Você tirou " + dado1 + " no primeiro dado!");

  setTimeout(function () {
      let dado2 = RandomNumber(1, 6);
      console.log("Você tirou " + dado2 + " no segundo dado!");

      setTimeout(function () {
        if(dado1 === dado2 | dado1 + dado2 === numeroAleatorio) {
          console.log("Parabéns! Você ganhou!");
        } else {
          console.log("Que pena! Você perdeu!");
        }
    }, 1000);
  }, 2000);
}, 2000);
