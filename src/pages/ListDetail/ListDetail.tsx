import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Item } from '../../components/List/Item.tsx';

import './ListDetail.css';
import { useEvent } from '../../hooks/useEvent.tsx';
import { Event } from '../../utils/interface.ts';
import { UserContext } from '../../context/UserContext.tsx';


export const ListDetail = () => {

  const [showCreateList, setShowCreateList] = useState(false);

  const { user } = useContext(UserContext);

  const { getSingleEvent, addListToEvent, event, name } = useEvent();

  const schema = yup.object().shape({
    name: yup.string().required("Le nom est requis"),
  })

const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const params = useParams();
  const isAdmin = user?.uid === params.userId;

  const navigate = useNavigate();

  useEffect(() => {
    if(!params.id || !params.userId) {
      navigate('/');
    } else {
       getSingleEvent(params.id, params.userId);
    }
  }, [])

  const addListArray = () => {
    setShowCreateList(true);
  }

  const onSubmit = (data: any) => {
    addListToEvent(params.id || '', data.name);
}

  return (
    <div className="container">
      <h1>{name}</h1>
      <div className='grid'>
        { event.map((item) => <Item key={item.uid} name={item.name} uid={item.uid} uidEvent={params.id || ''} />)}
      </div>
      {!showCreateList && isAdmin && <button onClick={addListArray} className="createListBtn">Ajouter un tableau</button>}
      {showCreateList &&
        <form onSubmit={handleSubmit(onSubmit)}>
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