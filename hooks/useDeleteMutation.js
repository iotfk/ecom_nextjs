import { showToast } from "@/lib/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


const useDeleteMutation = ( queryKey, deleteEndpoint ) => {
const queryClient = useQueryClient();

return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
        const { data: response } = await axios({url: deleteEndpoint, 
            method: deleteType === 'PD' ? 'DELETE' : 'PUT', 
            data: { ids, deleteType } });
        if (!response.success) {
            throw new Error(response.message);
        }
        return response;
    },
    onSuccess: (data) => {
        showToast('success',  data.message || 'Media deleted successfully');
        queryClient.invalidateQueries([queryKey]);
    },
    onError: (error) => {
        console.error("Delete mutation error:", error);
        showToast('error', error.message || 'Failed to delete media');
    }
});

}

export default useDeleteMutation;