import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
function ConfirmDeleteDialog({open,handleclose,deletehandler}){
    return (
        <Dialog open={open} onClose={handleclose}>
            <DialogTitle>
                Confirm Delete
            </DialogTitle>
            <DialogContent>
                Are you want to delete this group
            </DialogContent>
            <DialogActions>
                <Button onClick={handleclose}> 
                    No
                </Button>
                <Button color="error" onClick={deletehandler}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmDeleteDialog