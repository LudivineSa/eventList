import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormNeededInput } from '../../utils/interface'
import './input.css'

interface InputProps {
    addToList: (data: FormNeededInput) => void;
    id: string;
    hideTakeCareForm: () => void;
}
export const InputTakeCare = (props: InputProps) => {
    const { addToList, id, hideTakeCareForm} = props;

    const schema = yup.object().shape({
        quantity: yup.number().typeError('Doit être un nombre').required("La quantité est requise").min(0, 'La quantité doit être supérieure à zéro'),
        who: yup.string().required("Le nom est requis"),
    }); 

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
      });


      const onSubmit = (data: FormNeededInput) => {
        addToList({...data, id});
        reset({ who: '', quantity: 0 })
        hideTakeCareForm();
      };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputContainer">
                <div className='flex'>
                    <div className="tiers">
                        <input type="number" {...register('quantity')} placeholder="Quantité" className="inputNumber" />
                        {errors.quantity && <p>{errors.quantity.message}</p>}
                    </div>
                    <div>
                        <input type="text" {...register('who')} placeholder="Qui" />
                        {errors.who && <p className='errorMessage'>{errors.who.message}</p>}
                    </div>
                    </div>
                    <button type="submit" className="submitBtn">Ajouter</button>
            </div>
        </form>
    )
}