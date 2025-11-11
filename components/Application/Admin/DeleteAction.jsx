import { ListItemIcon, MenuItem } from '@mui/material'
import React from 'react'
import { DeleteSharp } from '@mui/icons-material'

const DeleteAction = ({ handleDelete, row, deleteType }) => {
    return (
        <MenuItem 
            key="delete" 
            onClick={() => handleDelete([row.original._id], deleteType)}
            // sx={{ color: 'error.main' }}
        >
            <ListItemIcon>
                <DeleteSharp color="error" />
            </ListItemIcon>
            Delete
        </MenuItem>
    )
}

export default DeleteAction
