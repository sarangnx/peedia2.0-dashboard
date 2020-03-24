<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-12">
                    <div class="card shadow">
                        <div  class="card-header d-flex justify-content-between">
                            <h3>Stocks</h3>
                        </div> <!-- Outer Header -->
                        <div class="card-body d-flex flex-row justify-content-start flex-wrap table-responsive">
                            <div class="d-flex p-3">
                                <base-button size="sm" icon="fa fa-plus" @click="addstockmodal = true">Add New Stock</base-button>
                                <modal :show.sync="addstockmodal">
                                    <template slot="header">
                                        <h1 class="modal-title">Add Stock</h1>
                                    </template>
                                        <add-stock @close-modal="closeAdd()"></add-stock>
                                </modal>
                            </div>
                            <base-table
                                :data="stocks"
                                type="hover table-striped table-sm"
                            >
                                <template slot="columns">
                                    <th class="text-left">Product Name</th>
                                    <th>Quantity</th>
                                    <th>Remaining Quantity</th>
                                    <th>Cost</th>
                                    <th>Stock Date</th>
                                    <th>Actions</th>
                                </template>

                                <template slot-scope="{row}">
                                    <td class="text-left">
                                        {{ row.item ? row.item.item_name : '' }}
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
                                        {{ formatDate(row.arrival_date) }}
                                    </td>
                                    <td>
                                        <base-button
                                            icon="fa fa-edit"
                                            size="sm"
                                            type="info"
                                            title="Edit Stock Info"
                                            @click="editID = row.stock_id; editstockmodal = true"
                                        ></base-button>
                                        <base-button
                                            icon="fa fa-ban"
                                            size="sm"
                                            type="warning"
                                            title="Expire Stock"
                                            @click="expireStock(row.stock_id)"
                                        ></base-button>
                                        <base-button
                                            icon="fa fa-trash-alt"
                                            size="sm"
                                            type="danger"
                                            title="Delete Stock Info"
                                            @click="deleteStock(row.stock_id)"
                                        ></base-button>
                                    </td>
                                </template>
                            </base-table> <!-- Table -->
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
        <modal :show.sync="editstockmodal">
            <template slot="header">
                <h1 class="modal-title">Edit Stock</h1>
            </template>
            <edit-stock :stock_id="editID" :edit="editstockmodal" @close-edit="closeEdit()"></edit-stock>
        </modal>
    </div>
</template>
<script>
import AddStock from './Stocks/AddStock';
import EditStock from './Stocks/EditStock';

export default {
    name: 'stocks',
    components: {
        AddStock,
        EditStock,
    },
    data: () => ({
        page: 1,
        per_page: 20,
        count: 0,
        stocks: [],
        total_pages: 0,
        addstockmodal: false,
        editstockmodal: false,
        editID: null
    }),
    watch: {
        page() {
            this.refreshPage();
        }
    },
    methods: {
        getAllStocks(page, per_page) {

            this.$axios({
                method: 'get',
                url: '/api/stocks/all',
                params: {
                    page,
                    per_page
                },
            }).then((response) => {

                const data = response.data.data;
                this.stocks = data.stocks;
                this.count = data.count;
                this.total_pages = data.total_pages;
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
        expireStock(stock_id) {
            this.$axios({
                method: 'patch',
                url: `/api/stocks/expire/${stock_id}`
            }).then((response) => {
                if (response.data && response.data.status === "success") {
                    this.$notify({
                        type: "success",
                        title: "Success",
                        message: "Stock marked as Expired."
                    });

                    // refresh page after deletion.
                    this.refreshPage();
                } else {
                    this.$notify({
                        type: "danger",
                        title: "Something went Wrong!",
                        message: "Stock not marked as Expired."
                    });
                }
            }).catch(() => {
                this.$notify({
                    type: "danger",
                    title: "Something went Wrong!",
                    message: "Stock not marked as Expired."
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
            this.getAllStocks(this.page, this.per_page);
        }
    },
    mounted() {
        this.getAllStocks(this.page, this.per_page);
    }
};
</script>
<style scoped>
th, td {
    text-align: center;
}
</style>