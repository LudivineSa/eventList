import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormInput } from '../../utils/interface'
import './input.css'
interface InputProps {
    addToList: (data: FormInput) => void;
}
export const InputNotNeeded = (props: InputProps) => {
    const { addToList } = props;

    const schema = yup.object().shape({
        name: yup.string().required("Le nom est requis"),
        quantity: yup.number().typeError('Doit être un nombre').required("La quantité est requise").min(0, 'La quantité doit être supérieure à zéro'),
        who: yup.string().required("Le champ est requis")
    }); 

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
      });


      const onSubmit = (data: FormInput) => {
        addToList({...data, id: JSON.stringify(Date.now())});
        reset({ name: '', quantity: 0 })
      };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputContainer">
                <div className="tiers">
                    <input type="text" {...register('name')} placeholder="Ajouter un item" />
                    {errors.name && <p className='errorMessage'>{errors.name.message}</p>}
                </div>
                <div>
                    <input type="number" {...register('quantity')} placeholder="Quantité" className="inputNumber" />
                    {errors.quantity && <p>{errors.quantity.message}</p>}
                </div>
                <div>
                    <input type="text" {...register('who')} placeholder="Qui l'apporte?" />
                    {errors.who && <p>{errors.who.message}</p>}
                </div>
            </div>
            <button type="submit" className="submitBtn">Ajouter</button>
        </form>
    )
}