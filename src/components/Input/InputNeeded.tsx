import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormNeededInput } from '../../utils/interface'
import './input.css'

interface InputProps {
    addToList: (data: FormNeededInput) => void;
}
export const InputNeeded = (props: InputProps) => {
    const { addToList } = props;

    const schema = yup.object().shape({
        name: yup.string().required("Le nom est requis"),
        quantity: yup.number().typeError('Doit être un nombre').required("La quantité est requise").min(0, 'La quantité doit être supérieure à zéro'),
    }); 

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
      });


      const onSubmit = (data: FormNeededInput) => {
        addToList({...data, id: JSON.stringify(Date.now())});
        reset({ name: '', quantity: 0 })
      };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputContainer">
                <div className="flex">
                    <div >
                        <input type="text" {...register('name')} placeholder="Item" />
                        {errors.name && <p className='errorMessage'>{errors.name.message}</p>}
                    </div>
                    <div className="tiers">
                        <input type="number" {...register('quantity')} placeholder="Quantité" className="inputNumber" />
                        {errors.quantity && <p>{errors.quantity.message}</p>}
                    </div>
                </div>
                <button type="submit" className="submitBtn">Ajouter</button>
            </div>
        </form>
    )
}