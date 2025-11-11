import { ListItemIcon, MenuItem } from '@mui/material'
import React from 'react'
import Link from 'next/link'
import { Edit } from '@mui/icons-material' // ✅ Use MUI icon for consistency

const EditAction = ({ href }) => {
    return (
        <MenuItem key="edit" component={Link} href={href}>
            <ListItemIcon>
                <Edit fontSize="small" />
            </ListItemIcon>
            Edit
        </MenuItem>
    )
}

export default EditAction
