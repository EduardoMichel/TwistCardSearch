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
        <div key={buddy.name}>
            <h4>{buddy.name}</h4>
            <div>{buddy.desc}</div>
        </div>
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
            <td>
                <div className={Style.buddyContainer} >
                    {card.buddies.map(buddy => buddyColumn(buddy))}
                </div>
            </td>
        </tr>
    );
};

const cardTable = (props) => {

    const { filteredCards } = props;

    return (
        <table className={Style.searchTable}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Combat Type</th>
                    <th>Spell 1</th>
                    <th>Spell 2</th>
                    <th>DUO</th>
                    <th>Buddies</th>
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