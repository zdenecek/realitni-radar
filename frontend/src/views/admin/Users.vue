

<template>
    <div>
        <h1>Uživatelé</h1>


        <v-data-table :items="items" :headers="headers" class="mt-4"
            :sort-by="[{ key: 'role', order: 'desc' }, { key: 'email', order: 'asc' }]">


            <template v-slot:item.role="{ item }">
                <v-icon>{{ roleIcon(item.role) }}</v-icon>
                {{ roleTitle(item.role) }}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2 text-secondary" @click="editItem(item)">
                    mdi-account-edit-outline
                </v-icon>
                <v-icon @click="deleteItem(item)" color="red">
                    mdi-account-remove-outline
                </v-icon>
            </template>
            <template v-slot:no-data>
                <span>No users found.</span>
            </template>
            <template v-slot:top>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ props }">
                        <div class="flex">
                            <v-btn color="primary" dark class="mb-2" v-bind="props" prepend-icon="mdi-account-plus-outline"
                                flat>
                                Vytvořit nového uživatele
                            </v-btn>
                        </div>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-text-field v-model="editedItem.name" label="Jméno"></v-text-field>
                            <v-text-field v-model="editedItem.username" label="Uživatelské jméno"
                                v-show="false"></v-text-field>
                            <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                            <v-select v-model="editedItem.role" :items="roles" label="Role" variant="outlined"
                                density="compact" :item-title="item => roleTitle(item)" :item-value="item => item">
                            </v-select>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="close">
                                Zrušit
                            </v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="save">
                                Uložit
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Opravdu chcete smazat uživatele?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Zrušit</v-btn>
                            <v-btn variant="outlined" color="red" @click="deleteItemConfirm">Ano
                                <template v-slot:prepend>
                                    <v-icon color="red">mdi-delete</v-icon>
                                </template>

                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>
        </v-data-table>
        <v-snackbar v-model="hasError">
            {{ error }}
            <template v-slot:actions>
                <v-btn variant="text"  @click="error = ''">Close</v-btn>
            </template> 
        </v-snackbar>
    </div>
</template>


<script setup lang="ts">

import { onMounted, ref, computed, watch, nextTick } from 'vue';
import axios from '@/plugins/axios';
import User from '@/class/User';

const error = ref('');
const hasError = computed(() => error.value !== '');
const items = ref([] as User[]);

const headers = [
    { title: 'Jméno', value: 'name' },
    { title: 'Email', value: 'email' },
    { title: 'Role', value: 'role' },
    { title: 'Akce', key: 'actions', sortable: false },
]

async function initialize() {
    try {
        const response = await axios.get('/admin/users');
        const data = await response.data.users;
        items.value = data;
    } catch (error: any) {
        error.value = error.message;
        console.error(error.message);
    }
}
onMounted(() => initialize());



const roleTitles = {
    admin: 'Administrátor',
    user: 'Uživatel',
    registered: 'Nový uživatel',
}
function roleTitle(role: string) {
    return roleTitles[role  as keyof typeof roleTitles];
}
const roles = Object.keys(roleTitles).filter(role => role !== 'admin');

const roleIcons = {
    admin: 'mdi-account-cog-outline',
    user: 'mdi-account-outline',
    registered: 'mdi-account-question-outline',
}
function roleIcon(role: string) {
    return roleIcons[role as keyof typeof roleIcons];
}


const dialog = ref(false)
const dialogDelete = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
    id: '',
    name: '',
    username: '',
    email: '',
    role: '',
})
const defaultItem = ref({
    id: '',
    name: '',
    username: '',
    email: '',
    role: 'registered',
})
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'Nový uživatel' : 'Editace uživatele'
})
function editItem(item: User) {
    editedIndex.value = items.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialog.value = true
}
function deleteItem(item: User) {
    editedIndex.value = items.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialogDelete.value = true
}
function deleteItemConfirm() {

    const index = editedIndex.value;
    axios.delete(`admin/users/${editedItem.value.id}`).then(() => {
        items.value.splice(index, 1)
    }).catch(error => {
        error.value = error.message;
        console.error(error.message);
    })
    closeDelete()
}
function close() {
    dialog.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
    })
}
function closeDelete() {
    dialogDelete.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
    })
}
function save() {

    const item = editedItem.value;
    const index = editedIndex.value;

    if (editedIndex.value > -1) {
        axios.put(`admin/users/${editedItem.value.id}`, editedItem.value).then(() => {
            Object.assign(items.value[index], item)
        }).catch(error => {
            error.value = error.message;
            console.error(error.message);
        })
    } else {
        axios.post('admin/users', editedItem.value).then(() => {
            items.value.push(item)
        }).catch(error => {
            error.value = error.message;
            console.error(error.message);
        })
    }
    close()
}
watch(dialog, val => {
    val || close()
})
watch(dialogDelete, val => {
    val || closeDelete()
})

</script>


<style scoped lang="scss">
.v-card {
    padding: 20px;
}
</style>