<template>
    <div>
        <div v-if="item.item_id">
            <div class="container">
                <img v-if="item.image_path" :src="`${baseUrl}/images/inventory/${item.image_path}`" class="item-image">
                <i v-else class="ni ni-image"></i> <!-- Alt Image -->
                <span class="pl-3 font-weight-bold">{{ item.item_name }}</span>
            </div>
            <div v-if="item.total_stock" class="container badge badge-primary">
                <span class="inline">Total Stock: </span>
                <span class="mr-1">{{ parseFloat(item.total_stock.quantity) }}</span>
                <span>{{ item.total_stock.unit }}</span>
            </div>
            
        </div>
        <div class="d-flex p-3" v-if="item.item_id">
            <base-button size="sm" icon="fa fa-plus" @click="addstockmodal = true">Add New Stock</base-button>
            <modal :show.sync="addstockmodal">
                <template slot="header">
                    <h1 class="modal-title">Add Stock</h1>
                </template>
                <add-stock @close-modal="closeAdd()"
                    :selectedProp="{
                        item_id: item.item_id,
                        item_name: item.item_name,
                        image_path: item.image_path,
                        unit: item.unit
                    }"
                >
                </add-stock>
            </modal>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="d-flex flex-row justify-content-start flex-wrap table-responsive">
                    <base-table
                        :data="displayStocks"
                        type="hover table-striped table-sm"
                    >
                        <template slot="columns">
                            <th>Stock Date</th>
                            <th>Quantity</th>
                            <th>Remaining Quantity</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </template>

                        <template slot-scope="{row}">
                            <td class="text-left">
                                {{ formatDate(row.arrival_date) }}
                            </td>
                            <td>
                                {{ parseFloat(row.quantity) }} {{ row.unit }}
                            </td>
                            <td>
                                {{ parseFloat(row.remaining_quantity) }} {{ row.remaining_unit }}
                            </td>
                            <td>
                                {{ parseFloat(row.cost) }}
                            </td>
                            <td>
                                <base-button
                                    icon="fa fa-edit"
                                    size="sm"
                                    type="info"
                                    @click="editID = row.stock_id; editstockmodal = true"
                                ></base-button>
                                <base-button
                                    icon="fa fa-trash-alt"
                                    size="sm"
                                    type="danger"
                                    @click="deleteStock(row.stock_id)"
                                ></base-button>
                            </td>
                        </template>
                    </base-table> <!-- Table -->
                </div> <!-- responsive-table -->
                <div class="modal-footer">
                    <base-pagination 
                        :page-count="total_pages"
                        :per-page="per_page"
                        v-model="page"
                        align="center">
                    </base-pagination>
                </div> <!-- modal footer -->
            </div> <!-- col-12 -->
        </div> <!-- row -->
        <modal :show.sync="editstockmodal">
            <template slot="header">
                <h1 class="modal-title">Edit Stock</h1>
            </template>
            <edit-stock :stock_id="editID" :edit="editstockmodal" @close-edit="closeEdit()"></edit-stock>
        </modal>
    </div>
</template>
<script>
import AddStock from '../Stocks/AddStock';
import EditStock from '../Stocks/EditStock';

export default {
    name: 'stocks',
    components: {
        AddStock,
        EditStock,
    },
    data: () => ({
        page: 1,
        per_page: 5,
        count: 0,
        stocks: [],
        item: {
            item_id: null
        },
        total_pages: 0,
        addstockmodal: false,
        editstockmodal: false,
        editID: null
    }),
    props: {
        item_id: {
            type: [String, Number],
        },
        modal: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        baseUrl() {
            // base url of api server where images are uploaded.
            return this.$store.getters.apiUrl;
        },
        displayStocks() {
            let start = (this.page - 1) * this.per_page;
            let end = start + this.per_page;
            return this.stocks.slice(start, end);
        }
    },
    watch: {
        page() {
            this.refreshPage();
        },
        modal() {
            if( this.edit === false || this.item_id === null ){
                this.stocks = null;
                this.stocks = [];
                this.item = Object.assign({},{
                    item_id: null
                });
                return;
            }
            this.getStocks(this.item_id);
        },
    },
    methods: {
        getStocks(item_id) {

            this.$axios({
                method: 'get',
                url: `/api/inventory/items/${item_id}`,
            }).then((response) => {
                if( response.data.data && response.data.data.item){
                    const item = response.data.data.item;
                    this.item = item;

                    if(item.stocks.length){
                        this.stocks = item.stocks;
                        this.count = this.stocks.length;
                        this.total_pages = Math.ceil( this.count / this.per_page );
                    } else {
                        this.stocks = [];
                        this.count = 0
                        this.total_pages = 0;
                    }
                }
            });

        },
        deleteStock(stock_id) {
            this.$axios({
                method: 'delete',
                url: `/api/stocks/${stock_id}`
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Stock Deleted."
                    });

                    // refresh page after deletion.
                    this.refreshPage();
                } else {
                    this.$notify({
                        type: "danger",
                        title: "Something went Wrong!",
                        message: "Stock not deleted."
                    });
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong!",
                    message: "Stock not deleted."
                });
            });
        },
        closeEdit() {
            this.editstockmodal = false;
            this.editID = null;
            
            this.refreshPage();
        },
        closeAdd() {
            this.addstockmodal = false;

            this.refreshPage();
        },
        formatDate(date) {
            if( !(date instanceof Date) ){
                date = new Date(date);
            }
            let dateString = date.toDateString();

            return dateString;
        },
        refreshPage() {
            this.getStocks(this.item_id);
        }
    },
};
</script>
<style scoped>
th, td {
    text-align: center;
}
.item-image {
    height: 40px;
}
</style>
