import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { UserLogin } from '../../utils/interface.ts';
import { UserContext } from '../../context/UserContext.tsx';
import { useNavigate } from 'react-router-dom';


export const Login = () => {

    const { loginUser, user } = useContext(UserContext);
    const navigate = useNavigate();
    const schema = yup.object().shape({
        email: yup.string().required("L'email est requis").email("L'email doit être valide"),
        password: yup.string().required("Le mot de passe est requis").min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: UserLogin) => {
        loginUser(data.email, data.password)
    }

    useEffect(() => {
        if(user.email) {
            navigate("/");
        }
    }, [user])

    return(
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="createListForm">
                <div>
                    <input type="text" {...register('email')} placeholder="Email" />
                    {errors.email && <p className='errorMessage'>{errors.email.message}</p>}
                </div>
                <div>
                    <input type="password" {...register('password')} placeholder="Mot de passe" />
                    {errors.password && <p className='errorMessage'>{errors.password.message}</p>}
                </div>
                <button type="submit">Se connecter</button>
            </form>
        </>
    )
}