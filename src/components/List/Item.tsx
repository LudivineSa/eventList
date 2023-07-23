import { FormInput, FormNeededInput } from "../../utils/interface";
import {  InputNotNeeded } from "../Input/InputNotNeeded";
import { InputNeeded } from "../Input/InputNeeded";
import { useContext, useEffect, useState } from 'react'
import './List.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ListNeededItems } from "./ListNeededItems.tsx/ListNeededItems";
import { UserContext } from "../../context/UserContext";
import { useListItems } from "../../hooks/useListItems";
import { useParams } from "react-router-dom";

interface ListProps {
    name: string;
    uid: string; 
    uidEvent: string;
}

export const Item = (props : ListProps) => {
    
    const { name, uid, uidEvent } = props ;
    const { getList, listItems, addToList, deleteFromList, listNeededItems, deleteFromNeededList, takeCare, addToNeededList } = useListItems();
    const { user } = useContext(UserContext);
    const [showNeeded, setShowNeeded] = useState<boolean>(false);

    const params = useParams();

    useEffect(() => {
        getList(uidEvent, uid, params.userId || '');
    }, [])
        const add = (data: any) => {
        addToList(data, uidEvent, uid, params.userId || '');
    }

    const addToNeeded = (data: FormNeededInput) => {
        addToNeededList(data, uidEvent, uid, params.userId || '');
    }

    const deleteFromNeeded = (id: string) => {
        deleteFromNeededList(uidEvent, uid, id, params.userId || '');
    }

    const deleteListItem = (id: string) => {
        deleteFromList(uidEvent, uid, id, params.userId || '');
    }

    const takeCareItem = (data: any) => {
        takeCare(data, uidEvent, uid, params.userId || '');
    }

    return (
        <div className="listContainer">
            <h2>{name}</h2>
            <h3>Besoin</h3>
            <div className="listItem headerList headerListNeeded">
                <p>Nom</p>
                <p>Quantité</p>
                <p className="action">Actions</p>
            </div>
            {listNeededItems.map((item) => {
                return (
                    <ListNeededItems  key={item.id} item={item} deleteFromNeededList={deleteFromNeeded} takeCare={takeCareItem} />
                )
            })}
            {user.email && <button onClick={() => setShowNeeded(!showNeeded)} className="showNeedBtn">{showNeeded ? "Cacher" : "Ajouter un besoin"}</button>}
            {showNeeded && <InputNeeded addToList={addToNeeded}  />}
            <h3>Ce qu'on a déjà</h3>
                <div className="listItem headerList">
                    <p>Nom</p>
                    <p>Quantité</p>
                    <p>Qui</p>
                    <p>Action</p>
                </div>
            {listItems.map((item) => {
                return (
                    <div className="listItem items" key={item.id}>
                        <p>{item.name}</p>
                        <p>{item.quantity}</p>
                        <p>{item.who}</p>
                        <FontAwesomeIcon icon={faTrashCan} className="clickable" onClick={() => deleteListItem(item.id)}/>                  
                    </div>
                )
            })}
            <h3>Ajouter autre chose</h3>
            <InputNotNeeded addToList={add} />
        </div>
    )
}