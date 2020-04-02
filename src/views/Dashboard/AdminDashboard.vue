<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <!-- Card stats -->
            <div class="row">
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Total Users"
                                type="gradient-red"
                                :sub-title="total_users.toString()"
                                icon="fa fa-users"
                                class="mb-4 mb-xl-0"
                    >
                    </stats-card>
                </div>
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Total Orders"
                                type="gradient-orange"
                                :sub-title="total_orders.toString()"
                                icon="fa fa-shopping-basket"
                                class="mb-4 mb-xl-0"
                    >
                    </stats-card>
                </div>
            </div>
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <base-table
                                    :data="localbodies"
                                    type="hover table-striped table-sm"
                                >
                                    <template slot="columns">
                                        <th>#</th>
                                        <th>Localbody Name</th>
                                        <th class="text-center">Customers</th>
                                        <th class="text-center">Delivery Personnel</th>
                                        <th class="text-center">Managers</th>
                                    </template>

                                    <template slot-scope="{row, index}">
                                        <td class="text-left">
                                            {{ index + 1 }}
                                        </td>
                                        <td class="text-left">
                                            {{ row.name }}
                                        </td>
                                        <td class="text-center">
                                            {{ row.user.count }}
                                        </td>
                                        <td class="text-center">
                                            {{ row.delivery.count }}
                                        </td>
                                        <td class="text-center">
                                            {{ row.manager.count }}
                                        </td>
                                    </template>
                                </base-table> <!-- Table -->
                            </div> <!-- responsive-table -->
                        </div>
                    </div>
                </div>
                <div class="col-12 mt-5">
                    <div class="card shadow">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <base-table
                                    :data="most_sold"
                                    type="hover table-striped table-sm"
                                >
                                    <template slot="columns">
                                        <th>#</th>
                                        <th>Item</th>
                                        <th>Total  Orders</th>
                                    </template>

                                    <template slot-scope="{row, index}">
                                        <td class="text-left">
                                            {{ index + 1 }}
                                        </td>
                                        <td>
                                            <img v-if="row.item_details.image_path" :src="`${baseUrl}/images/inventory/${row.item_details.image_path}`" class="item-image">
                                            <i v-else class="fa fa-image"></i> <!-- Alt Image -->
                                            {{ row.item_details.item_name }}
                                        </td>
                                        <td>
                                            {{ parseInt(row.occurance) }}
                                        </td>
                                    </template>
                                </base-table> <!-- Table -->
                            </div> <!-- responsive-table -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    data: () => ({
        total_orders: 0,
        total_users: 0,
        most_sold: [],
        stats: {},
        localbodies: [],
    }),
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.serverUrl;
        },
        storeId() {
            const user = this.$store.getters.getUser;
            if( user.store && user.store.length ){
                return user.store[0].store_id;
            }
            else {
                return null;
            }
        }
    },
    methods: {
        getStats(store_id) {
            this.$axios({
                method: 'get',
                url: '/store/dashboard',
                params: {
                    store_id: store_id,
                },
            }).then((response) => {
                const stats = response.data.data;
                this.total_orders = stats.total_orders;
                this.total_users = stats.total_users;
                this.most_sold = stats.most_sold_items;
            });
        },
        getUserStats(store_id) {
            this.$axios({
                method: 'get',
                url: '/users/stats',
            
            }).then((response) => {
                const stats = response.data.stats;
                this.localbodies = stats.localbodies.map((localbody) =>{
                    localbody.user = stats.user.find((item) => item.localbody_id === localbody.localbody_id);
                    localbody.manager = stats.manager.find((item) => item.localbody_id === localbody.localbody_id);
                    localbody.delivery = stats.delivery.find((item) => item.localbody_id === localbody.localbody_id);
                    return localbody;
                });
                this.stats = stats
            });
        }
    },
    mounted() {
        this.getStats(this.storeId);
        this.getUserStats();
    }
  };
</script>
<style scoped>
.item-image {
    max-width: 100%;
    height: 25px;
}
</style>
