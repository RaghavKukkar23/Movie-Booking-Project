import React from 'react';
import AuthForm from '../Auth/AuthForm';
import { sendAdminAuthRequest } from '../../api-helpers/api-helpers';
import { useDispatch } from 'react-redux';
import { adminActions } from '../../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onResReceived = (data) => {
    console.log(data);
    dispatch(adminActions.login());
    localStorage.setItem("adminId",data.id);
    localStorage.setItem("token",data.token);
    toast.success("Login Successful");
    navigate('/');
  };
  
  const getData = (data) => {
    console.log("Admin",data);
    sendAdminAuthRequest(data.inputs)
    .then(onResReceived)
    .catch((err)=> console.log(err));
  };
  return (
    <AuthForm onSubmit={getData} isAdmin={true} />
  );
};

export default Admin;
