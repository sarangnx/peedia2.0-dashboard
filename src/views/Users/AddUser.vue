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
            <base-input
                v-model="user.state"
                label="State"
                class="col-12 col-md-6"
                maxlength="200"
                :disabled="loading"
                :error="$v.user.state.$error ? 'State Required' : null"
            ></base-input>
            <div class="form-group col-12 col-md-6">
                <label class="form-control-label">District</label>
                <select v-model="user.district" class="custom-select mr-sm-2"
                    @change="selectedDistrict = user.district"
                    :class="[{'is-invalid': $v.user.district.$error}]"
                    :disabled="loading"
                >
                    <option
                        class="text-capitalize"
                        v-for="(district, index) in districts"
                        :key="index"
                    >
                        {{ district.name }}
                    </option>
                </select>
                <div class="text-danger invalid-feedback" style="display: block;" v-if="$v.user.district.$error">
                    District Required
                </div>
            </div>
            <div class="col-12 col-md-6">
                <base-dropdown class="w-100" menuClasses="drop__down">
                    <base-input
                        :disabled="loading"
                        v-model="user.localbody.name"
                        label="Panchayath or Municipality"
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
            <loading color="dark"/>
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
        selectedDistrict: null,
        activeLocalbodies: [], // localbodies in a district
    }),
    props: {
        localbodies: {
            type: Array,
            default: () => ([]),
        },
        districts: {
            type: Array,
            default: () => ([]),
        },
    },
    watch: {
        selectedDistrict() {
            this.filterLocalbodies();
        }
    },
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

            this.localbodyDropdown = this.activeLocalbodies.filter(item => item.name.match(regEx));
            this.searchDropdown = true;
        },
        filterLocalbodies() {
            this.activeLocalbodies = this.localbodies.filter((item) => {
                if (item.district === this.selectedDistrict) {
                    return item;
                }
            });
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
                    this.$success('User Added.');
                    this.$emit('close');
                } else {
                    throw new Error('User Not Added.')
                }
            }).catch(() => {
                this.$error('User Not Added.');
            }).finally(() => {
                this.loading = false;
            });
        },
    },
}
</script>
