import TextField from '@mui/material/TextField/TextField';
import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton} from "@mui/material";
import {AddBox} from "@mui/icons-material";

export const AddItemForm = React.memo(({addItem, disabled}: AddItemFormPropsType) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addItemHandler = async () => {
        if (title.trim() !== "") {
            try {
                await addItem(title);
                setTitle("");
            } catch (error) {
                if (typeof error === "string") {
                    setError(error);
                } else {
                    setError("An error occurred.");
                }
            }
        } else {
            setError("Title is required");
        }
    };


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItemHandler();
        }
    }

    return <div>
        <TextField variant="outlined"
                   disabled={disabled}
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
        />
        <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
            <AddBox/>
        </IconButton>
    </div>
})


// Types
type AddItemFormPropsType = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
}