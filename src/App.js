import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import Cards from './Cards';

function App() {

  const r = c => Math.floor(Math.random() * c);
  const s = array => array[r(array.length)];

  const [cardSet, setCardSet] = useState("SNC");

  const [cards, setCards] = useState({
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
    packs: [],
    activepack: null,
    playerDeck: [],
  });

  const draftPack = () => {
    setCards({...cards, activepack: 0})
  }

  const buildPacks = () => {
    if (cards.common.length === 0) return;
    //while(this.common.length + this.uncommon.length + this.rare.length + this.mythic.length > 15) {
    for (let i = 0; i < 9; i++) {
      let pack = [];
      const selectCards = (amount, rarity) => {
          for (let i = 0; i < amount; i++) {
              let placement = r(cards[rarity].length);
              pack.push(cards[rarity].splice(placement, 1)[0]);
          }
      };
      selectCards(11, "common");
      selectCards(3, "uncommon");
      let rareslength = cards.rare.length + cards.mythic.length;
      let choice = r(rareslength);
      if (choice > cards.rare.length) {
          selectCards(1, "mythic");
      } else {
          selectCards(1, "rare");
      }
      cards.packs.push(pack);
    }
    //}
    setCards({...cards});
  }

  const load = () => {
    for (let i = 1; i <= 6; i++) {
      fetch(`https://api.magicthegathering.io/v1/cards?set=${cardSet}&page=${i}>`)
        .then(res => res.json())
        .then(data => {
          ["Mythic", "Rare", "Uncommon", "Common"].forEach((rarity) => {
            cards[rarity.toLowerCase()] = [...cards[rarity.toLowerCase()], ...data.cards.filter(card => card.rarity === rarity)]
            })
            setCards({...cards});
            console.log(cards);
          })
        .catch(err => console.log(err))
    } 
  }

  const selectCard = (key) => {
    cards.playerDeck.push(cards.packs[cards.activepack].splice(key, 1)[0])
    cards.packs.forEach((pack, index) => {if (index !== cards.activepack) pack.pop()});
    console.log(cards.activepack);
    console.log(cards.packs.length);
    if (cards.activepack === cards.packs.length - 1) {cards.activepack = 0} else {cards.activepack++}
    setCards({...cards});
    console.log(cards);
  }

  const sets = ['SNC', 'NEO', 'VOW'];

  return (
    <div className="App">
      <header className="App-header">
        <h1>MTG Drafter</h1>
        <nav>
          <div className="dropdown">
              <button className="dropbtn">Choose Set</button>
              <div className="dropdown-content">
                  {sets.map((set, index) => <button onClick={() => {setCardSet(set)}} key={index}>{set}</button>)}
              </div>
          </div>
          <button onClick={() => {load()}}>Load Set</button>
          <button onClick={() => {buildPacks()}}>Create Draft Pool</button>
          <button onClick={() => {draftPack()}}>Start Draft</button>
        </nav>
        <h2>Draft cards</h2>
        <Cards cards={cards.packs[cards.activepack]} method={selectCard}></Cards>
        <h2>Your Cards</h2>
        <Cards cards={cards.playerDeck}></Cards>
      </header>
    </div>
  );
}

export default App;
