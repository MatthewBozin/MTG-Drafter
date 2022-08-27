import React from 'react'

const Cards = (props) => {
  return (
    <div>
        {props.cards && (
            props.cards.map((card, index) => <img src={card.imageUrl} alt="" key={index} onClick={() => {props.method(index)}} />)
        )}
    </div>
  )
}

export default Cards