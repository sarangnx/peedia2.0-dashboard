<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div  class="card-header d-flex justify-content-between flex-column flex-md-row align-items-center">
                            <h3>Ration</h3>
                            <div class="d-flex align-items-center justify-content-around flex-column flex-md-row">
                                <!-- FILTER BY DISTRICT -->
                                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                                <base-dropdown v-else position="right" class="mb-2 mb-md-0" menuClasses="drop__down custom__scrollbar">
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
                                        @click="selectedDistrict = item.name"
                                    >
                                        {{ item.name }}
                                    </a>
                                </base-dropdown>
                            </div>
                        </div> <!-- Outer Header -->
                        <div class="card-body table-responsive p-0 custom__scrollbar">
                            <base-table
                                :data="rations"
                                type="hover table-striped table-sm"
                            >
                                <template slot="columns">
                                    <th class="text-left">Name</th>
                                    <th>Phone</th>
                                    <th>Aadhar</th>
                                    <th>Ration Card</th>
                                    <th>Address</th>
                                </template>

                                <template slot-scope="{row}">
                                    <td class="text-left">
                                        {{ row.name || 'N/A' }}
                                    </td>
                                    <td>
                                        {{ row.phone || 'N/A' }}
                                    </td>
                                    <td>
                                        {{ row.aadhar_no || 'N/A' }}
                                    </td>
                                    <td>
                                        {{ row.card_no || 'N/A' }}
                                    </td>
                                    <td class="text-left">
                                        <div v-if="row.user && row.user.house">
                                            <small class="text-muted font-weight-bold">House:</small> {{row.user.house}}
                                        </div>
                                        <div v-if="row.user && row.user.area">
                                            <small class="text-muted font-weight-bold">Area:</small> {{row.user.area}},
                                        </div>
                                        <div v-if="row.user && row.user.landmark">
                                            <small class="text-muted font-weight-bold">Landmark:</small> {{row.user.landmark}}
                                        </div>
                                        <div v-if="row.user && row.user.district">
                                            <small class="text-muted font-weight-bold">District:</small> {{row.user.district}},
                                        </div>
                                        <div v-if="row.user && row.user.pincode">
                                            <small class="text-muted font-weight-bold">Pincode:</small> {{row.user.pincode}},
                                        </div>
                                        <div v-if="row.user && row.user.ward">
                                            <small class="text-muted font-weight-bold">Ward:</small> {{row.user.ward}}
                                        </div>
                                        <div v-if="row.user && row.user.localbody && row.user.localbody.name">
                                            <small class="text-muted font-weight-bold">Localbody:</small> {{row.user.localbody.name}}
                                        </div>
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
    </div>
</template>
<script>
export default {
    name: 'ration',
    data: () => ({
        page: 1,
        per_page: 20,
        count: 0,
        total_pages: 0,
        pageLoading: null,
        addModal: false,
        localbodies: [],
        rations: [],
        districts: [],
        selectedDistrict: null
    }),
    computed: {
        currentUser() {
            return this.$store.getters.getUser;
        },
    },
    watch: {
        page() {
            this.refreshPage();
        },
        selectedDistrict() {
            this.refreshPage();
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
        listRation() {
            const page = this.page;
            const per_page = this.per_page;
            const district = this.selectedDistrict;
            const localbody_id = this.localbody_id;

            this.$axios({
                method: 'get',
                url: '/ration/list',
                params: {
                    page,
                    per_page,
                    district,
                    localbody_id,
                }
            }).then((response) => {
                const rations = response.data.rations;

                this.rations = rations.rows;
                this.count = rations.count;
                this.total_pages = Math.ceil(this.count/this.per_page);
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
            this.listRation();
        }
    },
    mounted() {
        this.listDistricts();
        this.listLocalbodies();
        this.listRation();
    }
};
</script>
<style>
th, td {
    text-align: center;
}

.drop__down.dropdown-menu {
    max-height: 250px;
    overflow: auto;
}
</style>
