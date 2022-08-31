import './App.css';
import React, { useState } from "react";
import Cards from './Cards';

function App() {

  const r = c => Math.floor(Math.random() * c);

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

  const load = async () => {
    for (let i = 1; i <= 6; i++) {
      const res = await fetch(`https://api.magicthegathering.io/v1/cards?set=${cardSet}&page=${i}>`);
      const data = await res.json();
      ["Mythic", "Rare", "Uncommon", "Common"].forEach((rarity) => {
      cards[rarity.toLowerCase()] = [...cards[rarity.toLowerCase()], ...data.cards.filter(card => card.rarity === rarity)]
      })
      setCards({...cards});
      console.log(cards);
    } 
  }

  const selectCard = (key) => {
    cards.playerDeck.push(cards.packs[cards.activepack].splice(key, 1)[0])
    cards.packs.forEach((pack, index) => {if (index !== cards.activepack) pack.pop()});
    if (cards.activepack === cards.packs.length - 1) {cards.activepack = 0} else {cards.activepack++}
    setCards({...cards});
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
        {cards.activepack !== null && <h2>Draft cards</h2>}
        <Cards cards={cards.packs[cards.activepack]} method={selectCard}></Cards>
        {cards.activepack !== null && <h2>Your cards</h2>}
        <Cards cards={cards.playerDeck}></Cards>
      </header>
    </div>
  );
}

export default App;
