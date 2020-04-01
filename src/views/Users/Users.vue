<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div  class="card-header d-flex justify-content-between flex-column flex-md-row align-items-center">
                            <h3>Users</h3>
                            <div class="d-flex align-items-center justify-content-around flex-column flex-md-row">
                                <!-- FILTER BY USERGROUP -->
                                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                                <base-dropdown v-else position="right" class="mb-2 mb-md-0">
                                    <base-button slot="title" type="primary" class="dropdown-toggle" size="sm">
                                        {{ usergroup.name || 'User group' }}
                                    </base-button>
                                    <a class="dropdown-item text-black"
                                        v-for="(item, index) in activeUsergroups"
                                        :key="index"
                                        @click="usergroup = Object.assign({}, item)"
                                    >
                                        {{ item.name }}
                                    </a>
                                </base-dropdown>
                            </div>
                        </div> <!-- Outer Header -->
                        <div class="card-body table-responsive p-0 custom__scrollbar">
                            <base-table
                                :data="users"
                                type="hover table-striped table-sm"
                            >
                                <template slot="columns">
                                    <th class="text-left">Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th></th>
                                </template>

                                <template slot-scope="{row}">
                                    <td class="text-left">
                                        {{ row.name || 'N/A' }}
                                    </td>
                                    <td>
                                        {{ row.email || 'N/A' }}
                                    </td>
                                    <td>
                                        {{ row.phone || 'N/A' }}
                                    </td>
                                    <td>
                                        <div v-if="currentUsergroup.rank > 2 && ( row.usergroup === 'delivery' || row.usergroup === 'storeowner')">
                                            <base-button
                                                v-if="!row.store.length && !storeLoading && ( row.usergroup === 'delivery' || row.usergroup === 'storeowner')"
                                                icon="fa fa-store"
                                                size="sm"
                                                type="success"
                                                title="Add User to a store in their localbody. Localbody store has to be created first."
                                                @click="addStore(row.user_id)"
                                            ></base-button>
                                            <loading v-if="storeLoading === row.user_id" size="sm"/>
                                        </div>
                                    </td>
                                </template>
                            </base-table> <!-- Table -->
                            <div class="over__lay d-flex align-items-center" v-if="loading">
                                <loading color="dark"/>
                            </div>
                        </div> <!-- card body -->
                        <div class="card-footer">
                            <div class="d-flex justify-content-end mb-3">
                                <base-button type="success" @click="addModal = true">
                                    <font-awesome-icon icon="plus" class="mr-2"/>
                                    Create User
                                </base-button>
                            </div>
                            <base-pagination
                                :page-count="total_pages"
                                v-model="page"
                                align="center">
                            </base-pagination>
                        </div> <!-- card footer -->
                    </div> <!-- Outer Card -->
                </div>
            </div>
        </div>
        <!-- ADD USER MODAL -->
        <modal :show.sync="addModal" modalClasses="modal-dialog-scrollable" :clickOut="false">
            <template slot="header">
                <h1 class="modal-title">Add User</h1>
            </template>
            <div class="container">
                <add-user :key="Date.now()"
                    @close="addModal = false"
                    :localbodies.sync="localbodies"
                    :districts.sync="districts"
                ></add-user>
            </div>
        </modal>
    </div>
</template>
<script>
import AddUser from './AddUser';

export default {
    name: 'users',
    components: {
        AddUser,
    },
    data: () => ({
        page: 1,
        per_page: 20,
        count: 0,
        users: [],
        total_pages: 0,
        usergroup: { id: 'user', name: 'Customers', rank: 0 },
        pageLoading: null,
        loading: null,
        usergroups: [
            { id: 'user', name: 'Customers', rank: 0 },
            { id: 'delivery', name: 'Delivery', rank: 1 },
            { id: 'storeowner', name: 'Manager', rank: 2 },
            { id: 'admin', name: 'Admin', rank: 3 },
            { id: 'superadmin', name: 'Super Admin', rank: 4 },
        ],
        addModal: false,
        localbodies: [],
        districts: [],
        storeLoading: null,
        currentUserProfile: {},
    }),
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
        },
        currentUsergroup() {
            const currentUsergroup = this.currentUser.usergroup;
            const currentGroup = this.usergroups.find((item) => item.id === currentUsergroup );
            return currentGroup;
        }
    },
    watch: {
        page() {
            this.refreshPage();
        },
        usergroup() {
            this.refreshPage();
        }
    },
    methods: {
        getUsers(page, per_page, usergroup = null, localbody_id = null) {
            this.loading = true;

            this.$axios({
                method: 'get',
                url: '/users/profiles',
                params: {
                    page,
                    per_page,
                    ...(usergroup && { usergroup }),
                    localbody_id
                },
            }).then((response) => {
                const data = response.data.data;
                this.users = data.rows;
                this.count = data.count;
                this.total_pages = data.total_pages;
                console.log(this.users);
            }).finally(() => {
                this.loading = false;
            });
        },
        getCurrentUserProfile() {
            const userId = this.currentUser.user_id;

            this.$axios({
                method: 'get',
                url: `/users/profile/${userId}`,
            }).then((response) => {
                const data = response.data.data;
                this.currentUserProfile = data.user;
                if(
                    this.currentUserProfile.localbody &&
                    this.currentUserProfile.localbody.localbody_id &&
                    this.currentUserProfile.usergroup != 'admin' &&
                    this.currentUserProfile.usergroup != 'superadmin'
                ) {
                    this.getUsers(
                        this.page,
                        this.per_page,
                        this.usergroup.id,
                        this.currentUserProfile.localbody.localbody_id
                    );
                } else {
                    this.getUsers(
                        this.page,
                        this.per_page,
                        this.usergroup.id
                    );
                }
            });
        },
        listLocalbodies() {
            this.$axios({
                method: 'get',
                url: '/localbodies/list',
            }).then((response) => {
                const localbodies = response.data.localbodies.rows;

                this.localbodies = localbodies;
            });
        },
        listDistricts() {
            this.$axios({
                method: 'get',
                url: '/localbodies/districts',
            }).then((response) => {
                const districts = response.data.districts;

                this.districts = districts.rows;
            });
        },
        refreshPage() {
            if(
                this.currentUserProfile.usergroup != 'admin' &&
                this.currentUserProfile.usergroup != 'superadmin'
            ) {
                this.getUsers(
                    this.page,
                    this.per_page,
                    this.usergroup.id,
                    this.currentUserProfile.localbody.localbody_id
                );
            } else {
                this.getUsers(
                    this.page,
                    this.per_page,
                    this.usergroup.id
                );
            }
        },
        addStore(user_id) {
            this.storeLoading = user_id;

            this.$axios({
                method: 'post',
                url: '/users/store/add',
                data: {
                    user_id,
                }
            }).then((response) => {
                if(response.data && response.data.status === 'success'){
                    this.$success('Added to Store.');
                } else {
                    throw new Error('User not added to Store.');
                }
            }).catch(() => {
                this.$error('User not added to Store.');
            }).finally(() => {
                this.storeLoading = null;
                this.refreshPage();
            });
        }
    },
    mounted() {
        this.getCurrentUserProfile()
        this.listLocalbodies();
        this.listDistricts();
    }
};
</script>
<style scoped>
th, td {
    text-align: center;
}
</style>
