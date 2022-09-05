import React, { useState } from 'react';
import cards from './CardData';
import { useFormik, getIn } from 'formik';
import Style from './SearchPage.module.scss';
import { SwipeableDrawer, Fab, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import CardTable from './Components/cardTable';

const anyValue = "Any";
const effects = ["curse", "damage cut", "damage resistance", "power drain", "hp restoration", "damage boost", "hp regen", "evasion boost", "fire boost", "flora boost", "water boost", "cosmic boost", "debuff removal", "blind immunity", "power boost", "hp boost"];
var characterNames = [
    anyValue,
    "Riddle Rosehearts",
    "Ace Trappola",
    "Deuce Spade",
    "Cater Diamond",
    "Trey Clover",
    "Leona Kingscholar",
    "Jack Howl",
    "Ruggie Bucchi",
    "Azul Ashengrotto",
    "Jade Leech",
    "Floyd Leech",
    "Kalim Al-Asim",
    "Jamil Viper",
    "Vil Schoenheit",
    "Epel Felmier",
    "Rook Hunt",
    "Idia Shroud",
    "Ortho Shroud",
    "Malleus Draconia",
    "Sebek Zigvolt",
    "Silver",
    "Lilia Vanrouge",
];

var combatTypes = [
    "Attack",
    "Defense",
    "Balanced"
];

var elements = ["Fire", "Flora", "Cosmic", "Water"];
var strengthLevels = ["major", "minor", "modest"];
var buddyEffects = ["power boost", "hp boost"];
var targets = ["caster", "allies", "foe"];
var turns = ["1", "2", "3"];
var rarity = [anyValue, "SSR", "SR", "R"];

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

function createFilterElement(desc, element, isCheckbox) {
    return element;
};

function createDropdownElement(id, desc, options, onChangeHandler, values) {
    var select = <Select
        value={values[id] || anyValue} 
        id={id}
        name={id}
        onChange={onChangeHandler}
    >
        {options.map(option => {
            return <MenuItem className={Style.dropdownItem} key={option} value={option}>{option}</MenuItem>
        })}
    </Select>

    return createFilterElement(desc, select, false);
}

function createCheckbox(id, option, onChangeHandler, values) {
    var value = getIn(values, id) || false;
    var checkbox = <Checkbox id={id} name={id} checked={value} onChange={onChangeHandler} value={value} />;
    return <FormControlLabel key={id} label={option} control={checkbox}></FormControlLabel>;
}

function createCheckboxGroup(idPrefix, options, onChangeHandler, values) {
    return options.map(option => {
        var checkbox = createCheckbox(idPrefix + "." + option.replace(" ", ""), option, onChangeHandler, values);
        return createFilterElement(option, checkbox, false);
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
        <div className={Style.filterSection}>
            <div className={Style.basicFilters}>
                {createFilterElement('Cards With Mutual Duos', createCheckbox('mutualDuos', 'Cards With Mutual Duos', onChangeHandler, values), true)}
                <div className={Style.filterOptions}>
                    {createFilterAttributeSection('characterName', 'Character', characterNames, true, onChangeHandler, values)}
                    {createFilterAttributeSection('rarity', 'Rarity', rarity, true, onChangeHandler, values)}
                    {createFilterAttributeSection('combatType', 'Combat Type', combatTypes, false, onChangeHandler, values)}
                    {createFilterAttributeSection('duoBuddy', 'Duo Buddy', characterNames, true, onChangeHandler, values)}
                </div>
            </div>
            <div className={Style.buddyFilters}>
                <h3>Buddy Effects</h3>
                <div className={Style.filterOptions}>
                    {createFilterAttributeSection('buddy', 'Name', characterNames, true, onChangeHandler, values)}
                    {createFilterAttributeSection(buddyEffectIdPrefix, 'Effect', buddyEffects, false, onChangeHandler, values)}
                    {createFilterAttributeSection(buddyEffectIdPrefix, 'Strength', strengthLevels, false, onChangeHandler, values)}
                </div>
            </div>
            <div className={Style.spellFilters}>
                <h3>Spell Effects</h3>
                <div className={Style.filterOptions}>
                    {createFilterAttributeSection(spellEffectIdPrefix, 'Effect', effects, false, onChangeHandler, values)}
                    {createFilterAttributeSection(spellEffectIdPrefix, 'Strength', strengthLevels, false, onChangeHandler, values)}
                    {createFilterAttributeSection(spellEffectIdPrefix, 'Turns', turns, false, onChangeHandler, values)}
                    {createFilterAttributeSection(spellEffectIdPrefix, 'Targets', targets, false, onChangeHandler, values)}
                    {createFilterAttributeSection(spellEffectIdPrefix, 'Element', elements, false, onChangeHandler, values)}
                </div>
            </div>
        </div>
    );
};

const toggleFilterDrawer = (toggle, setFieldValue) => {
    setFieldValue('displayToggleFilter', toggle);
}

const checkFilterValue = (id, cardValue, values) => {
    var formikVal = getIn(values, id);
    if ((formikVal !== anyValue && formikVal !== undefined)  && cardValue !== formikVal) {
        return false;
    }
    
    return true;
}

const checkCheckboxGroupFilterValue = (idPrefix, option, cardValue, values) => {
    var id = idPrefix + "." + option.replace(" ", "");
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
        var isChecked = isCheckboxChecked(id, values);
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

const isCheckboxChecked = (id, values) => {
    return getIn(values, id) || false;
}

const cardMatchesFilter = (card, values) => {
    var result = 
        checkFilterValue('characterName', card.name, values)
        && checkFilterValue('rarity', card.rarity, values)
        && checkFilterValue('duoBuddy', card.duo, values)
        && evaluateCheckboxGroupFilterValue('combatType', 'combatType', combatTypes, card.combatType, values)
    ;

    if (!result) {
        return false;
    }

    // check buddies
    var doesAnyBuddyPass = false;

    card.buddies.forEach(buddy => {
        var doesBuddyPass = checkFilterValue('buddy', buddy.name, values);

        if (!doesBuddyPass) {
            return;
        }

        effects.forEach(effect => {
            var effectResult = checkCheckboxGroupFilterValue(buddyEffectIdPrefix, effect, buddy.effect, values);
            doesBuddyPass = doesBuddyPass && effectResult;
        });

        if (!doesBuddyPass) {
            return;
        }

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
    if (isCheckboxChecked('mutualDuos', values)) {
        searchCards = mutualDuos.map(duo => duo.card);
    }

    return searchCards.filter(card => cardMatchesFilter(card, values));
}

const SearchPage = () => {
    const formik = useFormik({
        initialValues: {},
    });

    const [ filteredCards, setFilteredCards ] = useState([]);

    const newFilteredCards = filterCards(cards, formik.values);

    if (JSON.stringify(filteredCards) !== JSON.stringify(newFilteredCards)){
        setFilteredCards(newFilteredCards);
    }

    return (
            <div className={Style.container}>
                <SwipeableDrawer 
                    className={Style.Drawer}
                    anchor="left" 
                    open={formik.values.displayToggleFilter || false} 
                    onOpen={() => { toggleFilterDrawer(!formik.values.displayToggleFilter, formik.setFieldValue)}}
                    onClose={() => { toggleFilterDrawer(!formik.values.displayToggleFilter, formik.setFieldValue)}}
                >
                    <form>
                        {filterSection(formik.values, formik.handleChange)}
                    </form>
                </SwipeableDrawer>

                <CardTable key={'cardTable'} filteredCards={filteredCards} /> 
                
                <Fab 
                    className={Style.filterFab}
                    color="secondary" 
                    aria-label="filter" 
                    onClick={() => toggleFilterDrawer(!formik.values.displayToggleFilter, formik.setFieldValue)} 
                    variant="temporary" 
                    >
                    <FilterList />
                </Fab>
            </div>
    );
}

export default SearchPage;