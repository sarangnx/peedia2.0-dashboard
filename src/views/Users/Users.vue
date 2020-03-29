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
                        <div class="card-body table-responsive">
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
                                        <base-button
                                            v-if="!row.blocked"
                                            icon="fa fa-user-slash"
                                            size="sm"
                                            type="danger"
                                            title="Block User"
                                            @click="true"
                                        ></base-button>
                                        <base-button
                                            v-else
                                            icon="fa fa-user"
                                            size="sm"
                                            type="success"
                                            title="Unblock User"
                                            @click="true"
                                        ></base-button>
                                    </td>
                                </template>
                            </base-table> <!-- Table -->
                        </div> <!-- card body -->
                        <div class="card-footer">
                            <div class="d-flex justify-content-end mb-3">
                                <base-button type="success">
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
        <modal :show.sync="addModal">
            <template slot="header">
                <h1 class="modal-title">Add User</h1>
            </template>
            <div class="container">
                <add-user></add-user>
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
        usergroups: [
            { id: 'user', name: 'Customers', rank: 0 },
            { id: 'delivery', name: 'Delivery', rank: 1 },
            { id: 'storeowner', name: 'Manager', rank: 2 },
            { id: 'admin', name: 'Admin', rank: 3 },
            { id: 'superadmin', name: 'Super Admin', rank: 4 },
        ],
        addModal: true
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
        getUsers(page, per_page, usergroup = null) {
            this.$axios({
                method: 'get',
                url: '/users/profiles',
                params: {
                    page,
                    per_page,
                    ...(usergroup && { usergroup }),
                },
            }).then((response) => {
                const data = response.data.data;
                this.users = data.rows;
                this.count = data.count;
                this.total_pages = data.total_pages;
            });
        },
        refreshPage() {
            this.getUsers(this.page, this.per_page, this.usergroup.id);
        }
    },
    mounted() {
        this.getUsers(this.page, this.per_page, this.usergroup.id);
    }
};
</script>
<style scoped>
th, td {
    text-align: center;
}
</style>
