/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import DisplayTests from './displayTests';
import {useAppSelector} from '../../state-management/hooks';

const SelectorsButton: React.FC<any> = props => {

  const { selectorsFnAsStrings, selectors, atoms, onChange, chosenSelector, setChosenSelector } = props;

  // create a hook that stores the current value of the selected drop down
  //const [currentSelector, setCurrentSelector] = useState('');
  // label of the atom associated with the selcetor clicked from the drop down
  const [currentAtom, setCurrentAtom] = useState('');
  // value of the atom associated with the selector clicked from the drop down
  const [currentAtomValue, setCurrentAtomValue] = useState('');
  // value to be expected -> updated in displayTests
  const [toBeValue, setToBeValue] = useState('');
  // stateful value to contain parameters initialized as an empty array
  const [parameters, setParameters] = useState([]);
  // grab the filtered snapshot so we know which atoms and selectors are dependent of each other
  const snapshotHistory = useAppSelector(
    state => state.snapshot.snapshotHistory,
  );

  
  // console.log('TESTING: ', snapshotHistory);

  // console.log('Selectors: ', selectors);
  // console.log('Atoms: ', atoms);
  // completely eliminated all need for any object shenanigans or redux imports through prop drilling.

  const handleChange = (item) => {
    const selectorKey = item.options[item.selectedIndex].value;

    console.log('handleChange, selectorKey: ', selectorKey);
    // update state with the chosen Selector
    setChosenSelector(selectorKey);
    const capturedFnString = selectorsFnAsStrings[selectorKey];
    let { key, set, get } = capturedFnString;

    const parser = (string) => {
      // start a slice at _ and end at ; for each, the get and the set.
      if (!string) return;
      const firstPortion = string.slice(0, string.indexOf(';'));
      const secondPortion = string.slice(string.indexOf(';') + 1, string.length);
      let newFirstPortion = '';
      if (firstPortion.includes('get')) newFirstPortion += ' get ';
      if (firstPortion.includes('set')) newFirstPortion += ' set ';
      //console.log('firstPortion ,', firstPortion)
      //console.log('newFirstPortion ', newFirstPortion);
      return `{ ${newFirstPortion} } => { ${secondPortion}`
    }
    //first portion of string is from 0 to ;
    const displayedSelector = 
    `Chosen selector:
  ${key}: {
    get: ${parser(get)}, 
    set: ${parser(set)},
  }`
    //maybe need to parse function to use present as a correct string.
    onChange(displayedSelector);
    // onChange("displayedSelector");
    // console.log('handleChange, selectorKey: ', selectorKey);

    // console.log('Selector Key: ', selectorKey);
    setChosenSelector(selectorKey);

    // find the current atom dependent on the selector clicked from the drop down
    // currently referencing the last element in the snapshotHistory array
    const dependentAtom = snapshotHistory[snapshotHistory.length - 1].filteredSnapshot[selectorKey].nodeDeps[0];
    setCurrentAtom(dependentAtom);
    // find the current atom value from the dependentAtom associated with the clicked on Selector
    const dependentAtomValue = snapshotHistory[snapshotHistory.length - 1].filteredSnapshot[dependentAtom].contents;
    setCurrentAtomValue(dependentAtomValue);
  }
  
  //relabeled and used a value property to capture the value on an on change above - you can now find the keys. Function needs to be completed though
  const HTMLselectorArray: JSX.Element[] = [];
  selectors.forEach((selector, i) => {
    HTMLselectorArray.push(<option key={i} value={selector}>{selector}</option>);
  });
  
  return (
    <div>
      <div>
          <label htmlFor='selectors'>Selectors: </label>
          <select name='selectors' id='selectors' onChange={() => handleChange(document.querySelector('#selectors'))}>{HTMLselectorArray}</select>
      </div>
      <div>
        <DisplayTests 
          chosenSelector={chosenSelector}
          currentAtom={currentAtom} 
          currentAtomValue={currentAtomValue} 
          toBeValue={toBeValue}
          setToBeValue={setToBeValue}
          parameters={parameters}
          setParameters={setParameters}
        />
      </div>
    </div>
  );
};
 
export default SelectorsButton;
