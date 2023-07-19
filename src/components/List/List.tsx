import { FormInput, FormNeededInput } from "../../utils/interface";
import {  InputNotNeeded } from "../Input/InputNotNeeded";
import { InputNeeded } from "../Input/InputNeeded";
import { useState } from 'react'
import './List.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ListNeededItems } from "./ListNeededItems.tsx/ListNeededItems";

interface ListProps {
    name: string;
}

export const List = (props : ListProps) => {
    const { name } = props ;

    const [listItems, setListItems] = useState<FormInput[]>([]);
    const [listNeededItems, setListNeededItems] = useState<FormNeededInput[]>([]);
    const [showNeeded, setShowNeeded] = useState<boolean>(false);
    const [showTakeCareForm, setShowTakeCareForm] = useState<boolean>(false);

    const addToList = (data: FormInput) => {
        const listItemsClone = [...listItems];
        listItemsClone.push(data);
        setListItems(listItemsClone);
    }

    const addToNeededList = (data: FormNeededInput) => {
        const listItemsClone = [...listNeededItems];
        listItemsClone.push(data);
        setListNeededItems(listItemsClone);
    }

    const deleteFromList = (index: string) => {
        const listItemsClone = [...listItems];
        const indexToDelete = listItemsClone.findIndex((item) => item.id === index);
        if(listItemsClone[indexToDelete].needed){
            const listNeededItemsClone = [...listNeededItems];
            listNeededItemsClone.push({name: listItemsClone[indexToDelete].name, quantity: listItemsClone[indexToDelete].quantity, id: listItemsClone[indexToDelete].id});
            setListNeededItems(listNeededItemsClone);
        }
        listItemsClone.splice(indexToDelete, 1);
        setListItems(listItemsClone);
    }

    const deleteFromNeededList = (index: string) => {
        const listItemsClone = [...listNeededItems];
        const indexToDelete = listItemsClone.findIndex((item) => item.id === index);
        listItemsClone.splice(indexToDelete, 1);
        setListNeededItems(listItemsClone);
    }

    const takeCare = (data: FormNeededInput) => {
        const itemToChange = listNeededItems.find((item) => item.id === data.id);
        if (itemToChange) {
            const listItemsClone = [...listItems];
            listItemsClone.push({name: itemToChange.name, quantity: data.quantity, id: JSON.stringify(Date.now()), who: data.who, needed: true});
            setListItems(listItemsClone);
            if(itemToChange.quantity - data.quantity <= 0){
                deleteFromNeededList(data.id);
            } else {
                const listNeededItemsClone = [...listNeededItems];
                const indexToChange = listNeededItemsClone.findIndex((item) => item.id === data.id);
                listNeededItemsClone[indexToChange].quantity = itemToChange.quantity - data.quantity;
                setListNeededItems(listNeededItemsClone);
            }
        }
    }

    return (
        <div className="listContainer">
            <h2>{name}</h2>
            <h3>Besoin</h3>
            {listNeededItems.length === 0 ? <p className="emptyList">La liste est vide</p> : 
            <div className="listItem headerList headerListNeeded">
                        <p>Nom</p>
                        <p>Quantité</p>
                        <p className="action">Actions</p>
                    </div>
            }
            {listNeededItems.map((item) => {
                return (
                    <ListNeededItems key={item.id} item={item} deleteFromNeededList={deleteFromNeededList} takeCare={takeCare} />
                )
            })}
            <button onClick={() => setShowNeeded(!showNeeded)} className="showNeedBtn">{showNeeded ? "Cacher" : "Ajouter un besoin"}</button>
            {showNeeded && <InputNeeded addToList={addToNeededList} />}
            <h3>Ce qu'on a déjà</h3>
            {listItems.length === 0  ? <p className="emptyList">La liste est vide</p> : 
                <div className="listItem headerList">
                    <p>Nom</p>
                    <p>Quantité</p>
                    <p>Qui apporte</p>
                    <p>Action</p>
                </div>
            }
            {listItems.map((item) => {
                return (
                    <div className="listItem items" key={item.id}>
                        <p>{item.name}</p>
                        <p>{item.quantity}</p>
                        <p>{item.who}</p>
                        <FontAwesomeIcon icon={faTrashCan} className="clickable" onClick={() => deleteFromList(item.id)}/>                  
                    </div>
                )
            })}
            <h3>Ajouter autre chose</h3>
            <InputNotNeeded addToList={addToList} />
        </div>
    )
}