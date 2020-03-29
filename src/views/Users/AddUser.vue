<template>
    <div class="row">
        <div class="col-12 px-0 row">
            <base-input v-model="user.name" label="Name" class="col-12" maxlength="200"></base-input>
            <base-input v-model="user.email" label="Email" class="col-12 col-md-6" maxlength="200"></base-input>
            <base-input v-model="user.phone" label="Phone" class="col-12 col-md-6" maxlength="200"></base-input>
            <base-input v-model="user.localbody" label="Pachayath or Municipality" class="col-12 col-md-6" maxlength="200"></base-input>
            <base-input v-model="user.ward" label="Ward" class="col-12 col-md-6" maxlength="200"></base-input>
            <base-input v-model="user.district" label="District" class="col-12 col-md-6" maxlength="200"></base-input>
            <base-input v-model="user.state" label="State" class="col-12 col-md-6" maxlength="200"></base-input>
            <base-input v-model="user.usergroup" label="Group" class="col-12" maxlength="200"></base-input>
        </div>
    </div>
</template>
<script>
export default {
    name: 'add-user',
    data: () => ({
        user: {
            state: 'Kerala'
        },
        localbodies: [],
    }),
    methods: {
        listLocalbodies() {
            this.$axios({
                method: 'get',
                url: '/localbodies/list',
            }).then((response) => {
                const localbodies = response.data.localbodies.rows;

                this.localbodies = localbodies;
            });
        },
    }
}
</script>
