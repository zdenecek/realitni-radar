<template>
    <v-card class="form-card">
        <div class="card-header">
            <slot name="header">
                <h2>Změna hesla</h2>
            </slot>
        </div>

        <div class="fields">
            <slot></slot>
        </div>

        <v-card-actions>
            <slot name="actions">
            </slot>
        </v-card-actions>
    </v-card>
</template>

<style>
.card-header {
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-card {
    padding: 30px 30px 10px;
    width: 450px;
}

.mobile .form-card {
    width: unset;
}

.actions {
    display: flex;
    justify-content: space-between;
}

.fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 20px;

    margin: 20px 0;
}
</style>