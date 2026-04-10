const cardWraps = document.querySelectorAll(".cardWrap");
const fieldWrap = document.querySelector(".fieldWrap");

// const cardDataBase = [
//     // ダイヤの1〜6
//     { num: 1, src: "img/diamond1F.png" },
//     { num: 2, src: "img/diamond2F.png" },
//     { num: 3, src: "img/diamond3F.png" },
//     { num: 4, src: "img/diamond4F.png" },
//     { num: 5, src: "img/diamond5F.png" },
//     { num: 6, src: "img/diamond6F.png" },
    
//     // スペードの1〜6
//     { num: 1, src: "img/spade1F.png" },
//     { num: 2, src: "img/spade2F.png" },
//     { num: 3, src: "img/spade3F.png" },
//     { num: 4, src: "img/spade4F.png" },
//     { num: 5, src: "img/spade5F.png" },
//     { num: 6, src: "img/spade6F.png" }
// ];

const marks = ["diamond", "spade", "clover", "heart"];
const cardDataBase = [];

// 4つのマーク × 13枚 をループで作成
marks.forEach(mark => {
    for (let i = 1; i <= 13; i++) {
        cardDataBase.push({
            num: i,
            src: `img/${mark}${i}F.png`
        });
    }
});

console.log(cardDataBase); // 52枚分入っているか確認！

let cardData = [];
function dataShuffle(){
    cardData = [];
    for(let i = 0; i < cardDataBase.length; i++){
        cardData.push(cardDataBase[i]);
    }
    // console.log(cardData);
    for(let i = cardData.length - 1; i >= 0; i--){
        let j = Math.floor(Math.random() * i);

        let temp = cardData[i];
        cardData[i] = cardData[j];
        cardData[j] = temp;
    }
    return cardData;
}
console.log(dataShuffle());


for(let i = 0; i < cardData.length; i++){
    fieldWrap.innerHTML += `
        <div class="cardWrap">
            <p>
                <img src="img/card_back.png" 
                alt="カードB" 
                class="cardBack" 
                onclick="reverse(this)" 
                data-id="${i}">
            </p>
        </div>
    `;
}

// dataShuffle();


const cardBacks = document.querySelectorAll(".cardBack");
// console.log(cardBacks);
// cardBacks.forEach((cardBack)=>{
//     console.log(cardBack);
// });


let flippedCards = [];
let count1 = 0;
let count2 = 0;
const count1Txt = document.querySelector(".count1");
const count2Txt = document.querySelector(".count2");


function reverse(card){
    // cardDataの配列の番号
    const cardId = card.dataset.id

    // 画像のパス名
    console.log(cardData[cardId].src);

    // 裏向きのカードを裏返す(表向きの場合は何もしない)
    if(card.src.includes("img/card_back.png")){
        card.src = cardData[cardId].src;
    } else if(!card.src.includes("img/card_back.png")) return;

    // cardDataのオブジェクトを配列に保存
    flippedCards.push(cardData[cardId]);
    flippedCards.push(cardId);
    console.log(flippedCards);

    if(flippedCards.length === 4){
        checkMatch();
        // setTimeout(() => {
        //     cardBacks.forEach((cardBack)=>{
        //         console.log(cardBack.dataset.id);
        //         cardBack.src = "img/card_back.png";
        //         cardBack.style.display = `none`;
        //     });
        // },1000);
        flippedCards = [];
    }
}

let currentPlayer = 1; // 現在のプレイヤー (1 or 2)
let scores = { player1: 0, player2: 0 }; // スコアもついでに管理
const turn1 = document.querySelector(".turn1");
const turn2 = document.querySelector(".turn2");
// console.log(turn1);

let clearCount = 0;

function checkMatch(){
    // cardDataのオブジェクト
    const card1 = flippedCards[0];
    const card1Id = flippedCards[1];
    const card2 = flippedCards[2];
    const card2Id = flippedCards[3];
    console.log(card1Id);
    console.log(card2Id);

    if(card1.num === card2.num){
        scores[`player${currentPlayer}`] = scores[`player${currentPlayer}`] + 2;
        console.log(`あたり！`);
        // count1 = count1 + 2;
        // console.log(count1);
        if(currentPlayer === 1){
            count1Txt.textContent = `${scores[`player${currentPlayer}`]}枚`;
        } else if(currentPlayer === 2){
            count2Txt.textContent = `${scores[`player${currentPlayer}`]}枚`;
        }
        
        clearCount++;

        setTimeout(() => {
            cardBacks.forEach((cardBack)=>{
                console.log(cardBack.dataset.id);
                if(card1Id === cardBack.dataset.id || card2Id === cardBack.dataset.id){
                    cardBack.style.display = `none`;
                }
                // cardBack.src = "img/card_back.png";
            });
            if(clearCount === cardData.length / 2){
                showResult();
            }
        },1000);
    } else{
        console.log(`はずれ！`);
        setTimeout(() => {
            cardBacks.forEach((cardBack)=>{
                console.log(cardBack.dataset.id);
                if(card1Id === cardBack.dataset.id || card2Id === cardBack.dataset.id){
                    cardBack.src = "img/card_back.png";
                }
            });
            // ここでプレイヤーを変更する
            if(currentPlayer === 1){
                turn1.classList.remove(`active`);
                turn2.classList.add(`active`);
            } else if(currentPlayer === 2){
                turn1.classList.add(`active`);
                turn2.classList.remove(`active`);
            }
            currentPlayer = (currentPlayer === 1) ? 2 : 1;
            console.log(`次はプレイヤー${currentPlayer}の番です`);
        },1000);
    }
}

function showResult() {
    let message = "";
    if (scores.player1 > scores.player2) {
        message = "🎉 プレイヤー1の勝利！";
    } else if (scores.player2 > scores.player1) {
        message = "🎉 プレイヤー2の勝利！";
    } else {
        message = "🤝 引き分け！いい勝負でした";
    }
    
    // 画面にメッセージを出す
    alert(`【結果発表】\n${message}\nP1: ${scores.player1}枚 / P2: ${scores.player2}枚`);
    
    // もっとリッチにするなら、リセットボタンを表示させる
}