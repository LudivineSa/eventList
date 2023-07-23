import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';import { useEvent } from "../../hooks/useEvent";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export const Events = () => {

    const { events, get, add } = useEvent();
    const { user } = useContext(UserContext);

    const [showCreateList, setShowCreateList] = useState(false);
    const navigate = useNavigate();

    const schema = yup.object().shape({
        name: yup.string().required("Le nom est requis"),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if(!user.email) {
            navigate("/login");
        }
        get();
    }, [user])

    const onSubmit = (data: any) => {
            add(data.name);
            setShowCreateList(false);
            navigate("/")
    }

    return (
        <div>
            <h1>Mes évènements</h1>
            <ul>
                {events.map((item) => <li key={item.uid}><Link to={`/list/${user.uid}/${item.uid}`} key={item.uid}>{item.name}</Link></li>)}  
            </ul>
            {user.email && !showCreateList && <button className="createListBtn" onClick={() => setShowCreateList(true)}>Créer une liste</button>}
            {showCreateList &&
                <form onSubmit={handleSubmit(onSubmit)} className="createListForm">
                    <div>
                        <input type="text" {...register('name')} placeholder="Nom de la liste" />
                        {errors.name && <p className='errorMessage'>{errors.name.message}</p>}
                    </div>
                    <button type="submit">Créer une nouvelle liste</button>
                </form>
            }
        </div>
    )
}