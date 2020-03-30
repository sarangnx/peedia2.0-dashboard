<template>
    <div class="row">
        <div class="col-12 px-0 d-flex flex-wrap">
            <base-input
                v-model="user.name"
                label="Name"
                class="col-12" maxlength="200"
                :disabled="loading"
                :error="$v.user.name.$error ? 'Name Required' : null"
            ></base-input>
            <base-input
                v-model="user.email"
                label="Email"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
                :error="$v.user.email.$error ? 'Email Required' : null"
            ></base-input>
            <base-input
                v-model="user.phone"
                label="Phone"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
            ></base-input>
            <div class="col-12 col-md-6">
                <base-dropdown class="w-100" menuClasses="drop__down">
                    <base-input
                        :disabled="loading"
                        v-model="user.localbody.name"
                        label="Pachayath or Municipality"
                        maxlength="200"
                        @keyup="suggestLocalbody()"
                        slot="title"
                        :error="$v.user.localbody.localbody_id.$error ? 'Select valid localbody from list' : null"
                    ></base-input>
                    <a class="dropdown-item" v-if="!localbodyDropdown.length">Search localbody...</a>
                    <a v-else
                        class="dropdown-item"
                        v-for="(item, index) in localbodyDropdown"
                        :key="index"
                        @click="user.localbody = Object.assign({}, item)"
                    >
                        {{ item.name }}
                    </a>
                </base-dropdown>
            </div>
            <base-input
                v-model="user.ward"
                type="number" label="Ward"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
                :error="$v.user.ward.$error ? 'Ward Required' : null"
            ></base-input>
            <base-input
                v-model="user.district"
                label="District"
                class="col-12 col-md-6" maxlength="200"
                :disabled="loading"
                :error="$v.user.district.$error ? 'District Required' : null"
            ></base-input>
            <base-input
                v-model="user.state"
                label="State"
                class="col-12 col-md-6"
                maxlength="200"
                :disabled="loading"
                :error="$v.user.state.$error ? 'State Required' : null"
            ></base-input>
            <div class="col-12">
                <base-dropdown class="w-100" direction="up" menuClasses="drop__down">
                    <base-input
                        :disabled="loading"
                        v-model="user.usergroup.name"
                        label="Group"
                        maxlength="200"
                        slot="title"
                        @keyup="$set(user.usergroup, 'id', null)"
                        :error="$v.user.usergroup.id.$error ? 'Group Required' : null"
                    ></base-input>
                    <a
                        class="dropdown-item"
                        v-for="(item, index) in activeUsergroups"
                        :key="index"
                        @click="user.usergroup = Object.assign({}, item)"
                    >
                        {{ item.name }}
                    </a>
                </base-dropdown>
            </div>
            <base-button :disabled="loading" block @click="upload">Add User</base-button>
        </div>
        <div class="over__lay d-flex align-items-center" v-if="loading">
            <loading/>
        </div>
    </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
    name: 'add-user',
    data: () => ({
        user: {
            name: null,
            email: null,
            phone: null,
            ward: null,
            district: null,
            state: 'Kerala',
            localbody: {
                localbody_id: null,
            },
            usergroup: {
                id: null,
                name: null
            }
        },
        localbodies: [],
        searchDropdown: null,
        localbodyDropdown: [],
        usergroups: [
            { id: 'user', name: 'Customers', rank: 0 },
            { id: 'delivery', name: 'Delivery', rank: 1 },
            { id: 'storeowner', name: 'Manager', rank: 2 },
            { id: 'admin', name: 'Admin', rank: 3 },
            { id: 'superadmin', name: 'Super Admin', rank: 4 },
        ],
        loading: false,
    }),
    validations() {
        let schema = {
            user: {
                name: {
                    required,
                },
                email: {
                    required,
                },
                usergroup: {
                    id: {
                        required
                    },
                },
            },
        }

        if(
            this.user.usergroup.id === 'user' ||
            this.user.usergroup.id === 'delivery' ||
            this.user.usergroup.id === 'storeowner'
        ) {
            schema.user = Object.assign({}, schema.user, {
                ward: {
                    required,
                },
                district: {
                    required,
                },
                state: {
                    required,
                },
                localbody: {
                    localbody_id: {
                        required,
                    },
                }
            });
        } else {
            schema.user = Object.assign({}, schema.user, {
                ward: {},
                district: {},
                state: {},
                localbody: {
                    localbody_id: {}
                }
            });
        }

        return schema;
    },
    computed: {
        currentUser() {
            return this.$store.getters.getUser;
        },
        activeUsergroups() {
            const currentUsergroup = this.currentUser.usergroup;
            const currentGroup = this.usergroups.find((item) => item.id === currentUsergroup );
            return this.usergroups.filter((usergroup) => {
                return usergroup.rank < currentGroup.rank;
            });
        }
    },
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
        suggestLocalbody() {
            const search = this.user.localbody.name;
            // remove id so that error is displayed
            this.user.localbody.localbody_id = null;

            if(search === ''){
                this.localbodyDropdown = [];
                this.searchDropdown = false;
                return;
            }

            const regEx = new RegExp(search, 'i');

            this.localbodyDropdown = this.localbodies.filter(item => item.name.match(regEx));
            this.searchDropdown = true;
        },
        upload() {
            this.$v.$touch();
            if( this.$v.$invalid ){
                return;
            }
            this.loading = true;

            const data = Object.assign({}, this.user);
            data.localbody_id = data.localbody? data.localbody.localbody_id : null;
            data.usergroup = data.usergroup? data.usergroup.id : null;
            delete data.localbody;

            this.$axios({
                method: 'post',
                url: `/users/add`,
                data: data,
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "User Added."
                    });
                    this.$emit('close');
                } else {
                    throw new Error('User Not Added.')
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong",
                    message: "User Not Added."
                });
            }).finally(() => {
                this.loading = false;
            });
        }
    },
    mounted() {
        this.listLocalbodies();
    }
}
</script>
<style>
.drop__down.dropdown-menu {
    max-height: 250px;
    overflow: auto;
}

.drop__down.dropdown-menu::-webkit-scrollbar {
    width: 5px;
}

.drop__down.dropdown-menu::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
}

.drop__down.dropdown-menu::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}
.over__lay {
    opacity: 0.4;
    position: absolute;
    top: 0;
    left: 0;
    background-color: black;
    width: 100%;
    z-index: 5000;
    height: 100%;
}
</style>
