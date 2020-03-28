<template>
    <div class="card shadow">
        <div  class="card-header d-flex justify-content-between flex-column flex-md-row align-items-center">
            <h3>Orders</h3>
            <div class="d-flex align-items-center justify-content-around flex-column flex-md-row">
                <!-- FILTER BY DISTRICT -->
                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                <base-dropdown v-else position="right" class="mb-2 mb-md-0">
                    <base-button slot="title" type="primary" class="dropdown-toggle" size="sm">
                        {{ selectedDistrict || 'District' }}
                    </base-button>
                    <a class="dropdown-item text-black" @click="selectedDistrict = 'All'">All</a>
                    <a class="dropdown-item text-black"
                        v-for="(district, index) in districts"
                        :key="index"
                        @click="selectedDistrict = district"
                    >
                        {{ district }}
                    </a>
                </base-dropdown>
                <!-- FILTER BY LOCALBODY -->
                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                <base-dropdown v-else-if="activeLocalbodies.length" position="right" class="mb-2 mb-md-0">
                    <base-button slot="title" type="primary" class="dropdown-toggle" size="sm">
                        {{ selectedLocalbody ? selectedLocalbody.name : 'Panchayath or Municipality' }}
                    </base-button>
                    <a class="dropdown-item text-black" @click="selectedLocalbody =  Object.assign({},{ name: 'All' })">All</a>
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
                >
                </base-input>
                <!-- FILTER BY STATUS -->
                <base-button size="sm" v-if="pageLoading"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                <base-dropdown v-else position="right" class="mb-2 mb-md-0">
                    <base-button slot="title" :type="badgeClass(status)" class="dropdown-toggle" size="sm">
                        {{ status || 'Status' }}
                    </base-button>
                    <a :class="['dropdown-item', `text-black`]" @click="status = 'ALL'">All</a>
                    <a :class="['dropdown-item', `text-${badgeClass('PENDING')}`]" @click="status = 'PENDING'">Pending</a>
                    <a :class="['dropdown-item', `text-grey`]" @click="status = 'PROCESSING'">Processing</a>
                    <a :class="['dropdown-item', `text-${badgeClass('READY')}`]" @click="status = 'READY'">Ready</a>
                    <a :class="['dropdown-item', `text-${badgeClass('OUTFORDELIVERY')}`]" @click="status = 'OUTFORDELIVERY'">Out for delivery</a>
                    <a :class="['dropdown-item', `text-${badgeClass('DELIVERED')}`]" @click="status = 'DELIVERED'">Delivered</a>
                    <a :class="['dropdown-item', `text-${badgeClass('CANCELLED')}`]" @click="status = 'CANCELLED'">Cancelled</a>
                </base-dropdown>
            </div>
        </div>
        <div class="card-body d-flex flex-row justify-content-around flex-wrap">
            <div
                v-for="(order, index) in tableData"
                :key="order.order_id"
                class="card border-light col-md-5 mb-2"
            >
                <div class="p-4">
                    <span :class="['badge', `badge-${badgeClass(order.order_status)}`]" >{{ order.order_status }}</span>
                    <div class="d-flex text-muted">
                        <h4 class="m-0 pr-2 text-muted">Order Date</h4>
                        <span>{{ formatDate(order.order_date) }}</span>
                    </div>
                    <div class="d-flex">
                        <h4 class="m-0 pr-2">Name</h4>
                        <span>{{order.user.name || order.user.email || 'not provided'}}</span>
                    </div>
                    <div class="d-flex flex-column">
                        <h4 class="m-0 pr-2">Address</h4>
                        <div class="d-flex flex-column" v-if="order.delivery_address">
                            <span v-if="order.delivery_address.house">{{order.delivery_address.house}},</span>
                            <span v-if="order.delivery_address.area">{{order.delivery_address.area}},</span>
                            <span v-if="order.delivery_address.landmark">
                                <small class="text-muted font-weight-bold">Landmark:</small> {{order.delivery_address.landmark}}
                            </span>
                            <span v-if="order.delivery_address.district || order.delivery_address.pincode">
                                <template v-if="order.delivery_address.district">
                                    {{order.delivery_address.district}},
                                </template>
                                <template v-if="order.delivery_address.pincode">
                                    {{order.delivery_address.pincode}},
                                </template>
                            </span>
                            <span v-if="order.delivery_address.ward">
                                <small class="text-muted font-weight-bold">Ward:</small> {{order.delivery_address.ward}}
                            </span>
                            <span v-if="order.user.localbody.name">
                                <small class="text-muted font-weight-bold">Localbody:</small> {{order.user.localbody.name}}
                            </span>
                        </div>
                        <div class="d-flex flex-column" v-else>
                            <span>Not Provided</span>
                        </div>
                    </div>
                    <div class="d-flex" v-if="order.delivery_address.phone || order.user.phone">
                        <h4 class="m-0 pr-2">Phone</h4>
                        <span>{{ order.delivery_address.phone || order.user.phone }}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <base-button @click="$set(modals, index, true)" size="sm">View Order</base-button>
                    <base-button size="sm" v-if="loading[index]"><i class="ni ni-settings-gear-65 spin"></i></base-button>
                    <base-dropdown v-else>
                        <base-button slot="title" :type="badgeClass(order.order_status)" class="dropdown-toggle" size="sm">
                            {{ order.order_status }}
                        </base-button>
                        <a :class="['dropdown-item', `text-${badgeClass('PENDING')}`]" @click="changeStatus('PENDING', index)">Pending</a>
                        <a :class="['dropdown-item', `text-grey`]" @click="changeStatus('PROCESSING', index)">Processing</a>
                        <a :class="['dropdown-item', `text-${badgeClass('READY')}`]" @click="changeStatus('READY', index)">Ready</a>
                        <a :class="['dropdown-item', `text-${badgeClass('OUTFORDELIVERY')}`]" @click="changeStatus('OUTFORDELIVERY', index)">Out for delivery</a>
                        <a :class="['dropdown-item', `text-${badgeClass('DELIVERED')}`]" @click="changeStatus('DELIVERED', index)">Delivered</a>
                        <a :class="['dropdown-item', `text-${badgeClass('CANCELLED')}`]" @click="changeStatus('CANCELLED', index)">Cancelled</a>
                    </base-dropdown>
                    <base-button 
                        @click.stop.prevent="deleteID = order.order_id; deleteModal = true; deleteIndex = index"
                        :disabled="deleteLoading"
                        size="sm"
                        type="danger"
                    >
                        <font-awesome-icon icon="trash-alt"/>
                    </base-button>
                </div>
                <!-- Modal -->
                <modal :show.sync="modals[index]">
                    <template slot="header">
                        <h5 class="modal-title">Order Items</h5>
                    </template>
                    <div>
                        <div class="table-responsive">
                            <base-table
                                :data="order.items"
                            >
                                <template slot="columns">
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                </template>
                                <template slot-scope="{row}">
                                    <td>
                                        {{ row.item_details.item_name }}
                                    </td>
                                    <td>
                                        {{ parseFloat(row.quantity) }}
                                        <span class="text-uppercase font-weight-bold">{{ row.unit }}</span>
                                    </td>
                                </template>
                            </base-table>
                        </div>
                    </div>
                    <template slot="footer">
                        <base-button type="secondary" @click="$set(modals, index, false)">Close</base-button>
                    </template>
                </modal>
                <!-- Modal -->
            </div>
        </div> <!-- Card body -->
        <div>
            <base-pagination 
                :page-count="total_pages"
                v-model="page"
                align="center">
            </base-pagination>
        </div>
        <!-- Delete Modal -->
        <modal :show.sync="deleteModal" gradient="danger">
            <template slot="header" v-if="!deleteLoading">
                <h5 class="modal-title">Delete Order</h5>
            </template>
            <div class="py-1 text-center" v-show="!deleteLoading">
                <h4 class="heading mt-4">Are you sure you want to delete this order?</h4>
                <p class="text-white">This action cannot be reverted.</p>
            </div>
            <loading v-if="deleteLoading" color="white"></loading>
            <template slot="footer" v-if="!deleteLoading">
                <base-button type="white"
                    @click="deleteOrder()"
                >
                    Ok, Delete
                </base-button>
                <base-button type="link"
                    text-color="white"
                    class="ml-auto"
                    @click="deleteID = null; deleteModal = false; deleteIndex = null"
                >
                    Close
                </base-button>
            </template>
        </modal> <!-- Delete Modal -->
    </div> <!-- Card -->
</template>
<script>
import io from 'socket.io-client';

export default {
    name: 'orders-table',
    props: {
        type: {
            type: String
        },
    },
    data() {
        return {
            tableData: [],
            count: 0,
            modals: [],
            loading: [], // for status change.
            pageLoading: false, // for page loading
            total_pages: 0,
            per_page: 10,
            page: 1,
            status: null,
            deleteModal: false,
            deleteID: null,
            deleteIndex: null,
            deleteLoading: null,
            localbodies: [],
            districts: [],
            selectedDistrict: null,
            activeLocalbodies: [], // localbodies in a district
            selectedLocalbody: null,
            ward: null,
            debounce: null, // for debounced request
            debounceerror: null, // for debounced error notification
        }
    },
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
        storeId() {
            return this.$store.getters.getUser.store[0].store_id;
        }
    },
    watch: {
        // whenever page changes, call getOrders
        page() {
            this.getOrders();
        },
        per_page() {
            this.getOrders();
        },
        status() {
            this.getOrders();
        },
        selectedDistrict() {
            this.filterLocalbodies();
            this.getOrders();
        },
        selectedLocalbody() {
            this.getOrders();
        },
        ward() {
            clearTimeout(this.debounce);
            clearTimeout(this.debounceerror);
            if( this.ward > 0 && this.ward < 200 ) {
                this.debounce = setTimeout(() => {
                    this.getOrders();
                }, 1000);
            } else if(!this.ward) {
                this.debounce = setTimeout(() => {
                    this.getOrders();
                }, 1000);
            } else {
                this.debounceerror = setTimeout(() => {
                    this.$notify({
                        type: "danger",
                        title: "Error",
                        message: "Invalid ward number."
                    });
                }, 1000);
            }
        }
    },
    methods: {
        getOrders() {

            const store_id = this.storeId;
            const page = this.page || 1;
            const per_page = this.per_page || 10;
            let status = this.status || 'ALL';
            let district = this.selectedDistrict || 'All';
            let localbody = this.selectedLocalbody ? this.selectedLocalbody.localbody_id : null;
            let ward = this.ward > 0 && this.ward < 200 ? this.ward : null;

            status = status === 'ALL' ? null : status;
            district = district === 'All' ? null : district;

            this.$axios({
                method: 'get',
                url: '/orders/view',
                params: {
                    store_id: store_id,
                    page: page,
                    per_page: per_page,
                    order_status: status,
                    district,
                    localbody,
                    ward,
                },
            }).then((response) => {
                let data = response.data.data.orders;

                this.tableData = data.rows;
                this.count = data.count;
                this.total_pages = data.total_pages;
                // initialize array
                this.modals = Array.from({length: this.count}, () => false);
                this.loading = Array.from({length: this.count}, () => false);
            });

        },
        formatDate(date) {
            if( !(date instanceof Date) ){
                date = new Date(date);
            }
            let dateString = date.toDateString();

            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            let strTime = hours + ':' + minutes + ' ' + ampm;
            return `${dateString} - ${strTime}`;
        },
        badgeClass(status){
            switch(status) {
                case 'PENDING': return 'primary'
                case 'PROCESSING': return 'secondary'
                case 'READY': return 'info'
                case 'OUTFORDELIVERY': return 'warning'
                case 'DELIVERED': return 'success'
                case 'CANCELLED': return 'danger'
                default: return 'primary'
            }
        },
        changeStatus(status, index) {

            const order_id = this.tableData[index].order_id;

            // set loading
            this.$set(this.loading, index, true);

            this.$axios({
                method: 'patch',
                url: '/orders/status',
                data: {
                    order_id: order_id,
                    status: status
                },
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Status changed."
                    });
                } else {
                    this.$notify({
                        type: "danger",
                        title: "Something went Wrong!",
                        message: "Status not changed."
                    });
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong!",
                    message: "Status not changed."
                });
            }).finally(() => {
                this.$set(this.loading, index, false);
                this.$set(this.tableData[index], 'order_status', status);
            });
        },
        deleteOrder() {
            const order_id = this.deleteID;
            const index = this.deleteIndex;

            this.deleteLoading = true;
            // send delete request
            this.$axios({
                method: 'delete',
                url: `/orders/order/${order_id}`
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Order Deleted."
                    });

                    // Delete the order from the array.
                    this.tableData.splice(index, 1);
                    this.getOrders();

                } else {
                    throw new Error('Order not deleted');
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong!",
                    message: "Order not deleted."
                });
            }).finally(() => {
                this.deleteID = null;
                this.deleteModal = false;
                this.deleteIndex = null;
                this.deleteLoading = false;
            });
        },
        listLocalbodies() {
            this.$axios({
                method: 'get',
                url: '/localbodies/list',
            }).then((response) => {
                const localbodies = response.data.localbodies.rows;
                
                this.districts = localbodies.map(item => item.district);
                this.districts = [ ...new Set(this.districts) ]; // remove duplicates
                this.localbodies = localbodies;
            });
        },
        filterLocalbodies() {
            this.selectedLocalbody = null;
            this.activeLocalbodies = this.localbodies.filter((item) => {
                if (item.district === this.selectedDistrict) {
                    return item;
                }
            });
        }
    },
    mounted() {
        this.getOrders();
        this.listLocalbodies();

        // create a socket connection to server.
        const socket = io(this.baseUrl);

        // Show notifications on new orders.
        socket.on('new-order', () => {

            // Remove all existing notifications.
            this.$notifications.state.forEach((notification) => {
                this.$notifications.removeNotification(notification.timestamp);
            });

            // notify the user.
            this.$notify({
                type: 'default',
                title: 'New Orders are here..!',
                timeout: 480000, // 480 seconds
                message: 'Click here or refresh to see new orders.',
                icon: 'fa fa-concierge-bell',
                onClick: () => {
                    this.getOrders();
                }
            });

            // play the bell notification tone
            const notifAudio = new Audio('/audio/notification.ogg');
            // wrap it in async await IIFE
            (async function(){
                await notifAudio.play();
            })();
            
        });
    },
};
</script>
<style>
.input__height > input {
    height: 2.2em;
    padding: 0px 10px;
}
</style>
