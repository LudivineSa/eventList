import React, { createContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { User } from '../utils/interface';
import { auth } from '../firebase-config';


export const UserContext = createContext({user: {email: '', accessToken: '', uid: ''}, disconnectUser: () => {console.log("déconnecté")}, loginUser: (email: string, password: string) => {console.log(email)}, registerUser: (username: string, email: string, password: string) => console.log("ok") });

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider = (props : UserProviderProps) => {

  const { children } = props;
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: '',
    accessToken: '', 
    uid: ''
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    console.log(userId)
    if(userId) {
      setUser({email: userEmail || 'null@gmail.com', accessToken: '', uid: userId});
    }
  }, [])
  
  const loginUser = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user : User = {email : userCredential.user.email || '', accessToken: '' || '', uid: userCredential.user.uid};
      userCredential.user.getIdToken().then((token) => {user.accessToken = token}).catch((e) => console.log(e))
      updateUser(user);
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userEmail', user.email);
      navigate("/");
    })
    .catch((error) => {
      //TODO: mettre un toaster
      console.log(error)
    });    
  
  }

  const updateUser = (newUser: User) => {
    const user : User = { email : newUser.email, accessToken : newUser.accessToken, uid: newUser.uid }
    setUser(user);
  };

  const registerUser = (username: string, email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password).then(() => navigate("/login")).catch((e) => console.log(e))
  }

  const disconnectUser = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setUser({email: '', accessToken: '', uid: ''});
  }

  return (
    <UserContext.Provider value={{ user, loginUser, registerUser, disconnectUser }}>
      {children}
    </UserContext.Provider>
  );
};