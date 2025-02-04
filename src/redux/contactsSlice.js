import { createSelector, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { fetchContacts, deleteContact, addContact } from "./contactsOps"
import { selectContacts, selectFilter } from "./selectors"

const initialState = {
            items: [
                {id: 'id-1', name: 'Rosie Simpson', number: '459-12-56'},
                {id: 'id-2', name: 'Hermione Kline', number: '443-89-12'},
                {id: 'id-3', name: 'Eden Clements', number: '645-17-79'},
                {id: 'id-4', name: 'Annie Copeland', number: '227-91-26'},
            ],
            isLoading: false,
            isError: false,
    }
    
const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchContacts.fulfilled, (state, {payload}) => {
            state.items = payload
        })
        .addCase(addContact.fulfilled, (state, {payload}) => {
            state.items.push(payload)
        })
        .addCase(deleteContact.fulfilled, (state, {payload}) => {
            state.items = state.items.filter(item => item.id !== payload.id)
        })

        .addMatcher(isAnyOf(fetchContacts.fulfilled, addContact.fulfilled, deleteContact.fulfilled), (state) => {
            state.isLoading = false

        .addMatcher(isAnyOf(fetchContacts.pending, addContact.pending, deleteContact.pending), (state) => {
            state.isError = false
            state.isLoading = true
        })
        .addMatcher(isAnyOf(fetchContacts.rejected, addContact.rejected, deleteContact.rejected), (state) => {
            state.isError = false
            state.isLoading = false
        })
        })
    } 
})

export const contactsReducer = contactsSlice.reducer;
export const selectFilteredContacts = createSelector([selectContacts, selectFilter], (contacts, filter) => {
    return contacts.filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase())
    || contact.number.includes(filter))
})
