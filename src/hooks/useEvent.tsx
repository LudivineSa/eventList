import { useState, useContext } from 'react';
import { ref, onValue, push, DataSnapshot } from 'firebase/database';
import { database } from '../firebase-config';

import { UserContext } from '../context/UserContext';
import { Event } from '../utils/interface';

export const useEvent = () => {

    const [events, setEvents] = useState<Event[]>([]);
    const { user } = useContext(UserContext);
    const [event, setEvent] = useState<Event[]>([]);
    const [name, setName] = useState('');

    const add = (item: string) => {
        const eventsRef = ref(database, `Events/${user.uid}/event`);
        push(eventsRef, {name: item, user: user.uid}).then((data) => console.log(data)).catch((e) => console.log(e))
        get()
    };

    const get = () => {
        const eventsRef = ref(database, `Events/${user.uid}`);
        onValue(eventsRef, (snapshot: DataSnapshot) => {
            const data = snapshot.val();
            const eventArray = [];
            for(const key in data.event) {
                eventArray.push({name: data.event[key].name, uid: key});
            }
            setEvents(eventArray);
        })
    }

    const getSingleEvent = (uid: string, userId: string) => {
        const eventRef = ref(database, `Events/${userId}/event/${uid}`);
        let name = '';
        const arrayEvents : any[] = [];
        onValue(eventRef, (snapshot: DataSnapshot) => {
            const data = snapshot.val();
            if (data.name) {
                name = data.name;
            }
            for(const key in data) {
                if(data[key].name){
                    arrayEvents.push({name: data[key].name, uid: key});
                }
            }
            setEvent(arrayEvents)
            setName(name)
        })
        return {name, arrayEvents};
    }

    const addListToEvent = (id: string, name: string) => {
        const eventsRef = ref(database, `Events/${user.uid}/event/${id}`);
        push(eventsRef, {name: name, neededItems : {}, itemsBrought: {}}).then((data) => console.log(data)).catch((e) => console.log(e))
        getSingleEvent(id, user.uid);
    }

    return { events, add, get, getSingleEvent, addListToEvent, event, name };
}