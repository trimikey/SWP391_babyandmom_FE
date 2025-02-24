import { toast } from "react-toastify";
import api from "../../config/axios";

export const getProduct = async () => {
    try {
        const response = await api.get('products');
        return response.data;
    } catch (error) {
        toast.error(error.response.data);
    }
}

export const createProduct = async (data) => {
    try {
        const response = await api.post('products', data);
        toast.success("Create product success!");
        return response.data;
    } catch (error) {
        toast.error(error.response.data);
    }
}