import { useState, useContext } from "react";
import { FormInput, FormNeededInput } from "../utils/interface";
import { ref, onValue, push, DataSnapshot, remove, update } from 'firebase/database';


import { database } from '../firebase-config';
import { UserContext } from '../context/UserContext';

export const useListItems = () => {

    const { user } = useContext(UserContext);

    const [listItems, setListItems] = useState<FormInput[]>([]);
    const [listNeededItems, setListNeededItems] = useState<FormInput[]>([]);

    const getList = (uidEvent: string, uidList : string, userId : string) => {
        const eventsRef = ref(database, `Events/${userId}/event/${uidEvent}/${uidList}/list`);
        onValue(eventsRef, (snapshot: DataSnapshot) => {
            const data = snapshot.val();
            const listArray = [];
            for(const key in data) {
                if(data[key].name){
                    listArray.push({name: data[key].name, quantity: data[key].quantity, id: key, who: data[key].who, needed: data[key].needed});
                }
            }
            setListItems(listArray);
        })
        const listNeededRef = ref(database, `Events/${userId}/event/${uidEvent}/${uidList}/listNeeded`);
        onValue(listNeededRef, (snapshot: DataSnapshot) => {
            const data = snapshot.val();
            const listArray = [];
            for(const key in data) {
                if(data[key].name){
                    listArray.push({name: data[key].name, quantity: data[key].quantity, id: key, who: data[key].who});
                }
            }
            setListNeededItems(listArray);
        })
    }

    const addToList = (data: FormInput, uidEvent: string, uidList : string, userId: string) => {
        const eventsRef = ref(database, `Events/${userId}/event/${uidEvent}/${uidList}/list`);
        push(eventsRef, data).catch((e) => console.log(e))
        getList(uidEvent, uidList, userId);
    }

    const deleteFromList = (uidEvent: string, uidList: string, uidItem: string, userId: string) => {
        const listRef = ref(database, `Events/${userId}/event/${uidEvent}/${uidList}/list/${uidItem}`);
        const item = listItems.find((item) => item.id === uidItem);
        remove(listRef).catch((e) => console.log(e));
        if (item?.needed) {
            const listRef = ref(database, `Events/${userId}/event/${uidEvent}/${uidList}/listNeeded`);
            const itemNeeded = { name: item.name, quantity: item.quantity, needed: true};
            push(listRef, itemNeeded).catch((e) => console.log(e))
        }
        getList(uidEvent, uidList, userId);
        
    }

    const takeCare = (data: FormNeededInput, uidEvent: string, uidList: string, userId: string) => {
        const itemToChange = listNeededItems.find((item) => item.id === data.id);
        if (itemToChange) {
            const eventsRef = ref(database, `Events/${userId}/event/${uidEvent}/${uidList}/list`);
            const item = { name: itemToChange.name, quantity: data.quantity, who: data.name, needed: true};
            push(eventsRef, item).then(() => getList(uidEvent, uidList, userId)).catch((e) => console.log(e))
            if(itemToChange.quantity - data.quantity <= 0){
                deleteFromNeededList(uidEvent, uidList, data.id, userId);
            } else {
                const listNeededRef = ref(database, `Events/${userId}/event/${uidEvent}/${uidList}/listNeeded/${data.id}`);
                const itemNeeded = { name: itemToChange.name, quantity: itemToChange.quantity - data.quantity, who: data.name, needed: true};
                update(listNeededRef, itemNeeded).then(() => getList(uidEvent, uidList, userId)).catch((e) => console.log(e))
            }
        }
        
    }

    const deleteFromNeededList = (uidEvent: string, uidList: string, uidItem: string, userId: string) => {
            const listNeededRef = ref(database, `Events/${userId}/event/${uidEvent}/${uidList}/listNeeded/${uidItem}`);
            remove(listNeededRef)
                .catch((error) => {
                    console.error("Erreur lors de la suppression de l'élément de Firebase :", error);
                });
        getList(uidEvent, uidList, userId);
    }

    const addToNeededList = (data: FormNeededInput, uidEvent: string, uidList: string, userId : string) => {
        if(userId === user.uid){
            const dataClone = {...data, needed: true}
            const eventsRef = ref(database, `Events/${user.uid}/event/${uidEvent}/${uidList}/listNeeded`);
            push(eventsRef, dataClone).catch((e) => console.log(e))
        }
        getList(uidEvent, uidList, userId)
    }

    return { getList, listItems, addToList, deleteFromList, listNeededItems, takeCare, deleteFromNeededList, addToNeededList }; 
}