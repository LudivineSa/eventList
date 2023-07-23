import { useContext, useState } from 'react';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { InputTakeCare } from "../../Input/InputTakeCare";


import { FormNeededInput } from '../../../utils/interface';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
interface ListNeededItemsProps {
    item: FormNeededInput;
    deleteFromNeededList: (index: string) => void;
    takeCare: (data: FormNeededInput) => void;
}

export const ListNeededItems = (props: ListNeededItemsProps) => {
    const { item, deleteFromNeededList, takeCare } = props;
    const [showTakeCareForm, setShowTakeCareForm] = useState<boolean>(false);
    const params = useParams();
    const { user } = useContext(UserContext);
    return(
    <div className="items" key={item.id}>
        <div className="listNeededItem ">
            <p>{item.name}</p>
            <p>{item.quantity}</p>
            <button onClick={() => setShowTakeCareForm(!showTakeCareForm)} className="btnTakeCare">Je m'en occupe </button>
            {params.uid === user.uid && <FontAwesomeIcon icon={faTrashCan}  className="clickable trashcan" color="#303030" onClick={() => deleteFromNeededList(item.id)}/>}                  
        </div>
        {showTakeCareForm && <InputTakeCare addToList={takeCare}  id={item.id} hideTakeCareForm={() => setShowTakeCareForm(false)} />}
    </div>
    )
}