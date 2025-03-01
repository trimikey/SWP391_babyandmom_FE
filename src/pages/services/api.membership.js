import api from '../../config/axios';

const membershipApi = {
    getAllPackages: async () => {
        const response = await api.get('/membership-packages');
        return response.data;
    },
    
    getActivePackages: async () => {
        const response = await api.get('/membership-packages/active');
        return response.data;
    },
    
    getPackageById: async (id) => {
        const response = await api.get(`/membership-packages/${id}`);
        return response.data;
    },
    
    createPackage: async (data) => {
        const response = await api.post('/membership-packages', data);
        console.log('Create package status:', response.status);
        return response.data;
    },
    
    updatePackage: async (id, data) => {
        const response = await api.put(`/membership-packages/${id}`, data);
        return response.data;
    },
    
    deletePackage: async (id) => {
        const response = await api.delete(`/membership-packages/${id}`);
        return response.data;
    }
};

export default membershipApi; 