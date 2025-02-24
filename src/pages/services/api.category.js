import { toast } from "react-toastify";
import api from "../../config/axios";


export const getCategory = async () => {    
    try {
        const response = await api.get('categories');
        return response.data;
    } catch (error) {
        toast.error(error.response.data);
    }
}