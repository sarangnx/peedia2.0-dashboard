<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <!-- Card stats -->
            <div class="row">
                <div class="col-sm-6 col-md-3">
                    <stats-card title="Total Orders"
                                type="gradient-red"
                                :sub-title="stats.total.toString()"
                                class="mb-4 mb-xl-0">
                    </stats-card>
                </div>
                <div class="col-sm-6 col-md-3">
                    <stats-card title="Today's Orders"
                                type="gradient-orange"
                                :sub-title="stats.total_today.toString()"
                                class="mb-4 mb-xl-0">
                    </stats-card>
                </div>
                <div class="col-sm-6 col-md-3">
                    <stats-card title="Items Pending"
                                type="gradient-green"
                                :sub-title="stats.pending.toString()"
                                class="mb-4 mb-xl-0">
                    </stats-card>

                </div>
                <div class="col-sm-6 col-md-3">
                    <stats-card title="Out for Delivery"
                                type="gradient-info"
                                :sub-title="stats.outfordelivery.toString()"
                                class="mb-4 mb-xl-0">
                    </stats-card>
                </div>
            </div>
        </base-header>
        <!-- Tables -->
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <orders-table title="Orders" :user="user"></orders-table>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import io from 'socket.io-client';
import OrdersTable from './OrdersTable';

export default {
    name: 'orders',
    components: {
        OrdersTable
    },
    data: () => ({
        stats: {
            total: 0,
            total_today: 0,
            pending: 0,
            processing: 0,
            ready: 0,
            outfordelivery: 0,
            delivered: 0,
            cancelled: 0
        },
        user: {}
    }),
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.serverUrl;
        },
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        },
        userId() {
            return this.$store.getters.getUser.user_id;
        }
    },
    methods: {
        getStats(store_id) {
            this.$axios({
                method: 'get',
                url: '/orders/stats',
                params: {
                    store_id: store_id,
                },
            }).then((response) => {
                this.stats = Object.assign({}, this.stats, response.data.data.stats);
            });
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
        this.getStats(this.storeId);
        this.getUser();

        // create a socket connection to server.
        const socket = io(this.baseUrl);

        // Reload the stats
        socket.on('new-order', () => {
            this.getStats(this.storeId);
        });

        socket.on('cancel-order', () => {
            this.getStats(this.storeId);
        });

        socket.on('status-change-order', () => {
            this.getStats(this.storeId);
        });
    },
};
</script>
