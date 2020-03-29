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
                        <div  class="card-header d-flex justify-content-between">
                            <h2>Most Sold Products</h2>
                        </div>
                        <div class="card-body">
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
        most_sold: []
    }),
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.serverUrl;
        },
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
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
        }
    },
    mounted() {
        // this.getStats(this.storeId);
    }
  };
</script>
<style scoped>
.item-image {
    max-width: 100%;
    height: 25px;
}
</style>
