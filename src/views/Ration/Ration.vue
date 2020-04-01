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
                                    <base-button slot="title" type="primary" class="dropdown-toggle text-capitalize" size="sm" :disabled="init && selectedDistrict">
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
                                <!-- FILTER BY LOCALBODY -->
                                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                                <base-dropdown v-else-if="activeLocalbodies.length" position="right" class="mb-2 mb-md-0">
                                    <base-button slot="title" type="primary" class="dropdown-toggle" size="sm" :disabled="init && selectedLocalbody">
                                        {{ selectedLocalbody ? selectedLocalbody.name : 'Panchayath or Municipality' }}
                                    </base-button>
                                    <a class="dropdown-item text-black" @click="selectedLocalbody =  null">All</a>
                                    <a class="dropdown-item text-black"
                                        v-for="(localbody, index) in activeLocalbodies"
                                        :key="index"
                                        @click="selectedLocalbody = Object.assign({}, localbody)"
                                    >
                                        {{ localbody.name }}
                                    </a>
                                </base-dropdown>
                                <!-- FILTER BY WARD -->
                                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                                <base-input v-else-if="selectedLocalbody && selectedLocalbody.localbody_id"
                                    class="m-0 mr-2 input__height mb-2 mb-md-0"
                                    type="number"
                                    min="1"
                                    max="1000"
                                    v-model="ward"
                                    placeholder="ward"
                                >
                                </base-input>
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
                            <div class="over__lay d-flex align-items-center" v-if="pageLoading">
                                <loading color="dark"/>
                            </div>
                        </div> <!-- card body -->
                        <div class="card-footer">
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
        per_page: 10,
        count: 0,
        total_pages: 0,
        pageLoading: null,
        localbodies: [],
        rations: [],
        districts: [],
        selectedDistrict: null,
        activeLocalbodies: [], // localbodies in a district
        selectedLocalbody: null,
        ward: null,
        init: null,
        debounce: null,
        debounceerror: null,
        user: null,
    }),
    computed: {
        userId() {
            return this.$store.getters.getUser.user_id;
        },
    },
    watch: {
        page() {
            this.refreshPage();
        },
        per_page() {
            this.refreshPage();
        },
        selectedDistrict() {
            this.filterLocalbodies();
            this.refreshPage();
        },
        selectedLocalbody() {
            this.refreshPage();
        },
        ward() {
            clearTimeout(this.debounce);
            clearTimeout(this.debounceerror);
            if( this.ward > 0 && this.ward < 200 ) {
                this.debounce = setTimeout(() => {
                    this.refreshPage();
                }, 1000);
            } else if(!this.ward) {
                this.debounce = setTimeout(() => {
                    this.refreshPage();
                }, 1000);
            } else {
                this.debounceerror = setTimeout(() => {
                    this.$error('Invalid ward number.');
                }, 1000);
            }
        },
        user: {
            deep: true,
            handler() {
                this.initDropdown();
            }
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
        filterLocalbodies() {
            if(!this.init){
                this.selectedLocalbody = null;
            }
            this.activeLocalbodies = this.localbodies.filter((item) => {
                if (item.district === this.selectedDistrict) {
                    return item;
                }
            });
        },
        listRation() {
            this.pageLoading = true;
            const page = this.page;
            const per_page = this.per_page;
            const district = this.selectedDistrict;
            const localbody = this.selectedLocalbody ? this.selectedLocalbody.localbody_id : null;
            let ward = this.ward > 0 && this.ward < 200 ? this.ward : null;

            this.$axios({
                method: 'get',
                url: '/ration/list',
                params: {
                    page,
                    per_page,
                    district,
                    localbody,
                    ward,
                }
            }).then((response) => {
                const rations = response.data.rations;

                this.rations = rations.rows;
                this.count = rations.count;
                this.total_pages = Math.ceil(this.count/this.per_page);
            }).finally(() => {
                this.pageLoading = false;
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
        },
        initDropdown() {
            if(!this.user || !this.user.localbody){
                return;
            }

            this.init = true;
            // to force watch
            this.selectedDistrict = null;
            this.selectedDistrict = this.user.localbody.district;
            this.selectedLocalbody = null;
            const selectedLocalbody = this.localbodies.find((item) => item.localbody_id === this.user.localbody.localbody_id)
            this.selectedLocalbody = Object.assign({}, selectedLocalbody);
        },
        getUser() {
            const userId = this.userId;

            this.$axios({
                method: 'get',
                url: `/users/profile/${userId}`,
            }).then((response) => {
                this.user = Object.assign({}, response.data.data.user);
            });
        }
    },
    mounted() {
        this.getUser();
        this.listDistricts();
        this.listLocalbodies();
        this.listRation();
        this.initDropdown();
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
