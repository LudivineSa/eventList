import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../context/UserContext';

export const Register = () => {

    const { user, registerUser } = useContext(UserContext);

    const navigate = useNavigate();

    const schema = yup.object().shape({
        email: yup.string().required("L'email est requis").email("L'email doit être valide"),
        username: yup.string().required("Le nom d'utilisateur est requis"),
        password: yup.string().required("Le mot de passe est requis").min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
        confirmPassword: yup.string().required("La confirmation du mot de passe est requise").oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: any) => {
        registerUser(data.username, data.email, data.password)
    }

    useEffect(() => {
        if(user.email) {
            navigate("/");
        }
    }, [user])
    
    return(
        <div className="containerForm">
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="createListForm ">
                <div>
                    <input className="authForm" type="text" {...register('email')} placeholder="Email" />
                    {errors.email && <p className='errorMessage'>{errors.email.message}</p>}
                </div>
                <div>
                    <input type="text" {...register('username')} placeholder="Nom d'utilisateur" />
                    {errors.username && <p className='errorMessage'>{errors.username.message}</p>}
                </div>
                <div>
                    <input type="password" {...register('password')} placeholder="Mot de passe" />
                    {errors.password && <p className='errorMessage'>{errors.password.message}</p>}
                </div>
                <div>
                    <input type="password" {...register('confirmPassword')} placeholder="Confirmer le mot de passe" />
                    {errors.confirmPassword && <p className='errorMessage'>{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    )
}