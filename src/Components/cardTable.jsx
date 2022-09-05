import React from 'react';
import Style from '../SearchPage.module.scss';

const spellColumn = (spell) => {
    return (
        <div>
            <h4>{spell.name}</h4>
            <div>{spell.desc}</div>
        </div>
    );
}

const buddyColumn = (buddy) => {
    return (
        <td key={buddy.name}>
            <div>
                <h4>{buddy.name}</h4>
                <div>{buddy.desc}</div>
            </div>
        </td>
    );
}

const row = (card) => {
    return (
        <tr key={card.name + card.desc}>
            <td>
                <div>{card.name}</div>
                <div>{card.desc}</div>
            </td>
            <td>{card.combatType}</td>
            <td>{spellColumn(card.spells[0])}</td>
            <td>{spellColumn(card.spells[1])}</td>
            <td>{card.duo}</td>
            {card.buddies.map(buddy => buddyColumn(buddy))}
        </tr>
    );
};

const cardTable = (props) => {

    const { filteredCards } = props;
    console.log('table Rerender');

    return (
        <table className={Style.searchTable}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Combat Type</th>
                    <th>Spell 1</th>
                    <th>Spell 2</th>
                    <th>DUO</th>
                    <th>Buddy 1</th>
                    <th>Buddy 2</th>
                    <th>Buddy 3</th>
                </tr>
            </thead>
            <tbody>
                {filteredCards.map((card) => {
                    return row(card);
                })}
            </tbody>
        </table>
    );
};

export default cardTable;