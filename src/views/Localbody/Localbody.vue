<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div  class="card-header d-flex justify-content-between flex-column flex-md-row align-items-center">
                            <h3>Localbodies</h3>
                            <div class="d-flex align-items-center justify-content-around flex-column flex-md-row">
                                <!-- FILTER BY DISTRICT -->
                                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                                <base-dropdown v-else position="right" class="mb-2 mb-md-0">
                                    <base-button slot="title" type="primary" class="dropdown-toggle text-capitalize" size="sm">
                                        {{ selectedDistrict || 'District' }}
                                    </base-button>
                                    <a class="dropdown-item text-black"
                                        @click="selectedDistrict = null"
                                    >
                                        All
                                    </a>
                                    <a class="dropdown-item text-black text-capitalize"
                                        v-for="(item, index) in districts"
                                        :key="index"
                                        @click="selectedDistrict = item"
                                    >
                                        {{ item }}
                                    </a>
                                </base-dropdown>
                            </div>
                        </div> <!-- Outer Header -->
                        <div class="card-body table-responsive">
                            <base-table
                                :data="localbodies"
                                type="hover table-striped table-sm"
                            >
                                <template slot="columns">
                                    <th class="text-left">Name</th>
                                    <th>District</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Total wards</th>
                                    <th>Type</th>
                                    <th></th>
                                </template>

                                <template slot-scope="{row}">
                                    <td class="text-left text-capitalize">
                                        {{ row.name || 'N/A' }}
                                    </td>
                                    <td class="text-capitalize">
                                        {{ row.district || 'N/A' }}
                                    </td>
                                    <td>
                                        {{ row.email || 'N/A' }}
                                    </td>
                                    <td>
                                        <div v-if="row.phone">
                                            <strong>General:</strong> {{ row.phone || 'N/A' }}
                                        </div>
                                        <div v-if="row.emergency_phone">
                                            <strong>Emergency:</strong> {{ row.emergency_phone || 'N/A' }}
                                        </div>
                                        <div v-if="row.kitchen_phone">
                                            <strong>Kitchen:</strong> {{ row.kitchen_phone || 'N/A' }}
                                        </div>
                                    </td>
                                    <td>
                                        {{ row.total_wards || 'N/A' }}
                                    </td>
                                    <td class="text-capitalize">
                                        {{ row.type || 'N/A' }}
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
                ></add-user>
            </div>
        </modal>
    </div>
</template>
<script>
import AddUser from './AddUser';

export default {
    name: 'localbody',
    components: {
        AddUser,
    },
    data: () => ({
        page: 1,
        per_page: 20,
        count: 0,
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
        addModal: false,
        localbodies: [],
        districts: [],
        selectedDistrict: null,
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
        listLocalbodies() {
            const page = this.page;
            const per_page = this.per_page;

            this.$axios({
                method: 'get',
                url: '/localbodies/list',
                params: {
                    page,
                    per_page,
                },
            }).then((response) => {
                const localbodies = response.data.localbodies;

                this.localbodies = localbodies.rows;
                this.count = localbodies.count;
                this.total_pages = Math.ceil( this.count/this.per_page );
                this.districts = this.localbodies.map(item => item.district);
                this.districts = [ ...new Set(this.districts) ]; // remove duplicates
            });
        },
        refreshPage() {
            this.listLocalbodies();
        }
    },
    mounted() {
        this.listLocalbodies();
    }
};
</script>
<style scoped>
th, td {
    text-align: center;
}
</style>
