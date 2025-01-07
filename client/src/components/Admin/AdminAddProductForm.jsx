import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import AdminForm from "./AdminForm";


export default function AdminAddProductForm() {


  return (
    <>
      
      <AdminForm />
    </>
  );
  
}

