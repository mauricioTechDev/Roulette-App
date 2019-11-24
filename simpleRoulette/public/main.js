document.querySelector(".submit").onclick = function(){
  let number = document.querySelector(".number").value
  let color = document.querySelector(".color").value
  let bet = Number(document.querySelector(".bet").value)
  let compNum = Math.ceil(Math.random()*20)
  let compColor = (Math.floor(Math.random()*100))%2==0 ? "red" : "black"
  if((number==compNum)&&(color===compColor)){
    var result = "win"
    bet*= -2
    document.querySelector("span").textContent-= bet
    fetch('game', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'winning': 1,//number here doesn't matter
        'bet': (bet*-1)
      })
    })
    .then(function (response) {
      document.querySelector("h3").textContent = result
    })
  }else{
    var result = "lose"
    document.querySelector("span").textContent-= bet
    fetch('game', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'losing': 1,//number here doesn't matter
        'bet': bet
      })
    })
    .then(function (response) {
      document.querySelector("h3").textContent = result
    })
  }
}
