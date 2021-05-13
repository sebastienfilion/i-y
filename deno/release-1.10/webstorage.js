const colour = window.localStorage.getItem("favouriteColour");
if (colour) console.log(`Your favourite colour is ${colour}`)
else
  window.localStorage.setItem("favouriteColour", prompt("What is your favourite colour?"));
