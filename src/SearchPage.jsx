import React from 'react';
import cards from './CardData';
import { useFormik, getIn } from 'formik';
import Style from './SearchPage.module.scss';

const effects = ["curse", "damage cut", "damage resistance", "power drain", "hp restoration", "damage boost", "hp regen", "evasion boost", "fire boost", "flora boost", "water boost", "cosmic boost", "debuff removal", "blind immunity", "power boost", "hp boost"];
var characterNames = [
    "",
    "Riddle_Rosehearts",
    "Ace_Trappola",
    "Deuce_Spade",
    "Cater_Diamond",
    "Trey_Clover",
    "Leona_Kingscholar",
    "Jack_Howl",
    "Ruggie_Bucchi",
    "Azul_Ashengrotto",
    "Jade_Leech",
    "Floyd_Leech",
    "Kalim_Al-Asim",
    "Jamil_Viper",
    "Vil_Schoenheit",
    "Epel_Felmier",
    "Rook_Hunt",
    "Idia_Shroud",
    "Ortho_Shroud",
    "Malleus_Draconia",
    "Sebek_Zigvolt",
    "Silver",
    "Lilia_Vanrouge",
];

var elements = ["Fire", "Flora", "Cosmic", "Water"];
var strengthLevels = ["major", "minor", "modest"];
var buddyEffects = ["power boost", "hp boost"];
var targets = ["caster", "allies", "foe"];
var turns = ["1", "2", "3"];
var rarity = ["", "SSR", "SR", "R"];

var buddyEffectIdPrefix = 'buddyEffect';
var spellEffectIdPrefix = 'spellEffect';

const duoCards = cards.filter(card => card.duo !== undefined);
const mutualDuos = duoCards.map((card) => {
    var mutualDuos = duoCards.filter(searchCard => card.duo === searchCard.name && searchCard.duo === card.name);
    return {
        card,
        mutualDuos
    }
}).filter(duos => duos.mutualDuos !== undefined && duos.mutualDuos.length > 0);

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
        <td>
            <div>
                <h4>{buddy.name}</h4>
                <div>{buddy.desc}</div>
            </div>
        </td>
    );
}

const row = (card) => {
    return (
        <tr>
            <td>{card.name}</td>
            <td>{card.desc}</td>
            <td>{card.combatType}</td>
            <td>{spellColumn(card.spells[0])}</td>
            <td>{spellColumn(card.spells[1])}</td>
            <td>{card.duo}</td>
            {card.buddies.map(buddy => buddyColumn(buddy))}
        </tr>
    );
};

function createFilterElement(desc, element, isCheckbox) {
    return <label>
        {element}
        {isCheckbox && desc}
    </label>;
};

function createDropdownElement(id, desc, options, onChangeHandler, values) {
    var select = <select value={values[id]} id={id} name={id} onChange={onChangeHandler} >
        {options.map(option => {
            return <option value={option}>{option}</option>
        })}
    </select>;

    return createFilterElement(desc, select, false);
}

function createCheckbox(id, onChangeHandler, values) {
    return <input type="checkbox" id={id} name={id} value={values[id]} onChange={onChangeHandler} />;
}

function createCheckboxGroup(idPrefix, options, onChangeHandler, values) {
    return options.map(option => {
        var checkbox = createCheckbox(idPrefix + "[" + option.replace(" ", "") + "]", onChangeHandler, values);
        return createFilterElement(option, checkbox, true);
    })
}

function createFilterAttributeSection(id, desc, options, isDropdown, onChangeHandler, values) {
    return <div className={Style.filterOption}>
        <h5>{desc}</h5>
        <div className={Style.filterOptionValues}>
            {isDropdown ? 
                createDropdownElement(id, desc, options, onChangeHandler, values) :
                createCheckboxGroup(id, options, onChangeHandler, values)
            }
        </div>
    </div>;
}

const filterSection = (values, onChangeHandler) => {
    return (
        <div class={Style.filterSection}>
            <div className={Style.basicFilters}>
                {createFilterElement('Cards With Mutual Duos', createCheckbox('mutualDuos', onChangeHandler, values), true)}
                <div class={Style.filterOptions}>
                    {createFilterAttributeSection('characterName', 'Character', characterNames, true, onChangeHandler, values)}
                    {createFilterAttributeSection('rarity', 'Rarity', rarity, true, onChangeHandler, values)}
                    {createFilterAttributeSection('duoBuddy', 'Duo Buddy', characterNames, true, onChangeHandler, values)}
                    {createFilterElement('Show Advanced Options', createCheckbox('showAdvancedOptions', onChangeHandler, values), true)}
                </div>
            </div>
            { values.showAdvancedOptions && <div className={Style.subFilters}>
                <div className={Style.buddyFilters}>
                    <h4>Buddy Effects</h4>
                    <div class={Style.filterOptions}>
                        {createFilterAttributeSection('buddy', 'Name', characterNames, true, onChangeHandler, values)}
                        {createFilterAttributeSection(buddyEffectIdPrefix, 'Effect', buddyEffects, false, onChangeHandler, values)}
                        {createFilterAttributeSection(buddyEffectIdPrefix, 'Strength', strengthLevels, false, onChangeHandler, values)}
                    </div>
                </div>
                <div className={Style.spellFilters}>
                    <h4>Spell Effects</h4>
                    <div class={Style.filterOptions}>
                        {createFilterAttributeSection(spellEffectIdPrefix, 'Effect', effects, false, onChangeHandler, values)}
                        {createFilterAttributeSection(spellEffectIdPrefix, 'Strength', strengthLevels, false, onChangeHandler, values)}
                        {createFilterAttributeSection(spellEffectIdPrefix, 'Turns', turns, false, onChangeHandler, values)}
                        {createFilterAttributeSection(spellEffectIdPrefix, 'Targets', targets, false, onChangeHandler, values)}
                        {createFilterAttributeSection(spellEffectIdPrefix, 'Element', elements, false, onChangeHandler, values)}
                    </div>
                </div>
            </div>}
        </div>
    );
};

const checkFilterValue = (id, cardValue, values) => {
    var formikVal = getIn(values, id);
    if ((formikVal !== '' && formikVal !== undefined)  && cardValue !== formikVal) {
        return false;
    }
    
    return true;
}

const checkCheckboxGroupFilterValue = (idPrefix, option, cardValue, values) => {
    var id = idPrefix + "[" + option.replace(" ", "") + "]";
    var isChecked = getIn(values, id);
    if (isChecked) {
        if (Array.isArray(cardValue)) {
            return cardValue.indexOf(option) !== -1;
        }
        else {
            return cardValue === option;
        }
    }

    return true;
}

const evaluateValueMatch = (option, cardValue) => {
    if (Array.isArray(cardValue)) {
        return cardValue.indexOf(option) !== -1;
    }
    else {
        return cardValue === option;
    }
}

const evaluateCheckboxGroupFilterValue = (idPrefix, baseId, options, cardValue, values) => {
    var pass = false;
    var allUnchecked = true;

    options.forEach(option => {
        var id = idPrefix + "[" + option.replace(" ", "") + "]";
        var isChecked = getIn(values, id);
        if (!isChecked) {
            return;
        }

        allUnchecked = false;
        if (Array.isArray(cardValue)) {
                cardValue.forEach(aValue => {
                    var effectResult = evaluateValueMatch(option, aValue[baseId]);
                    pass = pass || effectResult;
                });
        }
        else {
            var effectResult = evaluateValueMatch(option, cardValue);
            pass = pass || effectResult;
        }
    });

    return allUnchecked || pass;
}

const cardMatchesFilter = (card, values) => {
    var result = 
        checkFilterValue('characterName', card.name, values)
        && checkFilterValue('rarity', card.rarity, values)
        && checkFilterValue('duoBuddy', card.duo, values)
    ;

    if (!result) {
        return false;
    }

    // check buddies
    var doesAnyBuddyPass = false;

    card.buddies.forEach(buddy => {
        var doesBuddyPass = checkFilterValue('buddy', buddy.name, values);

        effects.forEach(effect => {
            var effectResult = checkCheckboxGroupFilterValue(buddyEffectIdPrefix, effect, buddy.effect, values);
            doesBuddyPass = doesBuddyPass && effectResult;
        });

        strengthLevels.forEach(strengthLevel => {
            var strengthResult = checkCheckboxGroupFilterValue(buddyEffectIdPrefix, strengthLevel, buddy.strength, values);
            doesBuddyPass = doesBuddyPass && strengthResult;
        });

        if (doesBuddyPass) {
            doesAnyBuddyPass = true;
        }
    });

    if (!doesAnyBuddyPass) {
        return false;
    }

    var doesAnySpellPass = false;

    card.spells.forEach(spell => {
        var doesSpellPass = true 
        && evaluateCheckboxGroupFilterValue(spellEffectIdPrefix, 'effect', effects, spell.effects, values)
        && evaluateCheckboxGroupFilterValue(spellEffectIdPrefix, 'strengths', strengthLevels, spell.effects, values)
        && evaluateCheckboxGroupFilterValue(spellEffectIdPrefix, 'turns', turns, spell.effects, values)
        && evaluateCheckboxGroupFilterValue(spellEffectIdPrefix, 'targets', targets, spell.effects, values)
        && evaluateCheckboxGroupFilterValue(spellEffectIdPrefix, 'element', elements, spell.element, values)
        ;

        if (doesSpellPass) {
            doesAnySpellPass = true;
        }
    });

    if (!doesAnySpellPass) {
        return false;
    }

    return true;
}

const filterCards = (cards, values) => {
    var searchCards = cards;
    if (values.mutualDuos) {
        searchCards = mutualDuos.map(duo => duo.card);
    }

    return searchCards.filter(card => cardMatchesFilter(card, values));
}

const SearchPage = () => {
    const formik = useFormik({
        initialValues: {}
    });


    const filteredCards = filterCards(cards, formik.values);

    return (
            <div className={Style.container}>
                <form>
                    {filterSection(formik.values, formik.handleChange)}
                    <hr></hr>
                </form>
                <table className={Style.searchTable}>
                    <thead>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Combat Type</th>
                        <th>Spell 1</th>
                        <th>Spell 2</th>
                        <th>DUO</th>
                        <th>Buddy 1</th>
                        <th>Buddy 2</th>
                        <th>Buddy 3</th>
                    </thead>
                    <tbody>
                        {filteredCards.map((card) => row(card))}
                    </tbody>
                </table>
            </div>
    );
}

export default SearchPage;